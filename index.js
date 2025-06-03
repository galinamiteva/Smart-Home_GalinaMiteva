const { app } = require('./core'); 
const { db, update, sse } = require('./db')
const port = 3030;

app.use(require('express').json());
app.get('/stream', sse.init); // <-- това активира SSE endpoint


const { PassThrough } = require('stream');



const onHeaders = require('on-headers');

const devices = db.get('devices').value();

// Reset all devices to off state
db.get('devices')
  .forEach(device => {
    device.on = false;
  })
  .write();

console.log('[Reset] Device states after reset:', db.get('devices').value());


  app.get('/init', (req, res) => {
    let devices = db.get('devices').value();
    res.send(JSON.stringify({ devices: devices }));
});

app.get('/debug-lock', (req, res) => {
  const lock = db.get('devices').find({ id: 'LOC1' }).value();
  res.send(lock);
});


app.listen(port, async () => {
  console.log(`API for smart home 1.1 up n running on port ${port}.`);
  const open = (await import('open')).default;   // ⬅️ динамичен ES import
  open(`http://localhost:${port}`);
});

/* CODE YOUR API HERE */


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

//404 meddelande 
app.get ('*', (req, res)=>{
    res.status(404). sendFile('404.html',{root:__dirname + '/public'})  //från filen 404.html
  })
  
//const open = require('open');

