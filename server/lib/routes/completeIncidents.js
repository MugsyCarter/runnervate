const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const CompleteIncident = require('../models/completeIncident');



router
//CompleteIncidents and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    CompleteIncident.find(query)
            .then(completeIncident => res.send(completeIncident ))
            .catch(next);
    })
        //find an incident and all incidentdata
    .get('/:completeIncident', (req, res, next) => {
	    const completeIncidentID = req.params.completeIncident;
        console.log('completeIncidentID is ', completeIncidentID);
	    CompleteIncident.find({_id: completeIncidentID})
            .then(completeIncident => res.send(completeIncident ))
            .catch(next);
    })

//add completeIncident to the db
    .post('/', bodyParser, function(req, res, next){
	    new CompleteIncident(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update completeIncident
    .put('/:completeIncident', bodyParser, function(req, res, next){
	    CompleteIncident.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a completeIncident
    .delete('/:completeIncident', function (req, res, next) {
        console.log('in delete route, deletingthis CompleteIncident: ', req.params.completeIncident);
        CompleteIncident.remove({_id: req.params.completeIncident})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });


module.exports = router;