import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary Colors - Professional Navy Blue (Solitech branding)
  static const Color primary = Color(0xFF003E82);        // Deep navy
  static const Color primaryDark = Color(0xFF002952);    // Darker navy
  static const Color primaryLight = Color(0xFF1565C0);   // Lighter blue

  // Secondary Colors - Professional Teal/Cyan (Solitech accent)
  static const Color accent = Color(0xFF0099CC);         // Tech cyan
  static const Color accentDark = Color(0xFF006B8F);     // Dark cyan

  // Status Colors
  static const Color success = Color(0xFF4CAF50);
  static const Color warning = Color(0xFFFF9800);
  static const Color error = Color(0xFFF44336);
  static const Color info = Color(0xFF2196F3);

  // Enhanced Gray Palette for Better Hierarchy
  static const Color background = Color(0xFFF8F9FA);     // Slightly warmer
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF5F7FA); // Card alternative
  static const Color cardBackground = Color(0xFFFFFFFF);

  static const Color textPrimary = Color(0xFF1A1A1A);    // True black
  static const Color textSecondary = Color(0xFF6C757D);  // Medium gray
  static const Color textHint = Color(0xFFADB5BD);       // Light gray
  static const Color divider = Color(0xFFDEE2E6);        // Subtle divider

  // Priority colors
  static const Color priorityUrgent = Color(0xFFF44336);
  static const Color priorityHigh = Color(0xFFFF9800);
  static const Color priorityNormal = Color(0xFF4CAF50);
  static const Color priorityLow = Color(0xFF9E9E9E);

  // Status Badge Colors
  static const Color statusPlanifie = Color(0xFF2196F3);
  static const Color statusEnCours = Color(0xFFFF9800);
  static const Color statusTermine = Color(0xFF4CAF50);
  static const Color statusNonValidee = Color(0xFF9E9E9E);

  // Workflow step colors
  static const Color stepComplete = Color(0xFF4CAF50);
  static const Color stepCurrent = Color(0xFF003E82);    // Use primary navy
  static const Color stepPending = Color(0xFFBDBDBD);

  // Offline indicator
  static const Color offline = Color(0xFF757575);
  static const Color online = Color(0xFF4CAF50);
  static const Color syncing = Color(0xFFFF9800);

  // New Semantic Colors for Enhanced Design
  static const Color cardBorder = Color(0xFFE9ECEF);
  static const Color cardShadow = Color(0x1A000000);     // 10% black
}
