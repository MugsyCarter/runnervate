const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Lesson= require('../models/lesson');



router
//lessons and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Lesson.find(query)
            .then(lesson => res.send(lesson))
            .catch(next);
    })
//find an lesson and all lessondata
    .get('/:lesson', (req, res, next) => {
	    const lessonID = req.params.lesson;
        console.log('lessonID is ', lessonID);
	    Lesson.find({_id: lessonID})
            .then(lesson => res.send(lesson ))
            .catch(next);
    })

//add lesson to the db
    .post('/', bodyParser, function(req, res, next){
	    new Lesson(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update lesson
    .put('/:id', bodyParser, function(req, res, next){
	    Lesson.findByIdAndUpdate(req.params.id, req.body, {new:true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete an lesson
    .delete('/:lesson', function (req, res, next) {
	    Lesson.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;