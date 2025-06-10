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
if (!db.has('devices').value() || db.get('devices').value().length === 0) {
  db.defaults({
    devices: [
      {
        "id": "VAC1",
        "type": "Vacuum",
        "name": "BB-8s slow cousin",
        "on": false,
        "state": "cleaning"
      },
      {
        "id": "LIG1",
        "type": "Light",
        "name": "Bedroom",
        "on": false,
        "color": "#FFDE67",
        "brightness": 1,
        "state": "off"
      },
      {
        "id": "LIG2",
        "type": "Light",
        "name": "Living room",
        "on": false,
        "color": "#FFDE67",
        "brightness": 0.5,
        "state": "off"
      },
      {
        "id": "LIG3",
        "type": "Light",
        "name": "Garden",
        "on": false,
        "color": "#FFDE67",
        "brightness": 1,
        "state": "off"
      },
      {
        "id": "BLI1",
        "type": "Blind",
        "name": "Living room",
        "on": false,
        "state": "up"
      },
      {
        "id": "AC1",
        "type": "AC",
        "name": "Bedroom",
        "on": false,
        "temperature": 17,
        "state": "off"
      },
      {
        "id": "LOC1",
        "type": "Lock",
        "name": "Front door",
        "locked": true,
        "secret": "19d493b3-9a2e-495e-9dc2-44b7836dae9a",
        "code": "1234",
        "on": false
      },
      {
        "id": "CAM1",
        "type": "Camera",
        "name": "Front door",
        "on": false,
        "secret": "a5e337f5-a391-4fda-894e-d14aba719c9e"
      },
      {
        "id": "SPE1",
        "type": "Speaker",
        "name": "Living room",
        "on": false,
        "stream": {
          "file": "testfile.mp3",
          "name": "testfile"
        }
      }
    ],
    categories: [
      "Lock",
      "Light",
      "AC",
      "Blind",
      "Vacuum",
      "Speaker"
    ],
    keys: []
  }).write();

  console.log('[DB] Default data initialized (in memory)');
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
