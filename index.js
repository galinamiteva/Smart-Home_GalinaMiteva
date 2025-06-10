const { app } = require('./core');
const { db, update, registerClient } = require('./db');
const path = require('path');
const express = require('express');

app.use(express.json());

// Reset all devices to off state
db.get('devices')
  .forEach(device => {
    device.on = false;
    if (device.type === 'Lock') {
      device.locked = true;
    }
  })
  .write();

console.log('[Reset] Device states after reset:', db.get('devices').value());

// Routers
const routeAirconditioners = require('./routers/airconditioners');
const routeBlinds = require('./routers/blinds');
const routeCameras = require('./routers/cameras');
const routeLights = require('./routers/lights');
const routeLocks = require('./routers/locks');
const routeSpeakers = require('./routers/speakers');
const routeVacuums = require('./routers/vacuums');

app.use('/acs', routeAirconditioners);
app.use('/blinds', routeBlinds);
app.use('/cameras', routeCameras);
app.use('/lights', routeLights);
app.use('/locks', routeLocks);
app.use('/speakers', routeSpeakers);
app.use('/vacuums', routeVacuums);


app.get('/init', (req, res) => {
  const devices = db.get('devices').value();
  res.json({ devices });
});

app.get('/debug-lock', (req, res) => {
  const lock = db.get('devices').find({ id: 'LOC1' }).value();
  res.send(lock);
});

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.write('retry: 10000\n\n');
  registerClient(res);
  req.on('close', () => {
    console.log('[SSE] Client disconnected');
    registerClient(res, true); // remove
  });
});

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.write('retry: 10000\n\n');
  registerClient(res);
  req.on('close', () => {
    console.log('[SSE] Client disconnected (/stream)');
    registerClient(res, true);
  });
});

app.get('/all', (req, res) => {
  const categories = db.get('categories').value();
  const response = {};

  categories.forEach(type => {
    const devices = db.get('devices').filter({ type }).value();
    response[type + 's'] = devices.map(d => d.id);
  });

  res.send(response);
});

// 🎯 Статични файлове
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 за всичко останало
app.use((req, res) => {
  res.status(404).sendFile('404.html', { root: __dirname + '/public' });
});

/* module.exports = (req, res) => {
  return app(req, res);
};
 */
/* if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
 */
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}