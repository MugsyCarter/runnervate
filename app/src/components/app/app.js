import template from './app.html';

export default {
    template,
    controller
};


controller.$inject = ['$state', '$rootScope'];

function controller($state, rootScope) {

    this. searchQuery = '';
    this.searchFor = ()=>{
        console.log('searching for this town: ', this.searchQuery);
        $state.go('home');
        rootScope.query = this.searchQuery;
        $state.go('incidents');
    };

    // this.loggedIn=false;

    // rootScope.$on('login', (event, user)=>{
    //     // console.log('after Logged in, useris ', user.user);
    //     rootScope.user = user.user;
    //     console.log('user logged in as ', user);
    //     this.loggedIn = true;
    //     $state.go('user');
    // });

    // rootScope.$on('logout', (event)=>{
    //     this.user = null;
    //     this.loggedIn = false;
    //     $state.go('home');
    //     // console.log('Logged out, useris ', user.user);
    //     // this.updateMenu();
    // });

    // rootScope.$on('updateUser', (event, user)=>{
    //     // no code here yet
    // });
};