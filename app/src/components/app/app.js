import template from './app.html';

export default {
    template,
    controller
};


controller.$inject = ['$state', '$rootScope', 'userService'];

function controller($state, rootScope, userSvc) {

    this.state = $state;
    
    this. searchQuery = '';
    this.searchFor = ()=>{
        console.log('searching for this town: ', this.searchQuery);
        rootScope.query = this.searchQuery;
        $state.go('incidents');
        console.log('state is ', $state);
        console.log('statename is ', $state.current.name);
    };

    rootScope.loggedIn=false;
    this.loggedIn=false;

    rootScope.$on('login', (event, user)=>{
        // console.log('after Logged in, useris ', user.user);
        this.user = user.user;
    //     console.log('user logged in as ', user);
        rootScope.loggedIn = true;
         this.loggedIn = true;
    //     $state.go('user');
    // });
    userSvc.getById(this.user.userId)
        .then((user) => {
            console.log('user is ', user[0]);
            rootScope.user = user[0];
            console.log('user is ', rootScope.user);
            this.user = rootScope.user;
        });
    });

    rootScope.$on('logout', (event)=>{
        this.user = null;
        this.loggedIn = false;
        $state.go('home');
        rootScope.user = null;
        rootScope.loggedIn = false;
        // console.log('Logged out, useris ', user.user);
        // this.updateMenu();
    });

    rootScope.$on('updateLocation', (event, location)=>{
        console.log('location is ', location);
        rootScope.location = location;
    });


    // rootScope.$on('updateUser', (event, user)=>{
    //     // no code here yet
    // });
};