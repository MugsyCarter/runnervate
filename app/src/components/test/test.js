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
                    points: [0,2,-1,0]
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
        },
        {
            number: 3,
            text: 'What are your politics?',
            options: [
                {
                    text: 'conservative',
                    points: [0,0,1,2]
                },
                {
                    text: 'liberatarian',
                    points: [0,0,2,-2]
                },
                {
                    text: 'progressive',
                    points: [0,0,-2,-1]
                }
            ]
        },
        {
            number: 4,
            text: 'Which of these occupations would you prefer?',
            options: [
                {
                    text: 'ER Nurse',
                    points: [0,-1,-2,2]
                },
                {
                    text: 'computer programmer',
                    points: [-1,1,2,-1]
                },
                {
                    text: 'high school teacher',
                    points: [1,2,0,0]
                }
              
            ]
        },
        {
            number: 5,
            text: 'When do you feel better?',
            options: [
                {
                    text: 'when a descision has been made',
                    points: [0,0,0,2]
                },
                {
                    text: 'when your options are still open',
                    points: [0,0,0,-2]
                }
              
            ]
        },
        {
            number: 6,
            text: 'Which of these best describes your typical contribution to group work?',
            options: [
                {
                    text: 'generate ideas',
                    points: [0,1,0,-1]
                },
                {
                    text: 'lead and direct the group',
                    points: [2,0,1,2]
                },
                {
                    text: 'make sure all voices are head',
                    points: [0,0,2,1]
                },
                {  
                    text: 'make sure the work gets done',
                    points: [0,-2,0,2]
                }
            ]
        },
        {
            number: 7,
            text: 'What do  people dislike about you?',
            options: [
                {
                    text: 'your thin skin',
                    points: [0,0,-2,0]
                },
                {
                    text: 'your shyness',
                    points: [-2,0,0,0]
                },
                {
                    text: 'your inability to make a descision',
                    points: [0,0,0,2]
                },
                {  
                    text: 'your lack of empathy',
                    points: [0,0,2,0]
                }
            ]
        },
        {
            number: 8,
            text: 'What do  people like about you?',
            options: [
                {
                    text: 'your intellect',
                    points: [0,0,2,0]
                },
                {
                    text: 'your compassion',
                    points: [0,0,-2,0]
                },
                {
                    text: 'your work ethic',
                    points: [0,-2,0,2]
                },
                {  
                    text: 'your open mind',
                    points: [0,2,0,-2]
                }
            ]
        },
        {
            number: 9,
            text: 'Are you naturally skilled at sports or hands-on skills?',
            options: [
                {
                    text: 'yes',
                    points: [0,-2,0,0]
                },
                {
                    text: 'no',
                    points: [0,2,0,0]
                }
            ]
        },
        {
            number: 10,
            text: 'Which of these pasttimes would you most enjoy?',
            options: [
                {
                    text: 'first person shooter video games',
                    points: [0,-2,2,1]
                },
                {
                    text: 'getting food or drinks with friends',
                    points: [2,0,-2,0] 
                },
                {
                    text: 'turn-based strategy computer games',
                    points: [-1,1,2,-1]
                },
                {
                    text: 'watching tv',
                    points: [-1,-1,0,0]
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