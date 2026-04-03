// auth.controller.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SALT_ROUNDS = 10;

async function register(req, res) {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(409).json({ message: 'Email déjà utilisé' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
      [email, hash, full_name || null]
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(201).json({ token, user: { id: userId, email, full_name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const [rows] = await pool.query('SELECT id, password_hash, full_name FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Identifiants incorrects' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Identifiants incorrects' });

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, user: { id: user.id, email, full_name: user.full_name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function me(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query('SELECT id, email, full_name, role, date_creation FROM users WHERE id = ?', [userId]);
    if (!rows.length) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// ... (tes imports et fonctions existantes)

async function updateProfile(req, res) {
  try {
    const userId = req.user.id; // Récupéré via ton middleware d'authentification
    const { full_name, email } = req.body;

    if (!full_name && !email) {
      return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
    }

    // Mise à jour dynamique selon ce qui est envoyé
    await pool.query(
      'UPDATE users SET full_name = COALESCE(?, full_name), email = COALESCE(?, email) WHERE id = ?',
      [full_name, email, userId]
    );

    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (err) {
    console.error(err);
    // Gestion de l'erreur si l'email est déjà pris par un autre utilisateur
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function updatePassword(req, res) {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Ancien et nouveau mot de passe requis' });
    }

    // 1. Vérifier l'ancien mot de passe
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    const user = rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
    }

    // 2. Hasher le nouveau mot de passe et sauvegarder
    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// N'oublie pas de mettre à jour les exports à la fin du fichier
module.exports = { register, login, me, updateProfile, updatePassword };