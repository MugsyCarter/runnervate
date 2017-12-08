import template from './incidents.html';

export default {
    template,
    controller
};

controller.$inject = ['incidentService', '$timeout', '$rootScope'];

function controller(incidentSvc, timeout, rootScope) {
    incidentSvc.get()
    .then((incident) => {
        this.incidents = incident;
        console.log('incident is ', incidents);
        console.log(this.incidents[0].name);
    });
}


