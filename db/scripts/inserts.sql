-- =====================================================================
-- Seed de datos iniciales
-- Ejecutar DESPUÉS de levantar la app una vez (TypeORM crea las tablas con synchronize).
-- Contraseña de TODOS los usuarios: password123
-- =====================================================================

-- Insert Roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator with full access to manage users, roles and exercises'),
('user', 'Regular user with access to routines and activity logs');

-- Insert Permissions (un permiso por operación CRUD de cada recurso)
INSERT INTO permissions (name, description) VALUES
-- Usuarios
('create_user', 'Create user accounts'),
('read_user', 'List and read user accounts'),
('update_user', 'Update user accounts'),
('delete_user', 'Delete user accounts'),
-- Roles y permisos
('create_role', 'Create roles'),
('read_role', 'List and read roles'),
('update_role', 'Update roles'),
('delete_role', 'Delete roles'),
('read_permission', 'List and read permissions'),
('assign_permission', 'Assign or remove permissions from roles'),
-- Catálogo de ejercicios
('create_exercise', 'Create exercises in the catalog'),
('read_exercise', 'List and read exercises'),
('update_exercise', 'Update exercises in the catalog'),
('delete_exercise', 'Delete exercises from the catalog'),
-- Rutinas
('create_routine', 'Create new workout routines'),
('read_routine', 'Read workout routines'),
('update_routine', 'Update existing workout routines'),
('delete_routine', 'Delete workout routines'),
-- Ejercicios de rutina
('create_routine_exercise', 'Add exercises to a routine'),
('read_routine_exercise', 'Read exercises of a routine'),
('update_routine_exercise', 'Update planned exercises of a routine'),
('delete_routine_exercise', 'Remove exercises from a routine'),
-- Sesiones
('create_activity_log', 'Register a training session'),
('read_activity_log', 'Read training sessions'),
('update_activity_log', 'Update training sessions'),
('delete_activity_log', 'Delete training sessions'),
-- Ejercicios realizados
('create_activity_exercise', 'Register a performed exercise'),
('read_activity_exercise', 'Read performed exercises'),
('update_activity_exercise', 'Update performed exercises'),
('delete_activity_exercise', 'Delete performed exercises'),
-- Alcance
('manage_all_records', 'Operate on routines and sessions of any user, not only own');

-- Insert Role-Permission relationships
-- Se asocian por NOMBRE (no por id) para que no dependa del orden de inserción.

-- admin: todos los permisos
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'admin';

-- user: consulta el catálogo y gestiona SOLO sus propias rutinas y sesiones
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.name IN (
    'read_exercise',
    'create_routine', 'read_routine', 'update_routine', 'delete_routine',
    'create_routine_exercise', 'read_routine_exercise', 'update_routine_exercise', 'delete_routine_exercise',
    'create_activity_log', 'read_activity_log', 'update_activity_log', 'delete_activity_log',
    'create_activity_exercise', 'read_activity_exercise', 'update_activity_exercise', 'delete_activity_exercise'
)
WHERE r.name = 'user';

-- Insert Users (password: password123)
INSERT INTO users (username, email, password_hash, bio, role_id, created_at) VALUES
('admin_user', 'admin@gym.com', '$2b$10$z72y0uOl1NdKsDJ8JqGW4.IeL5dCl2MojuqE9m/QtrVayb682PfCC', 'System administrator', 1, NOW()),
('juan_perez', 'juan@example.com', '$2b$10$z72y0uOl1NdKsDJ8JqGW4.IeL5dCl2MojuqE9m/QtrVayb682PfCC', 'Fitness enthusiast', 2, NOW()),
('maria_garcia', 'maria@example.com', '$2b$10$z72y0uOl1NdKsDJ8JqGW4.IeL5dCl2MojuqE9m/QtrVayb682PfCC', 'Crossfit practitioner', 2, NOW()),
('carlos_lopez', 'carlos@example.com', '$2b$10$z72y0uOl1NdKsDJ8JqGW4.IeL5dCl2MojuqE9m/QtrVayb682PfCC', 'Marathon runner', 2, NOW()),
('ana_martinez', 'ana@example.com', '$2b$10$z72y0uOl1NdKsDJ8JqGW4.IeL5dCl2MojuqE9m/QtrVayb682PfCC', 'Powerlifting athlete', 2, NOW());

