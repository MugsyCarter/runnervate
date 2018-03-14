import template from './app.html';

export default {
    template,
    controller
};


controller.$inject = ['$scope', '$state', '$rootScope', 'userService', 'lynchService', '$timeout'];

function controller($scope, $state, rootScope, userSvc, lynchSvc, timeout) {

    this.state = $state;
    console.log('state is ', this.state);
    rootScope.map = false;

    this. searchQuery = '';

    this.searchFor = ()=>{
        console.log('searching for this town: ', this.searchQuery);
        rootScope.query = this.searchQuery;
        $state.go('incidents');
        console.log('state is ', $state);
        console.log('statename is ', $state.current.name);
    };

    rootScope.loggedIn=false;
    this.loggedIn=false;

    rootScope.$on('login', (event, user)=>{
        // console.log('after Logged in, useris ', user.user);
        this.user = user.user;
    //     console.log('user logged in as ', user);
        rootScope.loggedIn = true;
        this.loggedIn = true;
    //     $state.go('user');
    // });
        userSvc.getById(this.user.userId)
            .then((user) => {
                console.log('user is ', user[0]);
                rootScope.user = user[0];
                console.log('user is ', rootScope.user);
                this.user = rootScope.user;
            });
    });

    rootScope.$on('logout', (event)=>{
        this.user = null;
        this.loggedIn = false;
        $state.go('home');
        rootScope.user = null;
        rootScope.loggedIn = false;
        // console.log('Logged out, useris ', user.user);
        // this.updateMenu();
    });

    rootScope.$on('seeFullIncident', (event, incident)=>{
        console.log('incident is ', incident);
        incident.fullView = true;
        this.incidentQuery = {
            category:   {name: 'Case Number',value: 'caseNum'},
            target: incident.caseNum,
            number: null
        };
        this.queries.push(this.incidentQuery);
        
        // rootScope.$broadcast('fullIncident', incident);
        timeout(function(){
            $state.go('incidents');},500);
    });
    // rootScope.$on('updateActiveIncidents', (event)=>{
    //     console.log('updatingActiveIncidents', this.incidents);
    // });

    rootScope.$on('updateLocation', (event, location)=>{
        // console.log('update location called.  location is ', location);
        this.findIncidentData(location);
    });

    rootScope.$on('editIncident', (event, incident)=>{
        console.log('incident ', incident);
        rootScope.incident = incident;
        $state.go('editIncident');
    });


    // rootScope.$on('updateUser', (event, user)=>{
    //     // no code here yet
    // });


    //filter stuff here
    this.newFilter = false;
    this.activeFilter = null;
    this.newQuery = {
        category: null,
        target: null,
        number: null
    };
    this.queries = [];
    this.queryNumber=-1; 
    this.filters = [
        {name: 'year',value: 'year'},
        {name: 'county',value: 'county'},
        {name: 'place',value: 'place'},
        {name: 'open or secret',value: 'open'},
        {name: 'lethality',value: 'lethality'},
        {name: 'crime',value: 'accusiations.crime', accused: true, collection: 'accusations'},
        {name: 'punishment',value: 'punishment.punishment', accused: true, collection: 'punishments'},
        {name: 'race of accused',value: 'accused.race', accused: true, collection: 'accused'},
        {name: 'nationality of accused',value: 'accused.nationality', accused: true, collection: 'accused'}
    ];
    this.classes = ['btn btn-primary', 'btn btn-secondary', 'btn btn-warning', 'btn btn-danger'];
    this.buttonClass = 'btn btn-outline-primary';

    this.removeFilter = (filter)=>{
        console.log('removing this filter ', filter);

        this.filters.push(filter.category);

        let index = this.queries.findIndex((query)=>{
            console.log('query name is ' + query.category.name + ' and filter name is ' + filter.category.name);
            return query.category.name === filter.category.name;
        });

        this.queries.splice(index,1);

    };

    //loads all incidens and incident data
    this.loadIncidents = ()=>{
        lynchSvc.get()
            .then((incidents)=>{
                //get all incidents
                this.incidents = incidents;
                this.sortResults(incidents);
            });
       
    };

    //sorts all incidents by date
    this.sortResults = (incidents)=>{
        let incidentNumber = incidents.length;
        this.sorted = incidents.sort((a,b)=>{
            let newA = (a.year*365);
            let newB = (b.year*365);
            if (a.month){
                newA+=(a.month*30);
            }
            if (a.day){
                newA += a.day;
            }
            if (b.month){
                newB+=(b.month*30);
            }
            if (b.day){
                newB += b.day;
            }
            return newA-newB;
        });
        console.log('#SORTED: calling update incidents with these incidents', this.sorted);
        this.updateIncidents(this.sorted);
    };

    //broadcast incidents downstream
    this.updateIncidents = (incidents)=>{
        rootScope.incidents = incidents;
        this.incidents = incidents;
        console.log('updating rootscope active incidents', incidents);
        timeout(function(){
            rootScope.$broadcast('incidentsUpdated', rootScope.incidents);},500);
    };

    this.searchIncidents = ()=>{
        console.log('this.incidents ', this.incidents);
        console.log('this.queries ', this.queries);
        //  if (this.newFilter = true){
        //      console.log('newFilter is true')
        //      this.filteredIncidents = [];
        //  }

       //add new query to others if present
        if(this.newQuery.target){
            //if there is a new query add it
            console.log('new query is ', this.newQuery);
            this.queries.push(this.newQuery);
            //wipe newQuery
            this.newQuery = null;
        }
        //apply queries to all incidents
        if(this.queries.length>0){
            console.log(this.queries[0].category.value);
            console.log(this.incidents[0]);
            console.log(this.incidents[0] + '===' + this.queries[0].target);
            this.filtered = this.incidents.filter((incident)=>{
                return incident[this.queries[0].category.value] === this.queries[0].target;
            });
        }
        if(this.queries.length>1){
            for (let i = 1; i < this.queries.length; i++){
                this.filtered = this.filtered.filter((incident)=>{
                    return incident[this.queries[i].category.value] === this.queries[i].target;
                });
                // this.incidents = filtered;
            }
        }
        //sort results
        console.log(this.filtered);
        this.newQuery = null;
        this.sortResults(this.filtered);
    };

        //if a filter needs to be added
        // this.incidents = [];
        // console.log(2);
        // this.newFilter=true;
        // //if query cant be found by incident
        // if (this.newQuery.category.accused){
        //     console.log('ACCUSED');
        //     queryString = '?' +  this.queries[0].category.value + '=' + this.queries[0].target;
        //     lynchSvc.getIncidentByAccused(this.queries[0].category.collection, queryString)
        //         .then((results)=>{
        //             console.log('these results came back ', results);

        //         });
        //     queryString = '';
        // }
        // //the the query can only be incident
        // else{
        //     console.log('INCIDENT');  
        //     if (this.newQuery.category !== null && this.newQuery.target !== null){
        //         this.queryNumber ++;
        //         if (this.queryNumber > 3){
        //             this.queryNumber = 0;
        //         }

        //         this.newQuery.number = this.queryNumber;

        //         this.queries.push(this.newQuery);

        //         let index = this.filters.findIndex((filter)=>{
        //             return filter.name === this.newQuery.category.name;
        //         });

        //         this.filters.splice(index,1);

        //         this.newQuery = {
        //             category: null,
        //             target: null,
        //             number: null
        //         };
        //         console.log('filters are ', this.filters);
        //     }
        //     console.log('searching incidents with these queries ', this.queries);
        //     let queryString = '';
        //     if (this.queries.length > 0){  
        //         queryString += '?' + this.queries[0].category.value + '=' + this.queries[0].target;           
        //         }
        //         for (let i=1; i < this.queries.length; i++){
        //             queryString += '&' + this.queries[i].category.value + '=' + this.queries[i].target; 
        //         }
        //     }
        //     console.log(queryString);
        //     lynchSvc.getByQuery(queryString)
        //         .then((incidents)=>{
        //             incidents.forEach((incident)=>{
        //                 this.incidents.push(incident);
        //             });
        //             this.sortResults(this.incidents);
        //         });
    

    this.collections = [
        'accused', 'books', 'manuscripts', 'oldNotes', 'newspapers', 'websites'
    ]; 

    this.accusedInfo = ['accusations', 'names', 'punishments'];

    this.findIncidentData = (incident)=>{
        // console.log('finding data for this caseNum: ', incident.caseNum);
        //the code still needs to be added here to look up additional case info
        for (let i=0; i < this.collections.length; i++){
            lynchSvc.getAllData(incident, this.collections[i])
                .then((moreData)=>{
                    // console.log(moreData);
                    incident[this.collections[i]] = moreData;
                    // console.log('incident is ', incident);
               
                 
                    if (this.collections[i] === 'accused'){
                        // console.log('incident.accused is ', incident.accused);
                        for (let j=0; j < incident.accused.length; j++){
                            for (let k=0; k<this.accusedInfo.length; k++){
                                lynchSvc.getAccusedData(incident, incident.accused[i], this.accusedInfo[k])
                                    .then((accusedData)=>{
                                        // console.log(accusedData);
                                        incident.accused[j][this.accusedInfo[k]] = accusedData;
                                    });
                            }
                        }
                    }
                });
        }
        timeout(function(){
            //this code creates a string of all of the names for an accused person
            // console.log('right before loops.  incident.accused is ', incident.accused);
            // console.log('incident.accused.length is ', incident.accused.length);
            for (let l= 0; l < incident.accused.length; l++){
                incident.accused[l].namesString = '';
                // console.log('this accused names are ', incident.accused[l].names);
                if(incident.accused[l].names.length>1){
                    for (let m =0; m < incident.accused[l].names.length; m++){
                        let newFullName = '';
                        if (incident.accused[l].names[m].first){
                            newFullName += incident.accused[l].names[m].first;  
                        }
                        if (incident.accused[l].names[m].middle){
                            newFullName += ' ' + incident.accused[l].names[m].middle;  
                        }
                        if (incident.accused[l].names[m].last){
                            newFullName += ' ' + incident.accused[l].names[m].last;  
                        }

                        if (incident.accused[l].names.length-1 === m){
                            incident.accused[l].namesString += newFullName;
                        }
                        else{
                            incident.accused[l].namesString += newFullName + ', ';
                        }
                    }
                }
            }
            //this code adds author strings for the books
            
            incident.books.forEach((book)=>{
                let bookPeople = ['au', 'editor'];
                for (let n = 0; n < bookPeople.length; n++){
                    let str = bookPeople[n] + 'String';
                    book[str] = '';
                    if (book[bookPeople[n] + 'Fn']){
                        book[str] += book.auFn + ' ';
                    } 
                    if(book[bookPeople[n] + 'Mn']){
                        book[str] += book.auMn + ' ';
                    }
                    if(book[bookPeople[n] + 'Ln']){
                        book[str] += book.auLn;
                    }
                    if (book[bookPeople[n] + 'suffix']){
                        book[str] += ' ' + book.auSuffix + ' ';
                    } 
                }
            });
            rootScope.$broadcast('locationUpdated', incident);
        },500);
    };

    rootScope.findIncidentData = this.findIncidentData;
    rootScope.loadIncidents = this.loadIncidents;
    
    rootScope.months = this.months = ['none', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    this.races = rootScope.races = ['White', 'Native American', 'African American', 'Latinx', 'Asian', 'Pacific Islander', 'Mixed Race'];

    this.weapons = rootScope.weapons = ['gun', 'knife', 'none'];

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

    rootScope.counties = this.counties;

    this.states = rootScope.states = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
};