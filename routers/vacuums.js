const { Router } = require('express');
const router = new Router();
const { db, update } = require('./../db'); //vi behöver index.js från db, så vi inte skriva filnamnet

// på http://localhost:3030/vacuums/VAC1/power/cleaning
router.get('/:id/power/:state', (req,res) => {
  let id = req.params.id;
  let state = req.params.state
  let onValue = req.params.on

  
  switch(state){
      case 'cleaning': onValue = true;
      break;
      case 'charging': onValue = false;
      break;
      case 'off': onValue = false;
      break;
      default: console.log('Kan du välja mellan cleaning, charging och off')
  }
  
  // update db
  db.get( 'devices' ) 
  .find({ id: id }) 
  .assign({ on:onValue }) 
  .value(); 

  // Säg åt frontend att uppdatera
  update();

    res.send({
      msg: `Vacuum med id: ${id} nu ${req.params.state}`
  })
})


// EXPORT
module.exports = router;
