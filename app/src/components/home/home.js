import template from './home.html';

export default {
    template,
    controller
};


controller.$inject = ['$timeout'];

function controller($timeout) {

    this.letterOptions = [['I', 'E'],['N', 'S'],['T','F'],['J','P']];
    this.letters=[];

    this.letters = [];
    this.count = 0;


    this.update = ()=>{
        if (this.count < 1000){
            for(let i=0;i<this.letterOptions.length; i++){
                this.letters[i] = this.letterOptions[i][Math.round(Math.random())];
            }
            this.count ++;
            $timeout(this.update, 2000);
        }
    };

    this.update();

};