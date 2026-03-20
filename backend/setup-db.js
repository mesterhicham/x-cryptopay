const mysql = require('mysql2/promise');

async function setup() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 8889,
      user: 'root',
      password: 'root',
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS `x-cryptopay`;');
    console.log('Database x-cryptopay checked/created successfully.');
    await connection.end();
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
}

setup();
