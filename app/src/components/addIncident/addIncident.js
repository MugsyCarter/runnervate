import template from './addIncident.html';

export default {
    template,
    controller
};

controller.$inject = [ '$rootScope', 'lynchService', '$state'];

function controller(rootScope, lynchSvc, $state) {
    this.incident = {
        indices: {
            cwIndex: null,
            gdIndex: null,
            crossRefNotesCwGd: null
        },
        gisCoordinates: {
            decimal: {
                lat: 0,
                lon: 0
            }
        },
        date: {
            year: null,
            month: null,
            day: null,
            dateNotes: null
        },
        location: {
            state: 'CA',
            place: null,
            county: null,
            locationNotes: null
        },
        lynching: {
            crowdType: null,
            crowdSize: null,
            open: true,
            authorities: null,
            crime: null,
            punishment: null,
            lethalityFormula: null,
            lethality: null,
            otherNamesMentioned: null
        },
        suspects: {
            numberSuspects: null,
            checkSuspects: true,
            suspectNames: [],
            suspectRaces: [],
            confessionOrSpeech: null, 
            suspectNotes: null
        },
        vitims: [
            {
                victimName: [],
                victimGender: null,
                victimRace: null,
                victimNotes: null
            }
        ],
        sourcesAndNotes: {
            sources: null,
            notes: null,
            cwGdIndexDatesNotes: null,
            origDbIndex: null
        }
    };

    this.races = ['white', 'asian', 'indian', 'black', 'latino'];


    this.addThisIncident= ()=>{
        console.log('adding this incident ', this.incident);
        lynchSvc.addIncident(this.incident)
            .then((incident)=>{
                console.log('this incident was added to the DB ', incident);
            });
    };

          
   

};
