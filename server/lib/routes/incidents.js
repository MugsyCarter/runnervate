const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Incident= require('../models/incident');



router
//incidents and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Incident.find(query)
            .then(incident => res.send(incident ))
            .catch(next);
    })
        //find an incident and all incidentdata
    .get('/:incident', (req, res, next) => {
	    const incidentID = req.params.incident;
        console.log('incidentID is ', incidentID);
	    Incident.find({_id: incidentID})
            .then(incident => res.send(incident ))
            .catch(next);
    })

//add incident to the db
    .post('/', bodyParser, function(req, res, next){
	    new Incident(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update incident
    .put('/:incident', bodyParser, function(req, res, next){
	    Incident.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a Incident
    .delete('/:incident', function (req, res, next) {
        console.log('in delete route, deletingthis incident: ', req.params.incident);
        Incident.remove({_id: req.params.incident})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });


module.exports = router;