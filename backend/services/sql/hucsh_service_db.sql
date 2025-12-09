-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_email` VARCHAR(255) NOT NULL,
  `active_user` INT(11) NOT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE (`user_email`)
) ENGINE=InnoDB;

-- Create user_info table
CREATE TABLE IF NOT EXISTS `user_info` (
  `user_info_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `user_first_name` VARCHAR(255) NOT NULL,
  `user_last_name` VARCHAR(255) NOT NULL,
  `user_phone` VARCHAR(255),
  PRIMARY KEY (`user_info_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
) ENGINE=InnoDB;

-- Create user password table
CREATE TABLE IF NOT EXISTS `user_pass` (
  `user_pass_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `user_password_hashed` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_pass_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
) ENGINE=InnoDB;

-- Create facility_roles table
CREATE TABLE IF NOT EXISTS `facility_roles` (
  `facility_role_id` INT(11) NOT NULL AUTO_INCREMENT,
  `facility_role_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`facility_role_id`),
  UNIQUE (`facility_role_name`)
) ENGINE=InnoDB;

-- Create employee table
CREATE TABLE IF NOT EXISTS `employee` (
  `employee_id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_email` VARCHAR(255) NOT NULL,
  `active_employee` INT(11) NOT NULL,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`employee_id`),
  UNIQUE (`employee_email`)
) ENGINE=InnoDB;

-- Create employee_info table
CREATE TABLE IF NOT EXISTS `employee_info` (
  `employee_info_id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_id` INT(11) NOT NULL,
  `employee_first_name` VARCHAR(255) NOT NULL,
  `employee_last_name` VARCHAR(255) NOT NULL,
  `employee_phone` VARCHAR(255),
  PRIMARY KEY (`employee_info_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`)
) ENGINE=InnoDB;

-- Create employee_pass table
CREATE TABLE IF NOT EXISTS `employee_pass` (
  `employee_pass_id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_id` INT(11) NOT NULL,
  `employee_password_hashed` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`employee_pass_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`)
) ENGINE=InnoDB;

-- Create employee_role table (Ensuring Every Employee Has One Role)
CREATE TABLE IF NOT EXISTS `employee_role` (
  `employee_role_id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_id` INT(11) NOT NULL,
  `facility_role_id` INT(11) NOT NULL,
  PRIMARY KEY (`employee_role_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`),
  FOREIGN KEY (`facility_role_id`) REFERENCES `facility_roles`(`facility_role_id`),
  UNIQUE (`employee_id`)
) ENGINE=InnoDB;

-- Create pharmacies table
CREATE TABLE IF NOT EXISTS `pharmacies` (
  `pharma_id` INT(11) NOT NULL AUTO_INCREMENT,
  `pharma_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`pharma_id`)
) ENGINE=InnoDB;

-- Create medications table
CREATE TABLE IF NOT EXISTS `medications` (
  `medication_id` INT(11) NOT NULL AUTO_INCREMENT,
  `medication_name` VARCHAR(255) NOT NULL,
  `pharma_id` INT(11) NOT NULL,
  `availability` TINYINT(1) NOT NULL,
  `availability_updated` DATETIME NOT NULL,
  `dosage` DECIMAL(10,2),
  `dosage_unit` VARCHAR(50),
  `category` INT(11) NOT NULL,
  PRIMARY KEY (`medication_id`),
  FOREIGN KEY (`pharma_id`) REFERENCES `pharmacies`(`pharma_id`)
) ENGINE=InnoDB;

-- Insert initial roles into facility_roles table
INSERT INTO `facility_roles` (`facility_role_name`)
VALUES ('Manager'), ('Pharmacy11 Admin'), ('Pharmacy92 Admin'), ('Pharmacy125 Admin');

-- Insert initial pharmacies
INSERT INTO `pharmacies` (`pharma_name`)
VALUES ('Pharmacy 11'), ('Pharmacy 92'), ('Pharmacy 125');
