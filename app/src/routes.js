routes.$inject = ['$stateProvider', '$urlRouterProvider']; 

export default function routes($stateProvider, $urlRouterProvider) {
    
    $stateProvider.state({
        name: 'home',
        url: '/',
        data: { public: true },
        component: 'home' 
    });

    $stateProvider.state({
        name: 'user',
        url: '/user',
        data: { public: true },
        component: 'user' 
    });

    $stateProvider.state({
        name: 'lynchMap',
        url: '/lynchMap',
        data: { public: true },
        component: 'lynchMap' 
    });

    $stateProvider.state({
        name: 'incidents',
        url: '/incidents',
        data: { public: true },
        component: 'incidents' 
    });

    $stateProvider.state({
        name: 'editIncident',
        url: '/editIncident',
        data: { public: true },
        component: 'editIncident' 
    });

    $stateProvider.state({
        name: 'addRun',
        url: '/addRun',
        data: { public: true },
        component: 'addRun' 
    });

    $stateProvider.state({
        name: 'about',
        url: '/about',
        data: { public: true },
        component: 'about' 
    });

    $stateProvider.state({
        name: 'login',
        url: '/login',
        data: { public: true },
        component: 'login' 
    });

    $stateProvider.state({
        name: 'logout',
        url: '/logout',
        data: { public: true },
        component: 'logout' 
    });

    $stateProvider.state({
        name: 'signup',
        url: '/signup',
        data: { public: true },
        component: 'signup' 
    });


    $urlRouterProvider.otherwise('/');
}
