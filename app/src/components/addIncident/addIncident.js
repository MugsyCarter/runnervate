import template from './addIncident.html';

export default {
    template,
    controller
};

controller.$inject = [ '$rootScope', 'lynchService', '$state'];

function controller(rootScope, lynchSvc, $state) {

    this.user = rootScope.user;
    
    this.showFormData = false;
    this.decimal = 'true';
    this.incident = {
        cwIndex: null,
        gdIndex: null,
        origDBindex: null,
        caseNum: null,
        crossRefNotesCwGd: null,
        
        year: null,
        month: null,
        day: null,
        dateNotes: null,
        state: 'California',
        place: null,
        county: null,
        locationNotes: null,
        latDecimal:  null,
        lonDecimal:  null,
        latNDegrees: null,
        latNMinutes: null,
        latNSeconds: null,
        lonWDegrees: null,
        lonWMinutes: null,
        lonWSeconds: null,
        crowdType: null,
        crowdSize: null,
        open: true,
        authoritiesPresent: null,
        authoritiesNotes: null,
        crime: null,
        punishment: null,
        lethality: null,
        otherNamesMentioned: null,
        suspects: [
            {
                suspectNames: [],
                suspectRace: [],
                suspectGender: null,
                confessionOrSpeech: null,
                confessionNotes: null,
                attendedByClergy: false, 
                suspectNotes: null
            }
        ],
        victims: [
            {
                victimNames: [],
                victimGender: null,
                victimRace: null,
                victimNotes: null
            }
        ],
        sources: [
            {
                type: null,
                publicationDate: null,
                publicationCity: null,
                publicationDate: null,
                author: null,
                title: null,
                volumeNumber: null,
                pageNumbers: null,
                sourceNotes: null,
                url: null
            }
        ],
        abstract: null,
    };


    this.source = {
        type: null,
        publicationDate: null,
        publicationCity: null,
        publicationDate: null,
        author: null,
        title: null,
        volumeNumber: null,
        pageNumber: null,
        notes: null,
        url: null,

        day: null,
        month: null,
        year: null, 

        pageStart: null,
        pageEnd: null,

        state: 'California',
        city: null,
    };


    this.sourceTypes = ['book', 'newspaper', 'magazine', 'journal', 'website'];

    this.races = rootScope.races;

    this.suffs = ['jr.', 'sr.', 'III'];

    this.states = rootScope.states;

    this.counties = rootScope.counties;

    this.weapons = rootScope.weapons;

    this.addThisIncident= ()=>{
        if (this.decimal === 'false'){
            //write code to convert here
            this.incident.latDecimal = this.incident.latNDegrees + (this.incident.latNMinutes/60) + (this.incident.latNSeconds/3600);;
            this.incident.lonDecimal = 0 - (this.incident.lonWDegrees + (this.incident.lonWMinutes/60) + (this.incident.lonWSeconds/3600));
            console.log(this.incident.lonDecimal);
        }
        console.log('adding this incident ', this.incident);
        this.showFormData = true;
        // lynchSvc.addIncident(this.incident)
        //     .then((incident)=>{
        //         console.log('this incident was added to the DB ', incident);
        //     });
    };

    this.addThisSource = ()=>{
        console.log('adding this source', this.source);
    };     
   

};
