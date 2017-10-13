import template from './signup.html';

export default {
    template,
    controller
};

controller.$inject = ['authService', '$state', '$rootScope'];

function controller(authSvc, $state, rootScope) {

    this.first='';
    this.last='',

    this.credentials = {
        username: '',
        name: '',
        password: '',
        dob: '',
        email: '',
        role: 'user',
        friends: [],
        trips: []
    };

    this.authenticate = () => {
        console.log('authenticate called');
        this.credentials.name = this.first+' '+this.last;
        return authSvc.signup(this.credentials)
            .then((user) => {
                console.log('user is ', user);
                localStorage.setItem('user', JSON.stringify(user));
                rootScope.$emit('signin', {user: user});
                $state.go('home');
            })
            .catch(error => {
                this.error = error;
            });        
    };


};