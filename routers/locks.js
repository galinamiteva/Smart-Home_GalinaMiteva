const { Router } = require('express');
const router = new Router();
const { db, update } = require('./../db'); //vi behöver index.js från db, så vi inte skriva filnamnet
