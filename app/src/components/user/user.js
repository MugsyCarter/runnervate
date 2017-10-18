import template from './user.html';

export default {
    template,
    controller
};

controller.$inject = ['userService', '$timeout', '$rootScope'];

function controller(userSvc, timeout, rootScope) {

    this.user = {
        name: 'Fartlord'
    };
    console.log('user is ', this.user);
    console.log('rootScope.user.userId is ', rootScope.user.userId);

    userSvc.getById(rootScope.user.userId)
        .then((user) => {
            console.log('user is ', user[0]);
            this.user = user[0];
            console.log('user is ', this.user);
        });
    


};