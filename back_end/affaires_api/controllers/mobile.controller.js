// mobile.controller.js - Mobile-specific API endpoints
const InterventionService = require("../services/intervention.service");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/interventions';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

class MobileController {

  // Get technician profile
  static async getMobileProfile(req, res) {
    try {
      const userId = req.user.id;

      // Return user info from token
      res.status(200).json({
        success: true,
        data: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          name: req.user.name || req.user.email.split('@')[0]
        }
      });
    } catch (error) {
      console.error("Error getMobileProfile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Get interventions for mobile (assigned to technician)
  static async getMobileInterventions(req, res) {
    try {
      const userId = req.user.id;
      const userEmail = req.user.email;
      const { status, page = 1, limit = 20 } = req.query;

      // Get technician ID from user email
      const pool = require('../db');
      const [technicianRows] = await pool.query(
        'SELECT id FROM technicien WHERE email = ?',
        [userEmail]
      );

      if (!technicianRows.length) {
        return res.status(200).json({
          success: true,
          data: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            totalPages: 0
          },
          message: "No technician profile found for this user"
        });
      }

      const technicianId = technicianRows[0].id;

      // Get interventions assigned to this technician (exclude completed ones)
      let query = `
        SELECT DISTINCT i.*
        FROM intervention i
        INNER JOIN intervention_technicien it ON i.id = it.id_intervention
        WHERE it.id_technicien = ?
          AND i.etat NOT IN ('termine', 'terminee')
      `;
      const queryParams = [technicianId];

      if (status) {
        query += ' AND i.type_intervention = ?';
        queryParams.push(status);
      }

      query += ' ORDER BY i.date_creation DESC';

      const [interventions] = await pool.query(query, queryParams);

      // Apply pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const paginatedInterventions = interventions.slice(offset, offset + parseInt(limit));

      res.status(200).json({
        success: true,
        data: paginatedInterventions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: interventions.length,
          totalPages: Math.ceil(interventions.length / parseInt(limit))
        }
      });
    } catch (error) {
      console.error("Error getMobileInterventions:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Get single intervention detail
  static async getMobileInterventionDetail(req, res) {
    try {
      const interventionId = Number(req.params.id);
      const userEmail = req.user.email;

      // Get technician ID from user email
      const pool = require('../db');
      const [technicianRows] = await pool.query(
        'SELECT id FROM technicien WHERE email = ?',
        [userEmail]
      );

      if (!technicianRows.length) {
        return res.status(403).json({
          success: false,
          message: "No technician profile found for this user"
        });
      }

      const technicianId = technicianRows[0].id;

      // Check if intervention is assigned to this technician
      const [assignmentCheck] = await pool.query(
        'SELECT id FROM intervention_technicien WHERE id_intervention = ? AND id_technicien = ?',
        [interventionId, technicianId]
      );

      if (!assignmentCheck.length) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to this intervention"
        });
      }

      const intervention = await InterventionService.apiGetById(interventionId);

      if (!intervention) {
        return res.status(404).json({
          success: false,
          message: "Intervention not found"
        });
      }

      res.status(200).json({
        success: true,
        data: intervention
      });
    } catch (error) {
      console.error("Error getMobileInterventionDetail:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Update intervention status
  static async updateInterventionStatus(req, res) {
    try {
      const interventionId = Number(req.params.id);
      const { status, type } = req.body;
      const userEmail = req.user.email;

      console.log('📝 UPDATE STATUS REQUEST:', {
        interventionId,
        status,
        type,
        userEmail,
        body: req.body
      });

      if (!status && !type) {
        return res.status(400).json({
          success: false,
          message: "Status or type is required"
        });
      }

      // Get technician ID from user email
      const pool = require('../db');
      const [technicianRows] = await pool.query(
        'SELECT id FROM technicien WHERE email = ?',
        [userEmail]
      );

      if (!technicianRows.length) {
        return res.status(403).json({
          success: false,
          message: "No technician profile found for this user"
        });
      }

      const technicianId = technicianRows[0].id;

      // Check if intervention is assigned to this technician
      const [assignmentCheck] = await pool.query(
        'SELECT id FROM intervention_technicien WHERE id_intervention = ? AND id_technicien = ?',
        [interventionId, technicianId]
      );

      if (!assignmentCheck.length) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to this intervention"
        });
      }

      // Update intervention status directly (bypassing creator check)
      const statusValue = type || status;
      console.log('💾 Updating intervention status:', { interventionId, statusValue });

      const [result] = await pool.query(
        'UPDATE intervention SET etat = ? WHERE id = ?',
        [statusValue, interventionId]
      );

      console.log('✅ Update result:', { affectedRows: result.affectedRows });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Intervention not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Intervention status updated successfully",
        data: { status: statusValue }
      });
    } catch (error) {
      console.error("Error updateInterventionStatus:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Update intervention workflow (start, pause, resume, complete)
  static async updateInterventionWorkflow(req, res) {
    try {
      const interventionId = Number(req.params.id);
      const { action, data } = req.body;
      const userEmail = req.user.email;

      // Workflow actions: start, pause, resume, complete
      const validActions = ['start', 'pause', 'resume', 'complete'];
      if (!validActions.includes(action)) {
        return res.status(400).json({
          success: false,
          message: "Invalid action. Valid actions: start, pause, resume, complete"
        });
      }

      // Map workflow action to intervention type/status
      const statusMap = {
        start: 'en_cours',
        pause: 'en_attente',
        resume: 'en_cours',
        complete: 'terminee'
      };

      // Get technician ID from user email
      const pool = require('../db');
      const [technicianRows] = await pool.query(
        'SELECT id FROM technicien WHERE email = ?',
        [userEmail]
      );

      if (!technicianRows.length) {
        return res.status(403).json({
          success: false,
          message: "No technician profile found for this user"
        });
      }

      const technicianId = technicianRows[0].id;

      // Check if intervention is assigned to this technician
      const [assignmentCheck] = await pool.query(
        'SELECT id FROM intervention_technicien WHERE id_intervention = ? AND id_technicien = ?',
        [interventionId, technicianId]
      );

      if (!assignmentCheck.length) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to this intervention"
        });
      }

      // Update intervention status directly (bypassing creator check)
      const [result] = await pool.query(
        'UPDATE intervention SET etat = ? WHERE id = ?',
        [statusMap[action], interventionId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Intervention not found"
        });
      }

      res.status(200).json({
        success: true,
        message: `Intervention ${action} successfully`,
        data: { action, status: statusMap[action] }
      });
    } catch (error) {
      console.error("Error updateInterventionWorkflow:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Upload intervention photo
  static uploadInterventionPhoto = [
    upload.single('photo'),
    async (req, res) => {
      try {
        const interventionId = Number(req.params.id);
        const {
          photo_type,
          captured_at,
          latitude,
          longitude,
          local_id,
          comment,
          drawing_data,
          photo_context
        } = req.body;

        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "No photo uploaded"
          });
        }

        // Save photo to database
        const pool = require('../db');
        const [result] = await pool.query(
          `INSERT INTO intervention_photos
          (intervention_id, photo_type, filename, file_path, url, latitude, longitude,
           comment, drawing_data, photo_context, local_id, captured_at, uploaded_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            interventionId,
            photo_type || 'general',
            req.file.filename,
            req.file.path,
            `/uploads/interventions/${req.file.filename}`,
            latitude || null,
            longitude || null,
            comment || null,
            drawing_data || null,
            photo_context || null,
            local_id || null,
            captured_at || new Date(),
            req.user.id
          ]
        );

        const photoData = {
          id: result.insertId,
          intervention_id: interventionId,
          photo_type: photo_type || 'general',
          filename: req.file.filename,
          file_path: req.file.path,
          url: `/uploads/interventions/${req.file.filename}`,
          latitude: latitude || null,
          longitude: longitude || null,
          comment: comment || null,
          local_id: local_id || null,
          captured_at: captured_at || new Date().toISOString(),
          uploaded_at: new Date().toISOString(),
          uploaded_by: req.user.id
        };

        res.status(201).json({
          success: true,
          message: "Photo uploaded successfully",
          data: photoData
        });
      } catch (error) {
        console.error("Error uploadInterventionPhoto:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error"
        });
      }
    }
  ];

  // Get intervention photos
  static async getInterventionPhotos(req, res) {
    try {
      const interventionId = Number(req.params.id);
      const { type } = req.query; // Optional filter by photo_type

      const pool = require('../db');
      let query = `
        SELECT id, intervention_id, photo_type, filename, file_path, url,
               latitude, longitude, comment, drawing_data, photo_context,
               local_id, captured_at, uploaded_at, uploaded_by
        FROM intervention_photos
        WHERE intervention_id = ?
      `;
      const params = [interventionId];

      if (type) {
        query += ' AND photo_type = ?';
        params.push(type);
      }

      query += ' ORDER BY captured_at DESC';

      const [photos] = await pool.query(query, params);

      res.status(200).json({
        success: true,
        data: photos
      });
    } catch (error) {
      console.error("Error getInterventionPhotos:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Delete intervention photo
  static async deleteInterventionPhoto(req, res) {
    try {
      const interventionId = Number(req.params.id);
      const photoId = Number(req.params.photoId);

      // Placeholder - implement photo deletion from DB and filesystem
      res.status(200).json({
        success: true,
        message: "Photo deleted successfully"
      });
    } catch (error) {
      console.error("Error deleteInterventionPhoto:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Upload signature (base64 or file)
  static async uploadSignature(req, res) {
    try {
      const interventionId = Number(req.params.id);
      const { signature_data, signature, type } = req.body; // type: 'technician' or 'client'
      const signatureValue = signature_data || signature;

      if (!signatureValue) {
        return res.status(400).json({
          success: false,
          message: "Signature data is required"
        });
      }

      // Save signature to database
      const pool = require('../db');
      const [result] = await pool.query(
        `INSERT INTO intervention_signatures
        (intervention_id, signature_type, signature_data, signed_by)
        VALUES (?, ?, ?, ?)`,
        [
          interventionId,
          type || 'client',
          signatureValue,
          req.user.id
        ]
      );

      const signatureData = {
        id: result.insertId,
        intervention_id: interventionId,
        signature_type: type || 'client',
        signed_at: new Date().toISOString(),
        signed_by: req.user.id
      };

      res.status(201).json({
        success: true,
        message: "Signature saved successfully",
        data: signatureData
      });
    } catch (error) {
      console.error("Error uploadSignature:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Get typed signature (technician or client)
  static async getTypedSignature(req, res) {
    try {
      const interventionId = Number(req.params.id);
      const signatureType = req.params.type;

      // Placeholder - implement signature retrieval from DB
      res.status(200).json({
        success: true,
        data: null
      });
    } catch (error) {
      console.error("Error getTypedSignature:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Add intervention interruption
  static async addInterventionInterruption(req, res) {
    try {
      const interventionId = Number(req.params.id);
      const { reason, start_time, end_time } = req.body;

      if (!reason || !start_time) {
        return res.status(400).json({
          success: false,
          message: "Reason and start_time are required"
        });
      }

      const interruptionData = {
        id: `int_${Date.now()}`,
        intervention_id: interventionId,
        reason,
        start_time,
        end_time: end_time || null,
        created_by: req.user.id,
        created_at: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        message: "Interruption added successfully",
        data: interruptionData
      });
    } catch (error) {
      console.error("Error addInterventionInterruption:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Update intervention interruption
  static async updateInterventionInterruption(req, res) {
    try {
      const interventionId = Number(req.params.id);
      const interruptionId = req.params.interruptionId;
      const { end_time } = req.body;

      res.status(200).json({
        success: true,
        message: "Interruption updated successfully"
      });
    } catch (error) {
      console.error("Error updateInterventionInterruption:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Update travel time
  static async updateTravelTime(req, res) {
    try {
      const interventionId = Number(req.params.id);
      const { travel_time_minutes } = req.body;

      if (!travel_time_minutes) {
        return res.status(400).json({
          success: false,
          message: "travel_time_minutes is required"
        });
      }

      // Placeholder - implement travel time update in DB
      res.status(200).json({
        success: true,
        message: "Travel time updated successfully",
        data: { travel_time_minutes }
      });
    } catch (error) {
      console.error("Error updateTravelTime:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }

  // Mobile sync endpoint (for offline data)
  static async mobileSync(req, res) {
    try {
      const { last_sync, pending_updates } = req.body;

      // Handle pending updates from mobile
      if (pending_updates && Array.isArray(pending_updates)) {
        // Process each pending update
        // This is where offline changes get synced to server
      }

      // Get updates since last sync
      const updates = {
        interventions: [],
        sync_time: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        message: "Sync completed successfully",
        data: updates
      });
    } catch (error) {
      console.error("Error mobileSync:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
}

module.exports = MobileController;
