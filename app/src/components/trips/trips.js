import template from './trips.html';

export default {
    template,
    controller
};

controller.$inject = ['tripService', '$timeout', '$rootScope'];

function controller(tripSvc, timeout, rootScope) {
    tripSvc.get()
    .then((trip) => {
        this.trips = trip;
        console.log('trip is ', trip);
        console.log(this.trips[0].name);
    });
}


