/**
 * Prueba automática de accesos autorizados y denegados.
 *
 * Requisitos: la API corriendo y la BD recién sembrada con db/scripts/inserts.sql
 * Uso:        node api-tests/permissions-test.mjs            (por defecto http://localhost:3000)
 *             BASE_URL=http://localhost:4000 node api-tests/permissions-test.mjs
 */
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
let passed = 0;
let failed = 0;

async function call(method, path, token, body) {
    const res = await fetch(BASE + path, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }
    return { status: res.status, data };
}

async function expect(label, expected, method, path, token, body) {
    const res = await call(method, path, token, body);
    const ok = res.status === expected;
    ok ? passed++ : failed++;
    console.info(`${ok ? 'OK  ' : 'FAIL'} [${res.status}${ok ? '' : ` != ${expected}`}] ${label}`);
    if (!ok) console.info('      ', JSON.stringify(res.data));
    return res;
}

async function login(email) {
    const res = await call('POST', '/auth/login', null, { email, password: 'password123' });
    if (res.status !== 200) throw new Error(`Login fallido para ${email}: ${JSON.stringify(res.data)}`);
    return res.data.access_token;
}

const admin = await login('admin@gym.com');
const juan = await login('juan@example.com'); // rol user, dueño de la rutina 1 y la sesión 1
const maria = await login('maria@example.com'); // rol user, dueña de la rutina 2 y la sesión 2

console.info('\n== Autenticación (401) ==');
await expect('Sin token no se listan ejercicios', 401, 'GET', '/exercises');
await expect('Token inválido', 401, 'GET', '/exercises', 'token.falso.123');
await expect('Login con contraseña incorrecta', 401, 'POST', '/auth/login', null, {
    email: 'admin@gym.com',
    password: 'incorrecta',
});

console.info('\n== Usuarios (solo admin) ==');
const users = await expect('Admin lista usuarios', 200, 'GET', '/users', admin);
if (users.data?.[0]?.passwordHash !== undefined) {
    failed++;
    console.info('FAIL la respuesta expone passwordHash');
} else {
    passed++;
    console.info('OK   la respuesta no expone passwordHash');
}
await expect('User NO lista usuarios', 403, 'GET', '/users', juan);
await expect('User NO puede crearse como admin', 403, 'POST', '/users', juan, {
    username: 'hacker',
    email: 'h@x.com',
    passwordHash: '12345678',
    roleId: 1,
});
const newUser = await expect('Admin crea usuario', 201, 'POST', '/users', admin, {
    username: 'pedro_test',
    email: 'pedro@test.com',
    passwordHash: 'password123',
    roleId: 2,
});
await expect('Admin cambia rol del usuario (roleId)', 200, 'PATCH', `/users/${newUser.data.id}`, admin, {
    roleId: 2,
    bio: 'editado',
});
await expect('Admin elimina usuario', 204, 'DELETE', `/users/${newUser.data.id}`, admin);
await expect('Usuario inexistente', 404, 'GET', '/users/9999', admin);

console.info('\n== Roles y permisos (solo admin) ==');
await expect('Admin lista roles', 200, 'GET', '/roles', admin);
await expect('User NO lista roles', 403, 'GET', '/roles', juan);
await expect('Admin lista permisos', 200, 'GET', '/permissions', admin);
await expect('User NO lista permisos', 403, 'GET', '/permissions', juan);
const role = await expect('Admin crea rol "coach"', 201, 'POST', '/roles', admin, {
    name: 'coach',
    description: 'Entrenador',
});
await expect('Rol duplicado -> 409', 409, 'POST', '/roles', admin, { name: 'coach', description: 'x' });
await expect('Admin asocia permisos al rol', 201, 'POST', `/roles/${role.data.id}/permissions`, admin, {
    permissionIds: [12, 16],
});
await expect('User NO asocia permisos', 403, 'POST', `/roles/${role.data.id}/permissions`, juan, {
    permissionIds: [1],
});
await expect('Admin ve permisos del rol', 200, 'GET', `/roles/${role.data.id}/permissions`, admin);
await expect('Admin quita un permiso del rol', 200, 'DELETE', `/roles/${role.data.id}/permissions/16`, admin);
await expect('Admin elimina rol sin usuarios', 200, 'DELETE', `/roles/${role.data.id}`, admin);
await expect('No se puede borrar rol con usuarios -> 409', 409, 'DELETE', '/roles/2', admin);

console.info('\n== Ejercicios (user solo lee) ==');
await expect('User lista ejercicios', 200, 'GET', '/exercises', juan);
await expect('User consulta ejercicio por id', 200, 'GET', '/exercises/1', juan);
await expect('User NO crea ejercicios', 403, 'POST', '/exercises', juan, { name: 'Burpees', type: 'cardio' });
const ex = await expect('Admin crea ejercicio', 201, 'POST', '/exercises', admin, {
    name: 'Burpees',
    type: 'cardio',
    estimatedCalories: 100,
});
await expect('User NO actualiza ejercicios', 403, 'PATCH', `/exercises/${ex.data.id}`, juan, { name: 'x' });
await expect('Admin actualiza ejercicio', 200, 'PATCH', `/exercises/${ex.data.id}`, admin, {
    estimatedDurationMin: 12,
});
await expect('User NO elimina ejercicios', 403, 'DELETE', `/exercises/${ex.data.id}`, juan);
await expect('Ejercicio usado en rutina -> 409', 409, 'DELETE', '/exercises/1', admin);
await expect('Admin elimina ejercicio libre', 200, 'DELETE', `/exercises/${ex.data.id}`, admin);
await expect('Validación: body inválido -> 400', 400, 'POST', '/exercises', admin, { name: 123 });
await expect('Validación: id no numérico -> 400', 400, 'GET', '/exercises/abc', admin);

