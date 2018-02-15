const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Manuscript= require('../models/manuscript');



router
//manuscripts and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Manuscript.find(query)
            .then(manuscript => res.send(manuscript ))
            .catch(next);
    })
        //find an manuscript and all manuscriptdata
    .get('/:manuscript', (req, res, next) => {
	    const manuscriptID = req.params.manuscript;
        console.log('manuscriptID is ', manuscriptID);
	    Manuscript.find({_id: manuscriptID})
            .then(manuscript => res.send(manuscript ))
            .catch(next);
    })

//add manuscript to the db
    .post('/', bodyParser, function(req, res, next){
	    new Manuscript(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update manuscript
    .put('/:manuscript', bodyParser, function(req, res, next){
	    Manuscript.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a manuscript
    .delete('/:manuscript', function (req, res, next) {
        console.log('in delete route, deletingthis id: ', req.params);
        Manuscript.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;