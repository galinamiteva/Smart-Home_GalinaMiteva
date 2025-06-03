const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs');
let SSE = require('express-sse');
let sse = new SSE();
const adapter = new FileSync('./db/db.json')
const db = low(adapter)

/* function update() {
  return new Promise((resolve, reject) => {
    const devices = db.get('devices').value();

    const payload = { devices };

    console.log('[update()] Sending update with devices:', devices);
    console.log('Sending SSE update:', JSON.stringify(payload, null, 2));

    sse.send(payload);
    resolve();
  });
} */
function update() {
  return new Promise((resolve, reject) => {
    const devices = db.get('devices').value();

    const payload = {
      devices,
      event: 'lockChanged',
      timestamp: Date.now()
    };

    console.log('[update()] Sending update with devices:', devices);
    sse.send(payload);
    resolve();
  });
}
module.exports = { db, sse, update }

