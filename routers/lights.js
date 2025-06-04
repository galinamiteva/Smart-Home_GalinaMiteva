const { Router } = require("express");
const router = new Router;
const { db, update } = require("./../db"); //vi behöver index.js från db, så vi inte skriva filnamnet

// Bara att tända  http://localhost:3030/lights/LIG3/power/on
router.get('/:id/power/:state', (req,res) => {
  let id = req.params.id;
  let state = (req.params.state === 'on') ? true : false;

  // Update DB
  db.get( 'devices' ) // från databasen 'devices'
  .find({ id: id }) // hitta  enheten med samma id
  .assign({ on: state }) // ändra parametern "on" till state-värdet
  .value(); // göra ändringen

  update(); // Säg åt frontend att uppdatera 
    

    res.send({
        msg: `Lampa med id: ${id} har nu state: ${req.params.state}`
    })  
})




// Byta färgen  - till ex http://localhost:3030/lights/LIG3/color/ED6A24
router.get('/:id/color/:value', async (req,res) => {
  let id = req.params.id;
  let color = `#${req.params.value}`;
  let colorValue =req.params.value;
  var re = /\b[0-9A-Fa-f]{6}\b/g; //lite verktygstip från stackoverflow.com

  //Om man väljer felaktig färg försvinner lampan, så först kollar jag på color-value

  function is_hexadecimal(colorValue)
{  
  if (re.test(colorValue))
    {
      return true;
    }
  else
    {
      return false;
    }
}

//Här använder jag resultaten av funktionen
  if (  is_hexadecimal(colorValue) ){

   
  db.get('devices')
  .find({id:id})
  .assign({on: true, color:color})
  .value();

  update();   

  res.send({
      msg: `Light ${id} är nu HEX färgen: ${color}`
  })

  }else{
    db.get('devices')
    .find({id:id})
    .assign({on: false})
    .value();

    update(); 

  

  res.send({
    msg: `Kan du skriva en rätt HEX färg med 6 siffror ? `
  });
}
});


// Byta brightness   http://localhost:3030/lights/LIG3/brightness/0.7
router.get('/:id/brightness/:val', (req,res) => {
  let id = req.params.id;    
  let val = req.params.val;

  //Kollar på rätt värde i url:en för brightness 
  if (val>=0 && val<=1){

     
  db.get('devices')
  .find({id:id})
  .assign({on: true, brightness:val})
  .value();

  update();   

  res.send({
      msg: `Brightness på lampa med id: ${id} är nu ${req.params.val*100}%`
  })
  }else {
    db.get('devices')
    .find({id:id})
    .assign({on: false})
    .value();
  
    update(); 


    res.send({
      msg: `Kan du skriva ett tal mellan 0 och 1 som value på brightness `
  })
  }
 
})

//Byta brightness och färgen samtidigt - http://localhost:3030/lights/LIG3/color/ED6A24/brightness/0.7

router.get('/:id/color/:value/brightness/:val', (req,res) => {
  let id = req.params.id;
  let val = req.params.val;  
  let color = `#${req.params.value}`;
  let colorValue =req.params.value;
  var re = /\b[0-9A-Fa-f]{6}\b/g;
  
  
  function is_hexadecimal(colorValue)
  {  
    if (re.test(colorValue))
      {
        return true;
      }
    else
      {
        return false;
      }
  }
  
  //Kollar på att sätta rätt HEX-värde och rätt number för brightness
  if ((is_hexadecimal(colorValue)) && (val>=0 && val<=1)){
    db.get('devices')
    .find({id:id})
    .assign({on: true, brightness:val, color:color})
    .value();

    update(); 

 

  res.send({
      msg: `Brightness på lampa med id: ${id} är nu ${req.params.val*100}% och med färg ${color}`
  })
  }else if(!(is_hexadecimal(colorValue)) || !(val>=0 && val<=1)){
    db.get('devices')
    .find({id:id})
    .assign({on: false})
    .value();

    update();
    res.send({
      msg: `Kan du skriva ett rätt tal på lampan med id: ${id} och kolla om fargen är rätt HEX färg med 6 siffror? `
    })

  } 
    
})






// EXPORT
module.exports = router;
