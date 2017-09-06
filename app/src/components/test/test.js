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
    this.type = [];
    this.typeOptions = [['Extroversion', 'Introversion'],['iNtuiting', 'Sensing'],['Thinking','Feeling'],['Judging','Perceiving']];
    this.showLetter = false;
    this.strengths = ['strong', 'moderate', 'weak'];
    this.typeDescriptions = [
        ['recharge your energy by spending time with people.', 'recharge your energy by spending time alone.'],
        ['experience the world through concepts and abstractions.', 'experience the world directly with your senses.'],
        ['process information by thinking about it logically.', 'process information by determining how you feel about it emotionally.'],
        ['make descisions and move on.', 'delay making descisions and keep all of your options open.']
    ];

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
                    text: 'libertarian',
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
                    text: 'Nurse',
                    points: [0,-1,-2,2]
                },
                {
                    text: 'computer programmer',
                    points: [-1,1,2,-1]
                },
                {
                    text: 'high school teacher',
                    points: [1,2,0,0]
                },
                {
                    text: 'police office',
                    points: [0,-1,2,2]
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
                    text: 'make sure all voices are heard',
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
            text: 'What might people dislike about you?',
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
            text: 'What might people like about you?',
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
            text: 'Which of these pastimes would you most enjoy?',
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
        },
        {
            number: 11,
            text: 'What does fairness mean to you?',
            options: [
                {
                    text: 'holding everyone to the same standard',
                    points: [0,0,2,0]
                },
                {
                    text: 'considering the needs and experiences of everyone invloved',
                    points: [0,0,-2,0] 
                }
            ]
        },
        {
            number: 12,
            text: 'Which of the following best describes your relationship to finishing a task?',
            options: [
                {
                    text: 'once I finish the task, I can relax and play',
                    points: [0,0,0,2]
                },
                {
                    text: 'I can play and work at the same time',
                    points: [0,0,0,-2] 
                }
            ]
        },
        {
            number: 13,
            text: 'What is the first thing you notice about a painting?',
            options: [
                {
                    text: 'the details of the image',
                    points: [0,-2,0,0]
                },
                {
                    text: 'the significance of the image',
                    points: [0,2,0,0] 
                },
                {
                    text: 'uggg, art is so boring',
                    points: [1,-1,0,0] 
                }
            ]
        }

    ];

    this.addStrength = ()=>{
        for (let i =0; i < this.result.length; i ++){
            if(this.result[i]>7 || this.result[i]<-7){
                this.type[i].strength = 'strong';
            }
            else if (this.result[i] > 2 || this.result[i] <-2 ){
                this.type[i].strength = 'moderate';
            } 
            else{
                this.type[i].strength = 'weak';
            }
        }
        this.addDescriptions();
    };

    this.addDescriptions = ()=>{
        for (let i=0; i < this.type.length; i++){
            this.type[i].text = 'You have a ' + this.type[i].strength + ' preference for ';
            if (this. result[i] > 0){
                this.type[i].text += this.typeOptions[i][0] + ' over ' + this.typeOptions[i][1] + '. You prefer to ' + this.typeDescriptions[i][0];


            }
            else{
                this.type[i].text += this.typeOptions[i][1] + ' over ' + this.typeOptions[i][0] + '. You prefer to ' + this.typeDescriptions[i][1];
            }
        }
    };

    this.finish = ()=>{
        console.log('finishing up, these are the points ', this.result);
        this.type = [];
        if (this.result[0] > 0 ){
            this.type.push({letter: 'E'});
        }
        else{
            this.type.push({letter: 'I'});
        }
        if (this.result[1]> 0){
            this.type.push({letter: 'N'});
        }
        else {
            this.type.push({letter: 'S'});
        }
        if (this.result[2] > 0){
            this.type.push({letter: 'T'});
        }
        else {
            this.type.push({letter: 'F'});
        }
        if (this.result[3] > 0){
            this.type.push({letter: 'J'});
        }
        else{
            this.type.push({letter: 'P'});
        }
        this.addStrength();
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