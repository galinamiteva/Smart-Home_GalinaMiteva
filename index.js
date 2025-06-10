const { app } = require('./core'); 
const { db, update, registerClient } = require('./db');
const path = require('path');
const express = require('express');

const port = 3030;

//app.use(require('express').json());
app.use(express.json());



const { PassThrough } = require('stream');



const onHeaders = require('on-headers');

const devices = db.get('devices').value();

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

//Routers
const routeAirconditioners = require('./routers/airconditioners');
const routeBlinds = require ('./routers/blinds');
const routeCameras = require ('./routers/cameras');
const routeLights = require ('./routers/lights');
const routeLocks = require ('./routers/locks')
const routeSpeakers = require ('./routers/speakers');
const routeVacuums = require ('./routers/vacuums')

app.use('/acs', routeAirconditioners);
app.use('/blinds', routeBlinds);
app.use('/cameras', routeCameras);
app.use('/lights', routeLights);
app.use('/locks', routeLocks);
app.use ('/speakers', routeSpeakers);
app.use ('/vacuums', routeVacuums);


  app.get('/init', (req, res) => {
    let devices = db.get('devices').value();
    res.send(JSON.stringify({ devices: devices }));
});

app.get('/debug-lock', (req, res) => {
  const lock = db.get('devices').find({ id: 'LOC1' }).value();
  res.send(lock);
});

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('retry: 10000\n\n'); // Автоматично повторение след 10 сек, ако връзката падне

  registerClient(res);

  req.on('close', () => {
    console.log('[SSE] Client disconnected');
    registerClient(res, true); // remove
  });
});


app.get('/stream', (req, res) => {
  // просто ползвай същата логика
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











//Hämta en lista av enheter som JSON om det behövs
app.get ('/all', (req, res)=>{
    let categories = db.get('categories').value();
    let response = {};

    categories.forEach(element => {
     let devices = db.get ('devices').filter({type:element}).value();
     let category = element + 's';         
     let devs =[];    // här devs är [ 'LOC1' ] ,  [ 'LIG1', 'LIG2', 'LIG3' ] , [ 'AC1' ],  [ 'BLI1' ]  [ 'VAC1' ]  [ 'CAM1' ]  [ 'SPE1' ]
     devices.forEach(dev =>{
         devs.push (dev.id);
     });     
     response[category]  = devs;      
    });

    res.send(response);  //  här response är  {"Locks":["LOC1"],"Lights":["LIG1","LIG2","LIG3"], etc...}
    
})


app.use(express.static(path.join(__dirname, 'public')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//404 meddelande 
app.get ('*', (req, res)=>{
    res.status(404). sendFile('404.html',{root:__dirname + '/public'})  //från filen 404.html
  })
  
app.listen(port, async () => {
  console.log(`API for smart home 1.1 up n running on port ${port}.`);
  const open = (await import('open')).default;   // ⬅️ динамичен ES import
  open(`http://localhost:${port}`);
});

