const low = require('lowdb');
const fs = require('fs');
let clients = [];

let adapter;
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  // 🟡 Във Vercel: използвай памет (без файлове)
  const Memory = require('lowdb/adapters/Memory');
  adapter = new Memory();
  console.log('[DB] Using Memory adapter (Vercel)');
} else {
  // ✅ Локално: използвай файл
  const FileSync = require('lowdb/adapters/FileSync');
  adapter = new FileSync('./db/db.json');
  console.log('[DB] Using FileSync adapter (Local)');
}

const db = low(adapter);

// Ако е в памет, създай начални данни
if (!db.has('devices').value()) {
  db.defaults({ devices: [], categories: [] }).write();
}

function registerClient(res, remove = false) {
  if (remove) {
    clients = clients.filter((client) => client !== res);
  } else {
    clients.push(res);
  }
}

function update() {
  return new Promise((resolve, reject) => {
    const devices = db.get('devices').value();
    const payload = {
      devices,
      event: 'lockChanged',
      timestamp: Date.now()
    };

    console.log('[update()] Sending update with devices:', devices);

    clients.forEach((res) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    });

    resolve();
  });
}

module.exports = { db, update, registerClient };
