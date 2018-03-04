const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Punishment= require('../models/punishment');



router
//punishments and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Punishment.find(query)
            .then(punishment => res.send(punishment ))
            .catch(next);
    })
        //find an punishment and all punishmentdata
    .get('/:punishment', (req, res, next) => {
	    const punishmentID = req.params.punishment;
        console.log('punishmentID is ', punishmentID);
	    Punishment.find({_id: punishmentID})
            .then(punishment => res.send(punishment ))
            .catch(next);
    })

//add punishment to the db
    .post('/', bodyParser, function(req, res, next){
	    new Punishment(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update punishment
    .put('/:punishment', bodyParser, function(req, res, next){
	    Punishment.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a punishment
    .delete('/:punishment', function (req, res, next) {
        console.log('in delete route, deletingthis id: ', req.params.punishment);
        Punishment.remove({_id : req.params.punishment})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;