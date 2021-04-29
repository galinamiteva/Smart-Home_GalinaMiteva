const { Router } = require("express");
const router = new Router;
const { db, update } = require("./../db"); //vi behöver index.js från db, så vi inte skriva filnamnet


//Bara att sätta på    till ex http://localhost:3030/blinds/BLI1/down
router.get('/:id/:state', async(req, res) => {
  let id = req.params.id;
  let state = req.params.state
  let onValue = req.params.on

  switch(state){
    case 'down': onValue = true;
    break;
    case 'up': onValue = false;
    break;
    default: res.send({
      msg: `Kan du välja mellan down och up`  
    });
}
  
  //går in i db, hämtar devices och letar efter den med id = id. Ändrar egenskapen on beroende på state. Sen skriv data med value.
  db.get('devices')
  .find({ id: id})
  .assign({on: onValue})
  .value();

  // Säg åt frontend att uppdatera
  update();
 

  res.send({
    msg: `Blind med id: ${id} är nu ${req.params.state}`

  })

})  

// EXPORT
module.exports = router;





