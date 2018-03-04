const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Name = require('../models/name');



router
//names and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Name.find(query)
            .then(name => res.send(name ))
            .catch(next);
    })
        //find an name and all namedata
    .get('/:name', (req, res, next) => {
	    const nameID = req.params.name;
        console.log('nameID is ', nameID);
	    Name.find({_id: nameID})
            .then(name => res.send(name ))
            .catch(next);
    })

//add name to the db
    .post('/', bodyParser, function(req, res, next){
	    new Name(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update name
    .put('/:name', bodyParser, function(req, res, next){
	    Name.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a name
    .delete('/:name', function (req, res, next) {
        console.log('in delete route, deletingthis id: ', req.params.name);
        Name.remove({_id : req.params.name})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;