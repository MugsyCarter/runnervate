import template from './logout.html';

export default {
    template,
    controller
};

controller.$inject = ['tokenService', '$state', '$rootScope'];

function controller(tokenService, $state, rootScope) {

    console.log('before clear '+ localStorage.getItem('user'));
    tokenService.remove();
    localStorage.removeItem('user');
    console.log('after clear '+ localStorage.getItem('user'));
    rootScope.$emit('logout');

}