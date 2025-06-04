# Inlämningsuppgift 1-  Smart Home API Lab 1.1

**ZoCom Smart Home API is a playground to learn API design and code with [express.js](https://expressjs.com). 
Download or fork this repo and get started!**

To control the different devices in the frontend, all you need to do is to update the object in the db (lowdb) and call the ```update()``` function. 

Ex.

```javascript

db
.get('devices')
.find({ id : id })
.assign({ on : true }) // Turn on the device
.value();

update(); // tell frontend to update state.

```

```javascript

db
.get('devices')
.find({ id : id })
.assign({ on : true, brightness: 0.5 }) // Turn on the device and change brightness
.value();

update(); // tell frontend to update state.

```

Changes in the db are *synchronous*.

You can view all of the devies *datamodels* in the **about** section on the frontend.


You can even add more devices to expand your home by entering them ( by hand ) in the ```db/db.json``` file. Dont forget to give them a unique *ID*.


Happy experimenting!
