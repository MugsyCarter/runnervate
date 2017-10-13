import template from './user.html';

export default {
    template,
    controller
};

controller.$inject = ['userService', '$timeout', '$rootScope'];

function controller(userSvc, timeout, rootScope) {

    // this.user = null;
    // console.log('user is ', this.user);
    
    this.queef = 'queef!';

    return userSvc.getById(rootScope.user.userId)
        .then((user) => {
            console.log('user is ', user[0]);
            this.user = user[0];
        });


};