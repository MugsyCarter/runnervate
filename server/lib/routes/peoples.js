const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const People= require('../models/people');



router
//trips and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    People.find(query)
            .then(people => res.send(people ))
            .catch(next);
    })
        //find a people and all peopledata
    .get('/:people', (req, res, next) => {
	    const peopleID = req.params.people;
        console.log('peopleID is ', peopleID);
	    People.find({_id: peopleID})
            .then(people => res.send(people ))
            .catch(next);
    })

//add people to the db
    .post('/', bodyParser, function(req, res, next){
	    new People(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//add multiple people to the db

//update trip
    .put('/:people', bodyParser, function(req, res, next){
	    People.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a people
    .delete('/:people', function (req, res, next) {
	    People.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;