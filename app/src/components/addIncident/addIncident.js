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

    this.counties = ['Alameda County', 'Alpine County',
        'Amador County',
        'Butte County',
        'Calaveras County',
        'Colusa County',
        'Contra Costa County',
        'Del Norte County',
        'El Dorado County',
        'Fresno County',
        'Glenn County',
        'Humboldt County',
        'Imperial County',
        'Inyo County',
        'Kern County',
        'Kings County',
        'Lake County',
        'Lassen County',
        'Los Angeles County',
        'Madera County',
        'Marin County',
        'Mariposa County',
        'Mendocino County',
        'Merced County',
        'Modoc County',
        'Mono County',
        'Monterey County',
        'Napa County',
        'Nevada County',
        'Orange County',
        'Placer County',
        'Plumas County',
        'Riverside County',
        'Sacramento County',
        'San Benito County',
        'San Bernardino County',
        'San Diego County',
        'San Francisco County',
        'San Joaquin County',
        'San Luis Obispo County',
        'San Mateo County',
        'Santa Barbara County',
        'Santa Clara County',
        'Santa Cruz County',
        'Shasta County',
        'Sierra County',
        'Siskiyou County',
        'Solano County',
        'Sonoma County',
        'Stanislaus County',
        'Sutter County',
        'Tehama County',
        'Trinity County',
        'Tulare County',
        'Tuolumne County',
        'Ventura County',
        'Yolo County',
        'Yuba County'];

    this.addThisIncident= ()=>{
        console.log('adding this incident ', this.incident);
        lynchSvc.addIncident(this.incident)
            .then((incident)=>{
                console.log('this incident was added to the DB ', incident);
            });
    };

          
   

};
