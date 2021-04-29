const { app } = require('./core'); 
const { db, update } = require('./db')
const port = 3030;

app.listen(port, () => {
    console.log(`API for smart home 1.1 up n running on port ${port}.`)
})

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
/*app.use('/locks', routeLocks);
app.use ('/speakers', routeSpeakers);
app.use ('/vacuums', routeVacuums);
 */

//Hämta en lista av enheter som JSON 
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
  