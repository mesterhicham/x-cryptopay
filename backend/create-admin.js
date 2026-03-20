const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function main() {
  const c = await mysql.createConnection({host:'localhost',port:8889,user:'root',password:'root',database:'x-cryptopay'});
  
  const hash = await bcrypt.hash('Admin@2026', 10);
  await c.execute('UPDATE users SET passwordHash = ?, role = ? WHERE email = ?', [hash, 'admin', 'admin@x-cryptopay.com']);
  
  const [rows] = await c.execute('SELECT u.email, u.role, m.apiKey FROM users u LEFT JOIN merchant m ON m.userId = u.id WHERE u.email = ?', ['admin@x-cryptopay.com']);
  console.log('✅ Admin account ready!');
  console.log(rows[0]);
  
  await c.end();
}
main().catch(e => { console.error(e); process.exit(1); });
