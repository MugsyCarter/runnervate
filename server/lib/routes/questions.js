const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Question= require('../models/question');



router
//questions and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Question.find(query)
            .then(question => res.send(question))
            .catch(next);
    })
        //find an question and all questiondata
    .get('/:question', (req, res, next) => {
	    const questionID = req.params.question;
        console.log('questionID is ', questionID);
	    Question.find({_id: questionID})
            .then(question => res.send(question))
            .catch(next);
    })

//add question to the db
    .post('/', bodyParser, function(req, res, next){
	    new Question(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update question
    .put('/:id', bodyParser, function(req, res, next){
	    Question.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete an question
    .delete('/:question', function (req, res, next) {
	    Question.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;