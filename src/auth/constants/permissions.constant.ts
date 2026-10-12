/**
 * Catálogo central de permisos de la aplicación.
 *
 * Cada operación protegida usa una de estas constantes en lugar de escribir el texto a mano,
 * así un error de tipeo se detecta al compilar y no en tiempo de ejecución.
 * Los nombres deben coincidir con los registros de la tabla `permissions` (ver db/scripts/inserts.sql).
 */
export const PERMISSIONS = {
    // Usuarios
    CREATE_USER: 'create_user',
    READ_USER: 'read_user',
    UPDATE_USER: 'update_user',
    DELETE_USER: 'delete_user',

    // Roles y su asociación con permisos
    CREATE_ROLE: 'create_role',
    READ_ROLE: 'read_role',
    UPDATE_ROLE: 'update_role',
    DELETE_ROLE: 'delete_role',
    READ_PERMISSION: 'read_permission',
    ASSIGN_PERMISSION: 'assign_permission',

    // Catálogo de ejercicios
    CREATE_EXERCISE: 'create_exercise',
    READ_EXERCISE: 'read_exercise',
    UPDATE_EXERCISE: 'update_exercise',
    DELETE_EXERCISE: 'delete_exercise',

    // Rutinas
    CREATE_ROUTINE: 'create_routine',
    READ_ROUTINE: 'read_routine',
    UPDATE_ROUTINE: 'update_routine',
    DELETE_ROUTINE: 'delete_routine',

    // Ejercicios dentro de una rutina
    CREATE_ROUTINE_EXERCISE: 'create_routine_exercise',
    READ_ROUTINE_EXERCISE: 'read_routine_exercise',
    UPDATE_ROUTINE_EXERCISE: 'update_routine_exercise',
    DELETE_ROUTINE_EXERCISE: 'delete_routine_exercise',

    // Sesiones de entrenamiento (historial)
    CREATE_ACTIVITY_LOG: 'create_activity_log',
    READ_ACTIVITY_LOG: 'read_activity_log',
    UPDATE_ACTIVITY_LOG: 'update_activity_log',
    DELETE_ACTIVITY_LOG: 'delete_activity_log',

    // Ejercicios realmente ejecutados en una sesión
    CREATE_ACTIVITY_EXERCISE: 'create_activity_exercise',
    READ_ACTIVITY_EXERCISE: 'read_activity_exercise',
    UPDATE_ACTIVITY_EXERCISE: 'update_activity_exercise',
    DELETE_ACTIVITY_EXERCISE: 'delete_activity_exercise',

    // Permite operar sobre rutinas y sesiones de CUALQUIER usuario (no solo las propias)
    MANAGE_ALL_RECORDS: 'manage_all_records',
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
