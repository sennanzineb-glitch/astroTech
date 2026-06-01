const ChatService = require("../services/chat.services");

class ChatController {
  
  /**
   * Récupère l'historique complet des messages entre deux utilisateurs
   * GET /api/v1/chat/history/:receiverId
   */
  static async apiGetHistory(req, res) {
    try {
      // Sécurité : Vérification que l'utilisateur est bien présent dans la requête via le middleware de token
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          error: "Utilisateur non authentifié ou token manquant."
        });
      }

      const myId = req.user.id; // ID de l'utilisateur connecté
      const { receiverId } = req.params; // ID du contact sélectionné passé dans l'URL

      console.log('*** Récupération historique ***', { utilisateurConnecte: myId, contactSelectionne: receiverId });
      
      // Validation stricte du paramètre requis
      if (!receiverId) {
        return res.status(400).json({ 
          success: false, 
          error: "L'identifiant du destinataire (receiverId) est requis." 
        });
      }

      // Appel au service mis à jour pour récupérer l'historique global
      const history = await ChatService.getHistory(myId, receiverId);

      // Réponse HTTP standardisée en cas de succès
      return res.status(200).json({
        success: true,
        data: history
      });

    } catch (error) {
      console.error('Erreur au sein du ChatController (apiGetHistory) :', error);
      return res.status(500).json({ 
        success: false, 
        error: "Une erreur interne est survenue lors de la récupération de l'historique." 
      });
    }
  }
  
}

module.exports = ChatController;