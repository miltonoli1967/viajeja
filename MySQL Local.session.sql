CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`username`, `email`, `password`) VALUES
('john_doe', 'john.doe@example.com', 'hashed_password');
SELECT * FROM `users`;
UPDATE `users` SET `email` = 'john.doe.updated@example.com' WHERE `id` = 1; 
DELETE FROM `users` WHERE `id` = 1;
DROP TABLE IF EXISTS `users`;

SELECT * FROM `users` WHERE `username` = 'john_doe';