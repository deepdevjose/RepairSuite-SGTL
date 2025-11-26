// Script para generar contraseñas hasheadas con bcrypt
// Ejecutar con: node prisma/hash-passwords.js

const bcrypt = require('bcryptjs');

const usuarios = [
  { nombre: 'Jose', email: 'jose@jlaboratories.com', password: 'admin123', rol: 'Administrador' },
  { nombre: 'Kevis', email: 'kevis@jlaboratories.com', password: 'tecnico123', rol: 'Técnico' },
  { nombre: 'Adriana', email: 'adriana@jlaboratories.com', password: 'recepcion123', rol: 'Recepción' },
];

console.log('🔐 Generando contraseñas hasheadas...\n');

usuarios.forEach(user => {
  const hash = bcrypt.hashSync(user.password, 10);
  console.log(`-- Usuario: ${user.nombre} (${user.rol})`);
  console.log(`-- Email: ${user.email}`);
  console.log(`-- Password: ${user.password}`);
  console.log(`INSERT INTO Usuario (nombre, email, password, rol, activo, fechaCreacion, ultimaActualizacion)`);
  console.log(`VALUES ('${user.nombre}', '${user.email}', '${hash}', '${user.rol}', 1, GETDATE(), GETDATE());`);
  console.log('');
});

console.log('✅ Copia y pega estos INSERT statements en SQL Server Management Studio');
