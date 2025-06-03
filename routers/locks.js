const { Router } = require('express');
const router = new Router();
const { db, update } = require('./../db');

// Vue frontend иска това: POST /locks/LOC1/unlock
// POST /locks/LOC1/unlock
router.post('/:id/unlock', (req, res) => {                                        
  const id = req.params.id;
  const code = req.body.code;

  if (code != 1234) {
    return res.status(401).send({ msg: `Misstag ${id} still locked.` });
  }

  db.get('devices')
    .find({ id })
    .assign({ locked: false, on: true })  // <- on: true за unlocked
    .value();

  update();

  res.send({ msg: `Access granted. ${id} is unlocked.` });
});

router.post('/:id/lock', (req, res) => {
  const id = req.params.id;

  db.get('devices')
    .find({ id })
    .assign({ locked: true, on: false })  // <- locked: true, on: false
    .value();

  update();

  res.send({ msg: `Door ${id} is locked.` });
});

router.get('/:id/:state', (req, res) => {
  const id = "LOC" + req.params.id;
  const currentDevice = db.get('devices').find({ id }).value();

  if (!currentDevice) {
    return res.send("There is no lock with this ID");
  }

  const state = req.params.state;

  if (state !== "on" && state !== "off") {
    return res.send("Please specify if you want to lock or open the door");
  }

  const locked = (state === "off");

  db.get('devices')
    .find({ id })
    .assign({ locked, on: !locked })  // <- отново: on: true само ако е отключено
    .value();

  update();

  res.send(`Door is ${state === "on" ? "open" : "closed"}`);
});


module.exports = router;
