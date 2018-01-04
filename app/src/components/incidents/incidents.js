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

    this.incidents = [];
    

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
   
    this.oldCounties = ['Alameda County', 'Alpine County',
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

    this.counties = [];

    this.oldCounties.forEach((county)=>{
        let arr = county.split(' ');
        arr.pop();
        let str = arr.join(' ');
        this.counties.push(str);
    });
    
    this.classes = ['btn btn-primary', 'btn btn-secondary', 'btn btn-warning', 'btn btn-danger'];

    this.buttonClass = 'btn btn-outline-primary';

    lynchSvc.get()
    .then((incident) => {
        this.incidents = incident;
    });

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

    this.removeFilter = (filter)=>{
        console.log('removing this filter ', filter);

        this.filters.push(filter.category);

        let index = this.queries.findIndex((query)=>{
            console.log('query name is ' + query.category.name + ' and filter name is ' + filter.category.name);
            return query.category.name === filter.category.name;
        });

        this.queries.splice(index,1);

    };

    this.showIncident= (incident)=>{
        incident.fullView = true;
    };

    this.hideIncident= (incident)=>{
        incident.fullView = false;
    };

    this.searchIncidents = ()=>{
        console.log('searching incidents with these queries ', this.queries);
        let queryString = '';
        if (this.queries.length > 0){
            queryString += '?' + this.queries[0].category.value + '=' + this.queries[0].target;
            for (let i=1; i < this.queries.length; i++){
                queryString += '&' + this.queries[i].category.value + '=' + this.queries[i].target; 
            }
        }
        console.log(queryString);
        lynchSvc.getByQuery(queryString)
            .then((incidents)=>{
                this.incidents=incidents;
                console.log(this.incidents);
                this.incidentNumber = this.incidents.length;
                this.incidents.sort((a,b)=>{
                    return a.year > b.year
                });
            });
         
    };

    lynchSvc.get()
        .then((incidents)=>{
            this.incidents=incidents;
            console.log(this.incidents);
            this.incidentNumber = this.incidents.length;
            let sorted = this.incidents.sort((a,b)=>{
                return parseInt(a.year) > parseInt(b.year);
            });
            this.incidents = sorted;
        });



    // this code populates the DB
    // this.oldJSON.forEach((entry)=>{
        // if (entry.yearMonthDay.length > 0){
        //     entry.month = 
        // }
        // lynchSvc.addIncident(entry)
        // .then((incident)=>{
        //     console.log('posted ', incident);
        // });
    //     console.log(entry);
    // });

}


