import template from './app.html';

export default {
    template,
    controller
};


controller.$inject = ['$scope', '$state', '$rootScope', 'userService', '$timeout'];

function controller($scope, $state, rootScope, userSvc, timeout) {

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
        console.log('update location called.  location is ', rootScope.location);
        timeout(function(){
            //boardcast will available to every listener
            rootScope.$broadcast('locationUpdated', location)
        },500);
    });

    rootScope.$on('editIncident', (event, incident)=>{
        console.log('incident ', incident);
        rootScope.incident = incident;
        $state.go('editIncident');
    });


    // rootScope.$on('updateUser', (event, user)=>{
    //     // no code here yet
    // });
    
    rootScope.months = ['none', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    rootScope.races = ['white', 'asian', 'native american', 'black', 'latino'];

    rootScope.weapons = ['gun', 'knife', 'none'];

    this.oldCounties = ['Alameda County', 'Alpine County',
        'Amador County',
        'Butte County',
        'Calaveras County',
        'Colusa County',
        'Contra Costa County',
        'Del Norte County',
        'El Dorado County',
        'Fresno County',
        'Glenn County',
        'Humboldt County',
        'Imperial County',
        'Inyo County',
        'Kern County',
        'Kings County',
        'Lake County',
        'Lassen County',
        'Los Angeles County',
        'Madera County',
        'Marin County',
        'Mariposa County',
        'Mendocino County',
        'Merced County',
        'Modoc County',
        'Mono County',
        'Monterey County',
        'Napa County',
        'Nevada County',
        'Orange County',
        'Placer County',
        'Plumas County',
        'Riverside County',
        'Sacramento County',
        'San Benito County',
        'San Bernardino County',
        'San Diego County',
        'San Francisco County',
        'San Joaquin County',
        'San Luis Obispo County',
        'San Mateo County',
        'Santa Barbara County',
        'Santa Clara County',
        'Santa Cruz County',
        'Shasta County',
        'Sierra County',
        'Siskiyou County',
        'Solano County',
        'Sonoma County',
        'Stanislaus County',
        'Sutter County',
        'Tehama County',
        'Trinity County',
        'Tulare County',
        'Tuolumne County',
        'Ventura County',
        'Yolo County',
        'Yuba County'];

        this.counties = [];

        this.oldCounties.forEach((county)=>{
            let arr = county.split(' ');
            arr.pop();
            let str = arr.join(' ');
            this.counties.push(str);
        });

        rootScope.counties = this.counties;

        rootScope.states = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
};