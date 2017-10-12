const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Element= require('../models/element');



router
//elements and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Element.find(query)
            .then(element => res.send(element))
            .catch(next);
    })
        //find an element and all elementdata
    .get('/:element', (req, res, next) => {
	    const elementID = req.params.element;
        console.log('elementID is ', elementID);
	    Element.find({_id: elementID})
            .then(element => res.send(element ))
            .catch(next);
    })

//add element to the db
    .post('/', bodyParser, function(req, res, next){
	    new Element(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update element
    .put('/:id', bodyParser, function(req, res, next){
	    Element.findByIdAndUpdate(req.params.id, req.body, {new:true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete an element
    .delete('/:element', function (req, res, next) {
	    Element.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;