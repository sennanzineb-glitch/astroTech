const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Note : Assure-toi que ChatService contient la logique DB pour is_online
const ChatService = require('./services/chat.services.js');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3006;

// Middleware
app.disable('x-powered-by');
app.use(cors());

// Augmentation de la limite de taille pour accepter les fichiers encodés en Base64
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 🔥 Configuration du dossier public d'upload pour l'accès HTTP depuis Angular
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Imports des contrôleurs et middlewares
const { register, login, me } = require('./controllers/_auth.controller');
const { authenticateToken } = require('./middlewares/auth.js');
const ChatController = require('./controllers/chat.controller');

// Routes API
app.post('/api/v1/auth/register', register);
app.post('/api/v1/auth/login', login);
app.get('/api/v1/auth/me', authenticateToken, me);
app.get('/api/v1/chat/history/:receiverId', authenticateToken, ChatController.apiGetHistory);

// Logique Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

/**
 * Gestion des utilisateurs en ligne (Mémoire vive pour Socket.io)
 */
let onlineUsers = new Map(); // Map<userId, socketId>

io.on('connection', (socket) => {
  console.log(`Tentative de connexion socket : ${socket.id}`);

  // Évènement 'join' : L'utilisateur s'identifie
  socket.on('join', async (userId) => {
    if (!userId) return;

    try {
      const uId = String(userId);

      // 1. Rejoindre sa room privée
      socket.join(`user_${uId}`);

      // 2. Stocker dans la Map et attacher l'ID au socket
      onlineUsers.set(uId, socket.id);
      socket.userId = uId;

      // 3. Mettre à jour la Base de Données (is_online = 1)
      await ChatService.updateUserOnlineStatus(uId, true);

      console.log(`Utilisateur ${uId} est EN LIGNE`);

      // 4. Informer TOUS les clients du nouveau statut
      io.emit('user_status_change', Array.from(onlineUsers.keys()));

    } catch (error) {
      console.error("Erreur lors du join:", error);
    }
  });

  // Gestion de l'envoi de message (Modifié pour décoder et stocker physiquement le Base64)
  // Gestion de l'envoi de message (Version de décodage robuste)
  socket.on('send_message', async (data) => {
    try {
      let { content, receiverId, senderId, file_url, file_type } = data;

      if ((!content && !file_url) || !receiverId || !senderId) return;

      // Si file_url contient du Base64 valide
      if (file_url && file_url.startsWith('data:')) {
        try {
          const extension = file_type === 'image' ? 'png' : 'webm';
          const filename = `vocal_${Date.now()}.${extension}`;
          const filePath = path.join(uploadDir, filename);

          // 🔥 DECODAGE SECURISE : On coupe proprement après la virgule indispensable du Base64
          const semiColonIndex = file_url.indexOf(',');
          if (semiColonIndex !== -1) {
            const base64PureData = file_url.substring(semiColonIndex + 1);
            const buffer = Buffer.from(base64PureData, 'base64');

            // Écriture physique du fichier audio/image
            fs.writeFileSync(filePath, buffer);
            console.log(`✅ Fichier valide enregistré : ${filePath}`);

            // URL relative pour la Base de Données
            file_url = `/uploads/${filename}`;
          } else {
            throw new Error("Format Base64 invalide (virgule manquante)");
          }

        } catch (fileErr) {
          console.error("❌ Échec critique du décodage/écriture :", fileErr);
          file_url = null;
        }
      }

      // Sauvegarde en Base de Données
      const savedMsg = await ChatService.saveMessage(senderId, receiverId, content, file_url, file_type);

      // Diffusion instantanée
      io.to(`user_${receiverId}`).to(`user_${senderId}`).emit('receive_message', savedMsg);
      socket.emit('message_sent', { status: 'success', msgId: savedMsg.id });

    } catch (err) {
      console.error('Erreur Chat Socket:', err);
    }
  });

  socket.on('mark_messages_seen', async (data) => {
    const { senderId, receiverId } = data;
    const success = await ChatService.markConversationAsRead(senderId, receiverId);
    if (success) {
      // On informe l'expéditeur (senderId) que ses messages ont été lus par receiverId
      io.to(`user_${senderId}`).emit('messages_marked_read', {
        seenBy: receiverId
      });
    }
  });

  // Déconnexion
  socket.on('disconnect', async () => {
    if (socket.userId) {
      try {
        const uId = socket.userId;

        // 1. Supprimer de la Map des connectés
        onlineUsers.delete(uId);

        // 2. Mettre à jour la Base de Données (is_online = 0)
        await ChatService.updateUserOnlineStatus(uId, false);

        console.log(`Utilisateur ${uId} est HORS LIGNE`);

        // 3. Informer tout le monde de la déconnexion
        io.emit('user_status_change', Array.from(onlineUsers.keys()));

      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Chat Service] Opérationnel sur le port ${PORT}`);
});