console.info('\n== Rutinas (cada user solo las suyas) ==');
const juanRoutines = await expect('Juan lista SUS rutinas', 200, 'GET', '/routines', juan);
const onlyOwn = juanRoutines.data.every((r) => r.user.email === 'juan@example.com');
onlyOwn ? passed++ : failed++;
console.info(`${onlyOwn ? 'OK  ' : 'FAIL'} Juan solo ve rutinas propias (${juanRoutines.data.length})`);
const adminRoutines = await expect('Admin lista TODAS las rutinas', 200, 'GET', '/routines', admin);
console.info(`      admin ve ${adminRoutines.data.length} rutinas`);
await expect('Juan ve su rutina 1', 200, 'GET', '/routines/1', juan);
await expect('Juan NO ve la rutina 2 de María', 403, 'GET', '/routines/2', juan);
await expect('Juan NO edita la rutina de María', 403, 'PATCH', '/routines/2', juan, { name: 'hack' });
await expect('Juan NO borra la rutina de María', 403, 'DELETE', '/routines/2', juan);
await expect('Juan NO crea rutina para otro usuario', 403, 'POST', '/routines', juan, { name: 'x', userId: 3 });
const r = await expect('Juan crea su rutina', 201, 'POST', '/routines', juan, { name: 'Piernas', description: 'Día 2' });
await expect('Admin crea rutina para María', 201, 'POST', '/routines', admin, { name: 'Para María', userId: 3 });
await expect('Juan actualiza su rutina', 200, 'PATCH', `/routines/${r.data.id}`, juan, { name: 'Piernas pesado' });

console.info('\n== Ejercicios de rutina ==');
const re = await expect('Juan agrega ejercicio a su rutina', 201, 'POST', '/routine-exercises', juan, {
    routineId: r.data.id,
    exerciseId: 2,
    orderIndex: 1,
    targetSets: 4,
    targetReps: 10,
    targetWeightKg: 60,
});
await expect('Juan NO agrega ejercicio a rutina ajena', 403, 'POST', '/routine-exercises', juan, {
    routineId: 2,
    exerciseId: 1,
    orderIndex: 9,
});
await expect('Ejercicio inexistente -> 404', 404, 'POST', '/routine-exercises', juan, {
    routineId: r.data.id,
    exerciseId: 999,
    orderIndex: 2,
});
await expect('Juan lista ejercicios de su rutina', 200, 'GET', `/routine-exercises?routineId=${r.data.id}`, juan);
await expect('Juan NO ve ejercicio de rutina ajena', 403, 'GET', '/routine-exercises/4', juan);
await expect('Juan actualiza meta', 200, 'PATCH', `/routine-exercises/${re.data.id}`, juan, { targetReps: 12 });

console.info('\n== Sesiones (activity logs) ==');
const log = await expect('Juan inicia sesión de su rutina', 201, 'POST', '/activity-logs', juan, {
    routineId: r.data.id,
});
await expect('Juan NO registra sesión con rutina ajena', 403, 'POST', '/activity-logs', juan, { routineId: 2 });
await expect('Juan NO ve la sesión 2 de María', 403, 'GET', '/activity-logs/2', juan);
await expect('María ve su sesión 2 con detalle', 200, 'GET', '/activity-logs/2', maria);
await expect('Fechas incoherentes -> 400', 400, 'PATCH', `/activity-logs/${log.data.id}`, juan, {
    completedAt: '2000-01-01T00:00:00Z',
});

console.info('\n== Ejercicios realizados (activity exercises) ==');
const ae = await expect('Juan registra lo que hizo', 201, 'POST', '/activity-exercises', juan, {
    activityLogId: log.data.id,
    routineExerciseId: re.data.id,
    actualSets: 3,
    actualReps: 10,
    actualWeightKg: 55,
    caloriesBurned: 70,
});
await expect('Ejercicio de otra rutina -> 400', 400, 'POST', '/activity-exercises', juan, {
    activityLogId: log.data.id,
    routineExerciseId: 1,
});
await expect('Juan NO registra en sesión ajena', 403, 'POST', '/activity-exercises', juan, {
    activityLogId: 2,
    routineExerciseId: 4,
});
await expect('Juan lista lo realizado en su sesión', 200, 'GET', `/activity-exercises?activityLogId=${log.data.id}`, juan);
await expect('Juan corrige lo realizado', 200, 'PATCH', `/activity-exercises/${ae.data.id}`, juan, { actualReps: 9 });
await expect('María NO edita lo realizado por Juan', 403, 'PATCH', `/activity-exercises/${ae.data.id}`, maria, {
    actualReps: 1,
});
await expect('Juan termina la sesión', 200, 'PATCH', `/activity-logs/${log.data.id}`, juan, {
    completedAt: new Date().toISOString(),
});
await expect('Juan borra lo realizado', 200, 'DELETE', `/activity-exercises/${ae.data.id}`, juan);
await expect('Juan borra su sesión', 200, 'DELETE', `/activity-logs/${log.data.id}`, juan);
await expect('Juan quita ejercicio de su rutina', 200, 'DELETE', `/routine-exercises/${re.data.id}`, juan);
await expect('Juan borra su rutina', 200, 'DELETE', `/routines/${r.data.id}`, juan);

console.info('\n== Admin opera sobre datos de cualquiera (manage_all_records) ==');
await expect('Admin ve sesión de María', 200, 'GET', '/activity-logs/2', admin);
await expect('Admin ve ejercicio realizado de Juan', 200, 'GET', '/activity-exercises/1', admin);

console.info(`\nResultado: ${passed} OK, ${failed} FAIL`);
process.exit(failed ? 1 : 0);
