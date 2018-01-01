import template from './incidents.html';

export default {
    template,
    controller
};

controller.$inject = ['lynchService', '$timeout', '$rootScope'];

function controller(lynchSvc, timeout, rootScope) {
    this.filters = [
        {
            name: 'year',
            value: 'year'
        },
        {
            name: 'state',
            value: 'state'
        },
        {
            name: 'county',
            value: 'county'
        },
        {
            name: 'place',
            value: 'place'
        }
    ];
   
   
    // incidentSvc.get()
    // .then((incident) => {
    //     this.incidents = incident;
    //     console.log('incident is ', incidents);
    //     console.log(this.incidents[0].name);
    // });
}


