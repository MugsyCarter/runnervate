import template from './test.html';

export default {
    template,
    controller
};

controller.$inject = ['$timeout', '$rootScope'];

function controller(timeout) {
    this.result=[0,0,0,0];
    //this coresponds to the personality values 'ENTJ' in order
    
    this.number = 1;
    this.type = '';

    this.questions= [
        {
            number: 1,
            text: 'Which fantasy author would you rather read?',
            options: [
                {
                    text: 'JRR Tolkein',
                    points: [0,2,1,0]
                },
                {
                    text: 'JK Rowling',
                    points: [0,2,1,0]
                },
                {
                    text: 'neither, I don\'t like reading fantasy books',
                    points: [0,-2,0,0]
                },
            ]
        },
        {
            number: 2,
            text: 'Where would you rather hang out?',
            options: [
                {
                    text: 'at home',
                    points: [-2,0,0,0]
                },
                {
                    text: 'at a social gathering',
                    points: [2,0,0,0]
                }
            ]
        }
    ];

    this.finish = ()=>{
        console.log('finishing up, these are the points ', this.result);
        this.type = '';
        if (this.result[0] > 0 ){
            this.type += 'E';
        }
        else{
            this.type += 'I';
        }
        if (this.result[1]> 0){
            this.type += 'N';
        }
        else {
            this.type += 'S';
        }
        if (this.result[2] > 0){
            this.type += 'T';
        }
        else {
            this.type += 'F';
        }
        if (this.result[3] > 0){
            this.type += 'J';
        }
        else{
            this.type += 'P';
        }
        console.log(this.type);
    };

    this.answer = (points)=>{
        console.log(points); 
        for (let i =0; i < points.length; i++){
            this.result[i] += points[i];
        }
        this.number ++;
        if (this.number>this.questions.length){
            this.finish();
        }
    };





};