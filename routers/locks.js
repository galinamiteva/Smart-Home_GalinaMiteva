const { Router } = require('express');
const router = new Router();
const { db, update } = require('./../db'); //vi behöver index.js från db, så vi inte skriva filnamnet


//På  http://localhost:3030/locks/LOC1/code/1234 
router.get('/:id/code/:code', async (req,res) => {
  let id = req.params.id;
  let isLocked = (req.params.code === '1234') ? true : false;

   //går in i db, hämtar devices och letar efter den med id = id. Ändrar egenskapen on beroende på state. Sen skriv data med value.
   db.get('devices')
   .find({ id: id})
   .assign({on: onValue})
   .value();
 
   // Säg åt frontend att uppdatera
   update();
  
   //kollar om coden är rätt
  if (isLocked){
      
      res.send({
          msg: `Dörren med id : ${id} är nu oppen`
      })
  }else{     

      res.send({
          msg: `Prova igen, dörren är stängd`
      })
  }
  
})


// EXPORT
module.exports = router;