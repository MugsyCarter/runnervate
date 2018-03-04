const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Accused= require('../models/accused');



router
//accuseds and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Accused.find(query)
            .then(accused => res.send(accused ))
            .catch(next);
    })
//find an accused and all accuseddata
    .get('/:accused', (req, res, next) => {
	    const accusedID = req.params.accused;
        console.log('accusedID is ', accusedID);
	    Accused.find({_id: accusedID})
            .then(accused => res.send(accused ))
            .catch(next);
    })

//add accused to the db
    .post('/', bodyParser, function(req, res, next){
	    new Accused(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update accused
    .put('/:accused', bodyParser, function(req, res, next){
	    Accused.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a accused
    .delete('/:accused', function (req, res, next) {
        console.log('in delete route, deletingthis id: ', req.params.accused);
        Accused.remove({_id : req.params.accused})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;