import template from './addIncident.html';

export default {
    template,
    controller
};

controller.$inject = [ '$rootScope', 'lynchService', '$state'];

function controller(rootScope, lynchSvc, $state) {
    this.incident = {
        name: null,
        type: null,
        startDate: null,
        endDate: null,
        startLocation: null,
        endLocation: null,
        description: null,
        mileage: null,
        people: [],
        fun: null,
        scenery: null,
        difficulty: null,
        overall: null,
        comments: [],
        photos: [],
        activities: []
    };
  
    this.addThisIncident= ()=>{
        console.log('adding this incident ', this.incident);
        lynchSvc.addIncident(this.incident)
            .then((incident)=>{
                console.log('this incident was added to the DB ', incident);
            });
    };

          
   

};
