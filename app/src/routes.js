routes.$inject = ['$stateProvider', '$urlRouterProvider']; 

export default function routes($stateProvider, $urlRouterProvider) {
    
    $stateProvider.state({
        name: 'home',
        url: '/',
        data: { public: true },
        component: 'home' 
    });

    $stateProvider.state({
        name: 'portfolio',
        url: '/portfolio',
        data: { public: true },
        component: 'portfolio' 
    });

    $stateProvider.state({
        name: 'trips',
        url: '/trips',
        data: { public: true },
        component: 'trips' 
    });

    $stateProvider.state({
        name: 'about',
        url: '/about',
        data: { public: true },
        component: 'about' 
    });

    $urlRouterProvider.otherwise('/');
}
