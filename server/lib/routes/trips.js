const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Trip= require('../models/trip');



router
//trips and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Trip.find(query)
            .then(trip => res.send(trip ))
            .catch(next);
    })
        //find a trip and all tripdata
    .get('/:trip', (req, res, next) => {
	    const tripID = req.params.trip;
        console.log('tripID is ', tripID);
	    Trip.find({_id: tripID})
            .then(trip => res.send(trip ))
            .catch(next);
    })

//add trip to the db
    .post('/', bodyParser, function(req, res, next){
	    new Trip(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update trip
    .put('/:trip', bodyParser, function(req, res, next){
	    Trip.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a trip
    .delete('/:trip', function (req, res, next) {
	    Trip.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;