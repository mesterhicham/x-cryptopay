const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function seedAdmin() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'x-cryptopay'
  });

  const email = 'admin@x-cryptopay.com';
  const password = 'AdminPassword123!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const id = crypto.randomUUID();

  const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length > 0) {
    console.log('Admin already exists.');
    await connection.execute('UPDATE users SET role = "ADMIN", passwordHash = ? WHERE email = ?', [hash, email]);
    console.log('Updated to ADMIN role and reset password.');
  } else {
    // Note: TypeORM default for uuid is string, and times are datetime
    await connection.execute(
      'INSERT INTO users (id, email, passwordHash, role, createdAt, updatedAt) VALUES (?, ?, ?, "ADMIN", NOW(), NOW())',
      [id, email, hash]
    );
    console.log('Admin user seeded successfully!');
  }

  process.exit(0);
}

seedAdmin().catch(console.error);
