const db = require('../db');
const fs = require('fs');
const path = require('path');

class ChatService {

  // Mettre à jour le statut en ligne
  static async updateUserOnlineStatus(userId, isOnline) {
    try {
      const status = isOnline ? 1 : 0;
      const query = `UPDATE users SET is_online = ? WHERE id = ?`;
      await db.execute(query, [status, userId]);
      return true;
    } catch (error) {
      console.error('Erreur SQL updateUserOnlineStatus:', error);
      return false;
    }
  }

  // Récupérer l'historique de discussion
  static async getHistory(user1, user2) {
    try {
      const query = `
        SELECT id, sender_id, receiver_id, content, file_url, file_type, is_read, created_at
        FROM messages
        WHERE (sender_id = ? AND receiver_id = ?) 
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at ASC
      `;
      const [rows] = await db.execute(query, [user1, user2, user2, user1]);
      return rows;
    } catch (error) {
      console.error('Erreur SQL getHistory:', error);
      throw error;
    }
  }

  // Marquer la conversation comme lue
  static async markConversationAsRead(senderId, receiverId) {
    try {
      const query = `UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0`;
      const [result] = await db.execute(query, [senderId, receiverId]);
      console.log(`Messages de ${senderId} lus par ${receiverId}. Lignes affectées : ${result.affectedRows}`);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur SQL markConversationAsRead:', error);
      return false;
    }
  }

  // Fonction interne pour décoder et sauvegarder le fichier sur le disque dur
  static decodeAndSaveAudio(base64Data) {
    if (!base64Data || !base64Data.startsWith('data:audio')) return null;

    try {
      // 1. Découpage de l'en-tête base64
      const matches = base64Data.match(/^data:audio\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        console.error("[Audio] Chaîne base64 audio mal formater ou corrompue");
        return null;
      }

      const extension = matches[1]; // webm ou wav
      const pureBase64 = matches[2];
      const audioBuffer = Buffer.from(pureBase64, 'base64');

      // 2. Définition des chemins via la racine absolue du projet
      const fileName = `vocal_${Date.now()}.${extension}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const uploadPath = path.join(uploadDir, fileName);

      // Création automatique des répertoires s'ils n'existent pas sur le serveur
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`[Serveur] Dossier de stockage créé automatiquement dans : ${uploadDir}`);
      }

      // 3. Écriture du fichier audio binaire sur le disque
      fs.writeFileSync(uploadPath, audioBuffer);
      console.log(`[Audio] Fichier vocal écrit avec succès sur le disque : ${uploadPath}`);

      // 4. URL relative à enregistrer en BDD
      return `/uploads/${fileName}`;
    } catch (error) {
      console.error("❌ Erreur critique lors du décodage/sauvegarde audio :", error);
      return null;
    }
  }

  // Enregistrer un nouveau message
  static async saveMessage(senderId, receiverId, content, fileUrl = null, fileType = null) {
    try {
      const safeContent = (content !== null && content !== undefined) ? String(content).trim() : "";
      let finalFileUrl = fileUrl;

      // Si c'est un message audio brut contenant du base64, on le convertit en fichier réel
      if (fileType === 'audio' && fileUrl && fileUrl.startsWith('data:audio')) {
        finalFileUrl = this.decodeAndSaveAudio(fileUrl);
      }

      const query = `
        INSERT INTO messages (sender_id, receiver_id, content, file_url, file_type, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())
      `;

      const [result] = await db.execute(query, [senderId, receiverId, safeContent, finalFileUrl, fileType]);

      return {
        id: result.insertId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: safeContent,
        file_url: finalFileUrl,
        file_type: fileType,
        is_read: 0,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Erreur SQL saveMessage:', error);
      throw error;
    }
  }

}

module.exports = ChatService;