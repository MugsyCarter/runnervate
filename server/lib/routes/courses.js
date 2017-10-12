const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Course= require('../models/course');



router
//courses and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Course.find(query)
            .then(course => res.send(course ))
            .catch(next);
    })
        //find a course and all coursedata
    .get('/:course', (req, res, next) => {
	    const courseID = req.params.course;
        console.log('courseID is ', courseID);
	    Course.find({_id: courseID})
            .then(course => res.send(course ))
            .catch(next);
    })

//add course to the db
    .post('/', bodyParser, function(req, res, next){
	    new Course(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update course
    .put('/:course', bodyParser, function(req, res, next){
	    Course.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a course
    .delete('/:course', function (req, res, next) {
	    Course.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;