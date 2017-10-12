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
        name: 'trips',
        url: '/trips',
        data: { public: true },
        component: 'trips' 
    });

    $stateProvider.state({
        name: 'trip',
        url: '/trip',
        data: { public: true },
        component: 'trip' 
    });

    $stateProvider.state({
        name: 'about',
        url: '/about',
        data: { public: true },
        component: 'about' 
    });

    $urlRouterProvider.otherwise('/');
}
