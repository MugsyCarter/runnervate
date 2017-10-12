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
        gender: '',
        email: '',
        level: 0,
        role: 'user',
        unknown: [],
        learning: [],
        solid: []
    };

    this.authenticate = () => {
        console.log('authenticate called');
        this.credentials.name = this.first+' '+this.last;
        return authSvc.signup(this.credentials)
            .then((user) => {
                console.log('user is ', user);
                localStorage.setItem('user', JSON.stringify(user));
                rootScope.$emit('signin', {user: user});
                $state.go('courses');
            })
            .catch(error => {
                this.error = error;
            });        
    };


};