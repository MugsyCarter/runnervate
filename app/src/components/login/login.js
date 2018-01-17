import template from './login.html';

export default {
    template,
    controller
};

controller.$inject = [ '$rootScope', 'authService', '$state'];

function controller(rootScope, authSvc, $state) {
    this.credentials = {};
    this.authenticate = () => {
        console.log('authenticate called');
        return authSvc.login(this.credentials)
            .then((user) => {
                console.log('user is ', user);
                localStorage.setItem('user', JSON.stringify(user));
                rootScope.$emit('login', {user: user});
                $state.go('home');
            })
            .catch(error => {
                this.error = error;
            });        
    };
};
