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
        sec: 0,
        min: 0,
        hour:0,
        time: 0 + this.sec + (this.min * 60) + (this.hour * 3600),
        elevation: null,
        pace: null,
        speed: 0,
        time: null,
        pain: null,
        hunger: null,
        ate: false,
        drank: false,
        energy: null,
        wind: null,
        location: null,
        notes: null
    };

    this.pace = false;

    this.runTypes = ['Long Run', 'Intervals', 'Speed Work', 'Fartlek', 'Steady', 'Recovery'];

    this.criteria = ['type', 'miles', 'time'];
    this.workouts = ['run', 'walk', 'strength training', 'sports/other'];

    this.workoutType = 'run';

    this.calculatePace = ()=>{
        this.run.time += this.run.sec + this.run.min*60 + this.run.hour*3600;
        this.run.speed = this.run.miles / (this.run.time / 3600);
        this.run.pace = (this.run.time /60) % this.run.miles;
        this.pace = true;
    };

    this.addRun= ()=>{
        console.log(this.run);
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
                .then((run)=>{
                    console.log('this run was added to the DB ', run);
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
