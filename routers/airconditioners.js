const { Router } = require("express");
const router = new Router;
const { db, update } = require("./../db"); //vi behöver index.js från db, så vi inte skriva filnamnet


//Bara att sätta på   : till ex http://localhost:3030/acs/AC1/power/on

 router.get('/:id/power/:state', async(req, res) => {
  let id = req.params.id;
  let state = (req.params.state === 'on') ? true : false;

  
  // update db
  //går in i db, hämtar devices och letar efter den med id = id. Ändrar egenskapen on beroende på state. Sen skriv data med value.
  db.get('devices')
  .find({ id: id})
  .assign({on: state})
  .value();

  // Säg åt frontend att uppdatera
  update();
 

  res.send({
    msg: `Aircondition med id: ${id} är nu ${req.params.state}`

  })

})  

// Byta temperature   : till ex http://localhost:3030/acs/AC1/temperature/25

router.get('/:id/temperature/:value', async(req, res)=>{
  let id = req.params.id;
  const temperature = Number(req.params.value); //temperature måste bli number!

  //Kolla om temperature är number

  if (temperature){
  db.get('devices')
    .find({id:id})
    .assign({on:true, temperature: temperature})
    .value();

    update();    

    res.send({
      msg: `Airconditioner ${id} är med temperature ${temperature}`
    })
  }else{

    db.get('devices')
    .find({id:id})
    .assign({on:false})
    .value();

    update();
    res.send({
      msg: `Skrev en number för temperature!`
    })
  }

})

// EXPORT
module.exports = router;