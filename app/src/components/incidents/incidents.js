import template from './incidents.html';

export default {
    template,
    controller
};

controller.$inject = ['lynchService', '$timeout', '$rootScope'];

function controller(lynchSvc, timeout, rootScope) {
    this.newFilter = false;
    this.activeFilter = null;

    this.queryNumber=-1; 

    this.newQuery = {
        category: null,
        target: null,
        number: null
    };

    this.queries = [];

    this.filters = [
        {
            name: 'year',
            value: 'year'
        },
        {
            name: 'county',
            value: 'county'
        },
        {
            name: 'place',
            value: 'place'
        }
    ];
   
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

    this.classes = ['btn btn-primary', 'btn btn-secondary', 'btn btn-warning', 'btn btn-danger'];

    this.buttonClass = 'btn btn-outline-primary';

    // incidentSvc.get()
    // .then((incident) => {
    //     this.incidents = incident;
    //     console.log('incident is ', incidents);
    //     console.log(this.incidents[0].name);
    // });

    this.addFilter = ()=>{
        this.newFilter=true;
        if (this.newQuery.category !== null && this.newQuery.target !== null){
            this.queryNumber ++;
            if (this.queryNumber > 3){
                this.queryNumber = 0;
            }

            this.newQuery.number = this.queryNumber;

            this.queries.push(this.newQuery);

            let index = this.filters.findIndex((filter)=>{
                return filter.name === this.newQuery.category.name;
            });

            this.filters.splice(index,1);

            this.newQuery = {
                catergory: null,
                target: null,
                number: null
            };
            console.log('filters are ', this.filters);
        }
    };

    this.searchIncidents = ()=>{
        console.log('searching incidents with these queries ', this.queries);
    };

}


