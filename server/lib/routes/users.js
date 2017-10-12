const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const User= require('../models/user');



router
//users and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    User.find(query)
            .then(user => res.send(user ))
            .catch(next);
    })
        //find a user and all userdata
    .get('/:user', (req, res, next) => {
	    const userID = req.params.user;
        console.log('userID is ', userID);
	    User.find({_id: userID})
            .then(user => res.send(user ))
            .catch(next);
    })

//add user to the db
    .post('/', bodyParser, function(req, res, next){
	    new User(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update user
    .put('/:id', bodyParser, function(req, res, next){
	    User.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows users to delete an account
    .delete('/:user', function (req, res, next) {
	    User.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;