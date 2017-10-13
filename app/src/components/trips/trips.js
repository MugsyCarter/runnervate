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
}