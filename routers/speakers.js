
const { Router } = require("express");
const fs = require("fs");
const router = new Router();
const { db, update } = require('./../db'); 

 
router.get("/:id/stream", (req, res) => {
  let id = req.params.id;

  // Skapar stream från mp3
  const src = fs.createReadStream("./db/audio/testfile.mp3");
  
  // Stream till frontend  för att manupulera DOMen
  src.pipe(res);

  db.get( 'devices' ) 
    .find({ id: id }) 
    .assign({ on: true }) 
    .value(); 

    // Säg åt frontend att uppdatera
    update();  
    
}); 

module.exports = router;