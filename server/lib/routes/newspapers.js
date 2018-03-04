const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Newspaper= require('../models/newspaper');



router
//newspapers and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Newspaper.find(query)
            .then(newspaper => res.send(newspaper ))
            .catch(next);
    })
        //find an newspaper and all newspaperdata
    .get('/:newspaper', (req, res, next) => {
	    const newspaperID = req.params.newspaper;
        console.log('newspaperID is ', newspaperID);
	    Newspaper.find({_id: newspaperID})
            .then(newspaper => res.send(newspaper ))
            .catch(next);
    })

//add newspaper to the db
    .post('/', bodyParser, function(req, res, next){
	    new Newspaper(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update newspaper
    .put('/:newspaper', bodyParser, function(req, res, next){
	    Newspaper.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a newspaper
    .delete('/:newspaper', function (req, res, next) {
        console.log('in delete route, deletingthis id: ', req.params.newspaper);
        Newspaper.remove({_id : req.params.newspaper})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;