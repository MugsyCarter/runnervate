const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Website= require('../models/website');



router
//websites and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    Website.find(query)
            .then(website => res.send(website ))
            .catch(next);
    })
        //find an website and all websitedata
    .get('/:website', (req, res, next) => {
	    const websiteID = req.params.website;
        console.log('websiteID is ', websiteID);
	    Website.find({_id: websiteID})
            .then(website => res.send(website ))
            .catch(next);
    })

//add website to the db
    .post('/', bodyParser, function(req, res, next){
	    new Website(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update website
    .put('/:website', bodyParser, function(req, res, next){
	    Website.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a website
    .delete('/:website', function (req, res, next) {
        console.log('in delete route, deletingthis id: ', req.params);
        Website.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;