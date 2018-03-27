import template from './addRun.html';

export default {
    template,
    controller
};

controller.$inject = [ '$rootScope', 'runService', '$state'];

function controller(rootScope, runSvc, $state) {

    this.user = rootScope.user;
    
    this.showFormData = false;
   
    this.run = {
        type: null,
        miles: null,
        time: null,
        elevation: null,
        pace: null,
        speed: null,
        time: null,
        pain: null,
        hunger: null,
        energy: null,
        wind: null,
        location: null,
        notes: null
    };


    this.runTypes = ['Long Run', 'Intervals', 'Speed Work', 'Fartlek', 'Steady', 'Recovery'];

    this.criteria = ['type', 'miles', 'time'];

    this.addThisRun= ()=>{
        let count = 0;
        for (let i = 0; i < this.criteria.length; i++){
            if (this.run[criteria[i]]){
                count ++;
            }
        }
        if(count === 3){
            console.log('adding this incident ', this.incident);
            this.showFormData = true;
            runSvc.addRun(this.run)
                .then((incident)=>{
                    console.log('this incident was added to the DB ', incident);
                });
        }
        else{
            alert('Fill in the required fields before adding this run.');
        }
    };

    this.addThisSource = ()=>{
        console.log('adding this source', this.source);
    };     
   

};
