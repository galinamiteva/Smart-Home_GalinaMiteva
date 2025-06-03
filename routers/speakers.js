const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const router = new Router();
const { db, update } = require('./../db'); 

router.get("/:id/stream", (req, res) => {
  let id = req.params.id;

  const audioPath = path.join(__dirname, "../db/audio/testfile.mp3");

  // Проверка дали файлът съществува
  if (!fs.existsSync(audioPath)) {
    return res.status(404).send("Audio file not found.");
  }

  // Обновяване на устройството в БД
  db.get('devices')
    .find({ id })
    .assign({ on: true })
    .value();

  // Извикваме update() – само за SSE, няма да праща res
  update();

  // Задаваме тип
  res.setHeader("Content-Type", "audio/mpeg");

  // Създаваме стрийм
  const stream = fs.createReadStream(audioPath);
  stream.pipe(res);

  // Ако има грешка със стрийма
  stream.on("error", (err) => {
    console.error("Stream error:", err);
    res.sendStatus(500);
  });
});

module.exports = router