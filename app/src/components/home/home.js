import template from './home.html';

export default {
    template,
    controller
};


controller.$inject = ['$timeout'];

function controller(timeout) {

    this.letterOptions = [['I', 'E'],['N', 'S'],['T','F'],['J','P']];
    this.letters=[];


    this.update = ()=>{
        for(let i=0;i<this.letterOptions.length; i++){
            this.letters[i] = this.letterOptions[i][Math.round(Math.random())];
        } 
    };

    this.update();

    this.stop = false;
    while(this.stop === false){
        timeout(()=>{this.update();}, 1000);
    }

};