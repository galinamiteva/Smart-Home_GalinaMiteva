const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs');
let clients = [];

const adapter = new FileSync('./db/db.json'); 
const db = low(adapter);                     

function registerClient(res, remove = false) {
  if (remove) {
    clients = clients.filter((client) => client !== res);
  } else {
    clients.push(res);
  }
}

// ✅ Новата `update()` функция без express-sse
function update() {
  return new Promise((resolve, reject) => {
    const devices = db.get('devices').value();
    const payload = {
      devices,
      event: 'lockChanged',
      timestamp: Date.now()
    };

    console.log('[update()] Sending update with devices:', devices);

    // Изпраща на всички активни клиенти
    clients.forEach((res) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    });

    resolve();
  });
}

module.exports = { db, update, registerClient };