-- Initial values for the database

-- Insert initial roles
INSERT INTO `roles` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
('clxrole000000000001', 'admin', 'Administrator with all permissions', NOW(3), NOW(3)),
('clxrole000000000002', 'user', 'Standard user with basic permissions', NOW(3), NOW(3));

-- You can add more initial data here, for example, a default admin user.
-- Note: Remember to hash the password properly if you add a user.
-- Example for adding a user (replace with a real hashed password):
-- INSERT INTO `users` (`id`, `email`, `name`, `password`, `createdAt`, `updatedAt`) VALUES
-- ('clxuser000000000001', 'admin@example.com', 'Admin User', 'some_hashed_password', NOW(3), NOW(3));

-- Example for assigning the admin role to the admin user:
-- INSERT INTO `user_roles` (`id`, `userId`, `roleId`) VALUES
-- ('clxuserrole0000001', 'clxuser000000000001', 'clxrole000000000001');

-- Insert admin user
INSERT INTO `users` (`id`, `email`, `name`, `password`, `createdAt`, `updatedAt`) VALUES
('clxuser000000000001', 'admin@example.com', 'Admin User', '$2b$10$HKZ54ALpGyG6ouiHqrl76ufS1i0EZeHV2zQxCuzQTH0BOA1v3.5VK', NOW(3), NOW(3));

-- Assign admin role to admin user
INSERT INTO `user_roles` (`id`, `userId`, `roleId`) VALUES
('clxuserrole0000001', 'clxuser000000000001', 'clxrole000000000001');