-- Insert Exercises
INSERT INTO exercises (name, description, type, estimated_calories, estimated_distance_km, estimated_duration_min, icon) VALUES
('Push-ups', 'Upper body strength exercise targeting chest and triceps', 'strength', 50.0, 0.0, 10, 'pushup_icon.png'),
('Squats', 'Lower body strength exercise targeting quads and glutes', 'strength', 80.0, 0.0, 15, 'squat_icon.png'),
('Outdoor Running', 'Cardio exercise for endurance and leg strength', 'cardio', 300.0, 5.0, 30, 'running_icon.png'),
('Bench Press', 'Barbell exercise for chest and triceps', 'strength', 120.0, 0.0, 20, 'benchpress_icon.png'),
('Plank', 'Core stability exercise', 'core', 40.0, 0.0, 5, 'plank_icon.png');

-- Insert Routines
INSERT INTO routines (user_id, name, description, created_at, updated_at) VALUES
(2, 'Full Body Routine', 'A balanced routine targeting all major muscle groups', NOW() - INTERVAL '5 days', NOW()),
(3, 'Cardio & Core Burst', 'High intensity cardio combined with core exercises', NOW() - INTERVAL '3 days', NOW()),
(4, 'Upper Body Strength', 'Heavy chest and triceps focus', NOW() - INTERVAL '2 days', NOW());

-- Insert Routine Exercises
INSERT INTO routine_exercises (routine_id, exercise_id, order_index, target_sets, target_reps, target_weight_kg, target_duration_min) VALUES
(1, 1, 1, 4, 15, 0.0, 10),
(1, 2, 2, 4, 12, 50.0, 15),
(1, 5, 3, 3, 1, 0.0, 5),
(2, 3, 1, 1, 1, 0.0, 30),
(2, 5, 2, 4, 1, 0.0, 5),
(3, 1, 1, 4, 20, 0.0, 10),
(3, 4, 2, 4, 8, 80.0, 20);

-- Insert Activity Logs
INSERT INTO activity_logs (user_id, routine_id, started_at, completed_at, created_at) VALUES
(2, 1, NOW() - INTERVAL '2 days' - INTERVAL '1 hour', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(3, 2, NOW() - INTERVAL '1 day' - INTERVAL '40 minutes', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Insert Activity Exercises
INSERT INTO activity_exercises (activity_log_id, routine_exercise_id, actual_sets, actual_reps, actual_weight_kg, actual_duration_min, calories_burned, distance_covered_km, started_at, completed_at) VALUES
(1, 1, 4, 15, 0.0, 10, 55.0, 0.0, NOW() - INTERVAL '2 days' - INTERVAL '1 hour', NOW() - INTERVAL '2 days' - INTERVAL '50 minutes'),
(1, 2, 4, 12, 50.0, 15, 85.0, 0.0, NOW() - INTERVAL '2 days' - INTERVAL '50 minutes', NOW() - INTERVAL '2 days' - INTERVAL '35 minutes'),
(1, 3, 3, 1, 0.0, 5, 42.0, 0.0, NOW() - INTERVAL '2 days' - INTERVAL '35 minutes', NOW() - INTERVAL '2 days' - INTERVAL '30 minutes'),
(2, 4, 1, 1, 0.0, 32, 320.0, 5.2, NOW() - INTERVAL '1 day' - INTERVAL '40 minutes', NOW() - INTERVAL '1 day' - INTERVAL '8 minutes'),
(2, 5, 4, 1, 0.0, 5, 45.0, 0.0, NOW() - INTERVAL '1 day' - INTERVAL '8 minutes', NOW() - INTERVAL '1 day');
