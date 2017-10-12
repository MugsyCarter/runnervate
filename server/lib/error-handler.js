
module.exports = function errorHandler (err, req, res, next) {
    // console.log('errorhandler err:', err);
    const code = err.code || 500;
    const message = code === 500 ? 'Internal Server Error' : err.message;

    res.status(code).send({message});

};
