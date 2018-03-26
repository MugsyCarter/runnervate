const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Run= require('../models/run');



router
//runs and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Run.find(query)
            .then(run => res.send(run ))
            .catch(next);
    })
        //find an run and all rundata
    .get('/:run', (req, res, next) => {
	    const runID = req.params.run;
        console.log('runID is ', runID);
	    Run.find({_id: runID})
            .then(run => res.send(run ))
            .catch(next);
    })

//add run to the db
    .post('/', bodyParser, function(req, res, next){
	    new Run(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update run
    .put('/:run', bodyParser, function(req, res, next){
	    Run.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a run
    .delete('/:run', function (req, res, next) {
        console.log('in delete route, deletingthis id: ', req.params.run);
        Run.remove({_id : req.params.run})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;