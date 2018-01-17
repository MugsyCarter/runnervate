import template from './user.html';

export default {
    template,
    controller
};

controller.$inject = ['userService', '$timeout', '$rootScope'];

function controller(userSvc, timeout, rootScope) {

    this.user = {
        name: ''
    };
    
    this.user = rootScope.user;

    console.log('user is ', this.user);

};