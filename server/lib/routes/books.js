const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Book= require('../models/book');



router
//books and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Book.find(query)
            .then(book => res.send(book ))
            .catch(next);
    })
        //find an book and all bookdata
    .get('/:book', (req, res, next) => {
	    const bookID = req.params.book;
        console.log('bookID is ', bookID);
	    Book.find({_id: bookID})
            .then(book => res.send(book ))
            .catch(next);
    })

//add book to the db
    .post('/', bodyParser, function(req, res, next){
	    new Book(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update book
    .put('/:book', bodyParser, function(req, res, next){
	    Book.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a book
    .delete('/:book', function (req, res, next) {
        console.log('in delete route, deletingthis id: ', req.params);
        Book.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;