const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../models/user');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensureAuth')();

// router.post('/validate', ensureAuth, (req, res, next) => {
//   res.send({valid: true});
// });

router.get('/verify', ensureAuth, (req, res, next) => {
    res.status(200).send({success: true});
});


router.post('/signup', jsonParser, (req, res, next) => {
    console.log('in signup route');
    const {username, password} = req.body;
    // now that we have the reference to the password, remove it
    delete req.body.password;

    if (!username || !password) {
        return next({code: 400, message: 'username and password are required'});
    };

    let userObj = {};

    User.find({username})
        .count()
        .then(count => {
            if (count > 0) throw {code: 400, message: `username ${username} already exists`};
            const user = new User(req.body);
            user.generateHash(password);
            if (!user.role) user.role = 'member';
            return user.save();
        })
        .then(user => {
            userObj.userId = user._id;
            userObj.userName = user.username;
            return token.assignToken(user);
        })
        .then(token => {
            userObj.token = token;
            res.send(userObj);
        })
        .catch(next);
});

router.post('/login', jsonParser, (req, res, next) => {
    console.log('in auth service.  login.');
    const {username, password} = req.body;
    if (!username || !password) {
        throw {code: 400, message: 'Missing username or password'};
    };

    // now that we have the reference to the password, remove it
    delete req.body.password;
 
    let userObj = {};

    User.findOne({username})
        .then(user => {
            if (!user && !password && !user.compareHash(password)){
                console.log('failed to find user or password or pwd compare');
                throw {code: 400, message: 'Invalid username or password'};
            };
            userObj.userId = user._id;
            userObj.userName = user.username;
            return token.assignToken(user);
        })
        .then(token => {
            userObj.token = token;
            res.send(userObj);
        })
        .catch(next);
});

module.exports = router;
