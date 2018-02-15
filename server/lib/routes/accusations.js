const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Accusation= require('../models/accusation');



router
//accusations and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Accusation.find(query)
            .then(accusation => res.send(accusation ))
            .catch(next);
    })
        //find an accusation and all accusationdata
    .get('/:accusation', (req, res, next) => {
	    const accusationID = req.params.accusation;
        console.log('accusationID is ', accusationID);
	    Accusation.find({_id: accusationID})
            .then(accusation => res.send(accusation ))
            .catch(next);
    })

//add accusation to the db
    .post('/', bodyParser, function(req, res, next){
	    new Accusation(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update accusation
    .put('/:accusation', bodyParser, function(req, res, next){
	    Accusation.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a accusation
    .delete('/:accusation', function (req, res, next) {
        console.log('in delete route, deletingthis id: ', req.params);
        Accusation.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;