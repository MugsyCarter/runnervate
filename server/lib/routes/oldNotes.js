const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const OldNote= require('../models/oldNote');



router
//oldNotes and also queries
    .get('/', function (req, res, next) {
	    const query = req.query;
	    console.log(query);
	    OldNote.find(query)
            .then(oldNote => res.send(oldNote ))
            .catch(next);
    })
        //find an oldNote and all oldNotedata
    .get('/:oldNote', (req, res, next) => {
	    const oldNoteID = req.params.oldNote;
        console.log('oldNoteID is ', oldNoteID);
	    OldNote.find({_id: oldNoteID})
            .then(oldNote => res.send(oldNote ))
            .catch(next);
    })

//add oldNote to the db
    .post('/', bodyParser, function(req, res, next){
	    new OldNote(req.body).save()
            .then (saved => res.send(saved ))
            .catch(next);
    })

//update oldNote
    .put('/:oldNote', bodyParser, function(req, res, next){
	    OldNote.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

//allows admins to delete a oldNote
    .delete('/:oldNote', function (req, res, next) {
        console.log('in delete route, deletingthis id: ', req.params.oldNote);
        OldNote.remove({_id : req.params.oldNote})
            .then(deleted => res.send(deleted ))
            .catch(next);
    });




module.exports = router;