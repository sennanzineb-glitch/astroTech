-- Create intervention_workflow table to store workflow completion data
CREATE TABLE IF NOT EXISTS intervention_workflow (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intervention_id INT NOT NULL,

  -- Security checklist (JSON array of booleans)
  security_checklist JSON,

  -- Photos
  photos_before_count INT DEFAULT 0,
  photos_after_count INT DEFAULT 0,

  -- Comments and observations
  comment TEXT,
  client_observations TEXT,
  technical_observations TEXT,

  -- Quality control (JSON array of booleans)
  quality_control JSON,

  -- Signatures
  has_technician_signature BOOLEAN DEFAULT FALSE,
  technician_signature_data TEXT,
  has_client_signature BOOLEAN DEFAULT FALSE,
  client_signature_data TEXT,

  -- Additional work
  has_additional_work BOOLEAN DEFAULT FALSE,
  additional_work_description TEXT,
  additional_work_photos_count INT DEFAULT 0,
  has_additional_work_signature BOOLEAN DEFAULT FALSE,

  -- Quote information
  quote_comment TEXT,
  has_quote_signature BOOLEAN DEFAULT FALSE,

  -- Delivery notes
  delivery_note_photos_count INT DEFAULT 0,

  -- Client rating
  client_rating INT,

  -- Metadata
  completed_at TIMESTAMP NULL,
  completed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (intervention_id) REFERENCES intervention(id) ON DELETE CASCADE,
  FOREIGN KEY (completed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_intervention_id (intervention_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create intervention_photos table to store photos taken during intervention
CREATE TABLE IF NOT EXISTS intervention_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intervention_id INT NOT NULL,

  -- Photo metadata
  photo_type VARCHAR(50) NOT NULL, -- 'before', 'after', 'additional_work', 'delivery_note', 'quote'
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  url VARCHAR(500),

  -- Location data
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Additional metadata
  comment TEXT,
  drawing_data LONGTEXT, -- For annotated photos
  photo_context VARCHAR(100), -- Additional context for the photo
  local_id VARCHAR(100), -- ID from mobile app for sync tracking

  -- Timestamps
  captured_at TIMESTAMP NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by INT,

  FOREIGN KEY (intervention_id) REFERENCES intervention(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_intervention_id (intervention_id),
  INDEX idx_photo_type (photo_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create intervention_signatures table to store signatures
CREATE TABLE IF NOT EXISTS intervention_signatures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intervention_id INT NOT NULL,

  -- Signature data
  signature_type VARCHAR(50) NOT NULL, -- 'technician', 'client', 'additional_work', 'quote'
  signature_data LONGTEXT NOT NULL, -- Base64 encoded signature image

  -- Metadata
  signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  signed_by INT,

  FOREIGN KEY (intervention_id) REFERENCES intervention(id) ON DELETE CASCADE,
  FOREIGN KEY (signed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_intervention_id (intervention_id),
  INDEX idx_signature_type (signature_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create intervention_interruptions table to track work interruptions
CREATE TABLE IF NOT EXISTS intervention_interruptions (
  id VARCHAR(100) PRIMARY KEY,
  intervention_id INT NOT NULL,

  -- Interruption details
  reason VARCHAR(100) NOT NULL,
  custom_reason TEXT,

  -- Time tracking
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP NULL,
  duration_minutes INT,

  -- Metadata
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (intervention_id) REFERENCES intervention(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_intervention_id (intervention_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
