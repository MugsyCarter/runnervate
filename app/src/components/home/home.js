import template from './home.html';

export default {
    template,
    controller
};


controller.$inject = ['$timeout', '$rootScope'];

function controller($timeout, rootScope) {
    this.user = rootScope.user;
    this.loggedIn = rootScope.loggedIn;
    console.log(this.loggedIn);
//     this.letters=[];
//     this.letterOptions = [['I', 'E'],['N', 'S'],['T','F'],['J','P']];

//     this.letters = [];
//     this.count = 0;
  


//     this.update = ()=>{
//         if (this.count < 1000){
//             for(let i=0;i<this.letterOptions.length; i++){
//                 this.letters[i]= {letter: this.letterOptions[i][Math.round(Math.random())]};
//             }
//             this.count ++;
//             $timeout(this.update, 1000);
//         }
//     };

//     this.update(); fun

};