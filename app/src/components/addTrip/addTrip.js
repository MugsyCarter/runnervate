import template from './addTrip.html';

export default {
    template,
    controller
};

controller.$inject = [ '$rootScope', 'tripService', '$state'];

function controller(rootScope, tripSvc, $state) {
    this.trip = {
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
  
    this.addThisTrip= ()=>{
        console.log('adding this trip ', this.trip);
        tripSvc.addTrip(this.trip)
            .then((trip)=>{
                console.log('this trip was added to the DB ', trip);
            });
    };

          
   

};
