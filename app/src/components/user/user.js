import template from './user.html';

export default {
    template,
    controller
};

controller.$inject = ['$timeout', '$rootScope'];

function controller(timeout) {
    
    this.user = {
        name: 'Mugsy Carter',
        birthdate: '9/18/1982',
        trips: [],
        favorite: 'trip id here'    
    };
   
};