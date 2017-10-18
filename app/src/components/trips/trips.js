import template from './trips.html';

export default {
    template,
    controller
};

controller.$inject = ['tripService', '$timeout', '$rootScope'];

function controller(tripSvc, timeout, rootScope) {
    return tripSvc.get()
    .then((trip) => {
        console.log('trip is ', trip);
    });

    newFunction();
}
function newFunction() {
    this.myMap =() => {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(51.5, -0.2),
            zoom: 10
        };
        var map = new google.maps.Map(mapCanvas, mapOptions);
        console.log('initializing this map', map);
    };
}

