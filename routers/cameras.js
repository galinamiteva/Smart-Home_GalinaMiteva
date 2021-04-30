const { Router } = require("express");
const router = new Router;
const { db, update } = require("./../db"); //vi behöver index.js från db, så vi inte skriva filnamnet

//Här kan man ha 3 scenario -filming(on-true), faking(on-true), off(on-false) på url: http://localhost:3030/cameras/CAM1/filming
router.get('/:id/:state', (req,res) => {
  let id = req.params.id;
  let state = req.params.state
  let onValue = req.params.on



  switch(state){
    case 'filming': onValue = true;
    break;
    case 'faking': onValue = true;
    break;
    case 'off': onValue = false;
    break;

    default: res.send({
      msg: `Kan du välja mellan filming, faking eller off`  
    });
  }


    // update db
  db.get( 'devices' ) // från databasen 'devices'
  .find({ id: id }) // hitta  enheten med samma id
  .assign({on: onValue}) // ändra parametern "on" till state-värdet
  .value(); // göra ändringen

  // Säg åt frontend att uppdatera
  update();

 
  res.send({
      msg: `Camera med id: ${id} är nu ${req.params.state}`
  }) 
})


// EXPORT
module.exports = router;
