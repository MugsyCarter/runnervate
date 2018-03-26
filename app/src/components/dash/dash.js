import template from './dash.html';


export default {
    template,
    controller
};

controller.$inject = ['lynchService', '$timeout', '$rootScope', 'googleMapsUrl', 'NgMap', '$location', '$anchorScroll'];

function controller(runSvc, timeout, rootScope, googleMapsUrl, NgMap, $location, $anchorScroll) {
    // console.log('root scoped query is ', rootScope.query);
    this.loading = true;
};