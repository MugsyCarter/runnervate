import template from './app.html';

export default {
    template,
    controller
};


controller.$inject = ['$scope', '$state', '$rootScope', 'userService', 'runService', '$timeout'];

function controller($scope, $state, rootScope, userSvc, runSvc, timeout) {

    this.loggedIn = rootScope.loggedIn = false;
    this.active = rootScope.active = {
        home: true,
        about: false,
        profile: false,
        calendar: false,
        login: false,
        signup: false,
        logout: false
    };

    this.changeActive = (page)=>{
        this.active = rootScope.active = {
            home: false,
            about: false,
            profile: false,
            calendar: false,
            login: false,
            signup: false,
            logout: false
        };
        rootScope.active[page] = true;
        this.active = rootScope.active;
    };

    // this.state = $state;
    // console.log('state is ', this.state);
    // rootScope.map = false;

    // this. searchQuery = '';

    // this.searchFor = ()=>{
    //     console.log('searching for this town: ', this.searchQuery);
    //     rootScope.query = this.searchQuery;
    //     $state.go('incidents');
    //     console.log('state is ', $state);
    //     console.log('statename is ', $state.current.name);
    // };

    // rootScope.loggedIn=false;
    // this.loggedIn=false;

    // rootScope.$on('login', (event, user)=>{
    //     // console.log('after Logged in, useris ', user.user);
    //     this.user = user.user;
    // //     console.log('user logged in as ', user);
    //     rootScope.loggedIn = true;
    //     this.loggedIn = true;
    // //     $state.go('user');
    // // });
    //     userSvc.getById(this.user.userId)
    //         .then((user) => {
    //             console.log('user is ', user[0]);
    //             rootScope.user = user[0];
    //             console.log('user is ', rootScope.user);
    //             this.user = rootScope.user;
    //         });
    // });

    // rootScope.$on('logout', (event)=>{
    //     this.user = null;
    //     this.loggedIn = false;
    //     $state.go('home');
    //     rootScope.user = null;
    //     rootScope.loggedIn = false;
    //     // console.log('Logged out, useris ', user.user);
    //     // this.updateMenu();
    // });

    // rootScope.$on('seeFullIncident', (event, incident)=>{
    //     console.log('incident is ', incident);
    //     incident.fullView = true;
    //     this.incidentQuery = {
    //         category:   {name: 'Case Number',value: 'caseNum'},
    //         target: incident.caseNum,
    //         number: null
    //     };
    //     rootScope.activeIncidents = [];
    //     rootScope.activeIncidents.push(incident);
    //     // rootScope.$broadcast('fullIncident', incident);
    //     timeout(function(){
    //         $state.go('incidents');},500);
    // });
    // // rootScope.$on('updateActiveIncidents', (event)=>{
    // //     console.log('updatingActiveIncidents', this.incidents);
    // // });

    // rootScope.$on('updateLocation', (event, location)=>{
    //     // console.log('update location called.  location is ', location);
    //     this.findIncidentData(location);
    // });

    // rootScope.$on('editIncident', (event, incident)=>{
    //     console.log('incident ', incident);
    //     rootScope.incident = incident;
    //     $state.go('editIncident');
    // });


    // // rootScope.$on('updateUser', (event, user)=>{
    // //     // no code here yet
    // // });


    // //filter stuff here
    // this.newFilter = false;
    // this.activeFilter = null;
    // this.newQuery = {
    //     category: null,
    //     target: null,
    //     number: null
    // };
    // this.queries = [];
    // this.queryNumber=-1; 
    // this.filters = [
    //     {name: 'year',value: 'year'},
    //     {name: 'county',value: 'county'},
    //     {name: 'place',value: 'place'},
    //     {name: 'open or secret',value: 'open'},
    //     {name: 'lethality',value: 'lethality'},
    //     {name: 'crime',value: 'accusation', collection: 'accused', subCollection: 'accusations'},
    //     {name: 'punishment',value: 'punishment', collection: 'accused', subCollection: 'punishments'},
    //     {name: 'race of accused',value: 'race', collection: 'accused'},
    //     {name: 'nationality of accused',value: 'nationality', collection: 'accused'}
    // ];
    // this.classes = ['btn btn-primary', 'btn btn-secondary', 'btn btn-warning', 'btn btn-danger'];
    // this.buttonClass = 'btn btn-outline-primary';

    // this.removeFilter = (filter)=>{
    //     console.log('removing this filter ', filter);

    //     this.filters.push(filter.category);

    //     let index = this.queries.findIndex((query)=>{
    //         console.log('query name is ' + query.category.name + ' and filter name is ' + filter.category.name);
    //         return query.category.name === filter.category.name;
    //     });

    //     this.queries.splice(index,1);

    // };

    // //loads all completeIncidents
    // this.getCompleteIncidents = rootScope.getCompleteIncidents= ()=>{
    //     this.loading = true;
    //     lynchSvc.getCompleteIncidents()
    //     .then((completeIncidents)=>{
    //         //get all incidents
    //         console.log('complete incidents are ', completeIncidents);
    //         this.loading = false;
    //     });
    // };

    // //loads all incidens and incident data
    // this.loadIncidents = ()=>{
    //     console.log('1 getting all incidents');
    //     this.loading = true;
    //     lynchSvc.get()
    //         .then((incidents)=>{
    //             //get all incidents
    //             this.incidents = incidents;
    //             this.sortResults(incidents);
    //         });
       
    // };

    // //sorts all incidents by date
    // this.sortResults = (incidents)=>{
    //     console.log('2 sorting incidents by date');
    //     let incidentNumber = incidents.length;
    //     this.sorted = incidents.sort((a,b)=>{
    //         let newA = (a.year*365);
    //         let newB = (b.year*365);
    //         if (a.month){
    //             newA+=(a.month*30);
    //         }
    //         if (a.day){
    //             newA += a.day;
    //         }
    //         if (b.month){
    //             newB+=(b.month*30);
    //         }
    //         if (b.day){
    //             newB += b.day;
    //         }
    //         return newA-newB;
    //     });
    //     console.log('#SORTED: calling update incidents with these incidents', this.sorted);
    //     this.updateIncidents(this.sorted);
    // };

    // //add all incident data and broadcast incidents downstream
    // this.updateIncidents = (incidents)=>{
    //     console.log('3 finding data for the sorted incidents');
    //     console.log('updating rootscope active incidents', incidents);
    //     for (let i = 0; i < incidents.length; i++){
    //         this.findIncidentData(incidents[i]);
    //     }
    //     rootScope.incidents = incidents;
    //     timeout(function(){
    //         console.log('5 incidents have been updated');
    //         rootScope.$broadcast('incidentsUpdated', incidents);},100);
    //     this.loading = false;
    // };

    // rootScope.searchIncidents = this.searchIncidents = ()=>{
    //     this.loading = true;
    //     if (!this.incidents){
    //         this.loadIncidents();
    //     }
    //     console.log('this.incidents ', this.incidents);
    //     console.log('this.queries ', this.queries);
    //     //  if (this.newFilter = true){
    //     //      console.log('newFilter is true')
    //     //      this.filteredIncidents = [];
    //     //  }

    //    //add new query to others if present
    //     if(this.newQuery.target){
    //         //if there is a new query add it
    //         console.log('new query is ', this.newQuery);
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
    //     //apply queries to all incidents
    //     this.filtered = this.incidents;
    //     // if(this.queries.length>0){
    //     //     console.log(this.queries[0].category.value);
    //     //     console.log(this.incidents[0]);
    //     //     console.log(this.incidents[0][this.queries[0].category.value] + '===' + this.queries[0].target);
    //     //     this.filtered = this.incidents.filter((incident)=>{
    //     //         return incident[this.queries[0].category.value] === this.queries[0].target;
    //     //     });
    //     // }
    //     // if(this.queries.length>1){
    //     console.log('filtered is ', this.filtered);
    //     for (let i = 0; i < this.queries.length; i++){
    //         if (this.queries[i].category.collection){
    //             console.log('collection');
    //             if(this.queries[i].category.subCollection){
    //                 //if looking for a something in accuse.punishments or accused.crimes
    //                 console.log('subcollection is ', this.queries[0].category.subCollection);
    //                 this.filtered = this.filtered.filter((incident)=>{
    //                     //look at each accused
    //                     for(let j = 0; j < incident.accused.length; j++){
    //                         //look at each accusation or crime
    //                         console.log(incident.accused[j][this.queries[i].category.subCollection]);
    //                         for(let k = 0; k < incident.accused[j][this.queries[i].category.subCollection].length; k++){
    //                             // console.log('##', incident.accused[j][this.queries[i].category.subCollection][k][this.queries[i].category.value]);
    //                             return incident.accused[j][this.queries[i].category.subCollection][k][this.queries[i].category.value] === this.queries[i].target;
    //                         }
    //                     }
    //                 });
    //             }
    //             else{
    //                 //if looking for something in accused
    //                 console.log('collection is ', this.queries[0].category.collection);
                    
    //                 this.filtered = this.filtered.filter((incident)=>{
    //                     // if(incident.accused){
    //                     for(let j = 0; j < incident.accused.length; j++){
    //                         // console.log(incident.accused[j][this.queries[i].category.value]); 
    //                         return incident.accused[j][this.queries[i].category.value] === this.queries[i].target;
    //                     }
    //                     //}
    //                 });
    //             }
    //         }
    //         else{
    //             //if looking for something on the incident
    //             console.log('in else, this.filtered is ', this.filtered);
    //             this.filtered = this.filtered.filter((incident)=>{
    //                 return incident[this.queries[i].category.value] === this.queries[i].target;
    //             });
    //         }
    //         // this.incidents = filtered;
    //     }
    // // }
    // //send results
    //     let searchResults = this.filtered;
    //     console.log('search results are');
    //     this.loading = false;
    //     timeout(function(){
    //         rootScope.$broadcast('incidentsUpdated', searchResults);
    //     },500);
    // };

    //     //if a filter needs to be added
    //     // this.incidents = [];
    //     // console.log(2);
    //     // this.newFilter=true;
    //     // //if query cant be found by incident
    //     // if (this.newQuery.category.accused){
    //     //     console.log('ACCUSED');
    //     //     queryString = '?' +  this.queries[0].category.value + '=' + this.queries[0].target;
    //     //     lynchSvc.getIncidentByAccused(this.queries[0].category.collection, queryString)
    //     //         .then((results)=>{
    //     //             console.log('these results came back ', results);

    //     //         });
    //     //     queryString = '';
    //     // }
    //     // //the the query can only be incident
    //     // else{
    //     //     console.log('INCIDENT');  
    //     //     if (this.newQuery.category !== null && this.newQuery.target !== null){
    //     //         this.queryNumber ++;
    //     //         if (this.queryNumber > 3){
    //     //             this.queryNumber = 0;
    //     //         }

    //     //         this.newQuery.number = this.queryNumber;

    //     //         this.queries.push(this.newQuery);

 
    //     //     }
    //     //     console.log('searching incidents with these queries ', this.queries);
    //     //     let queryString = '';
    //     //     if (this.queries.length > 0){  
    //     //         queryString += '?' + this.queries[0].category.value + '=' + this.queries[0].target;           
    //     //         }
    //     //         for (let i=1; i < this.queries.length; i++){
    //     //             queryString += '&' + this.queries[i].category.value + '=' + this.queries[i].target; 
    //     //         }
    //     //     }
    //     //     console.log(queryString);
    //     //     lynchSvc.getByQuery(queryString)
    //     //         .then((incidents)=>{
    //     //             incidents.forEach((incident)=>{
    //     //                 this.incidents.push(incident);
    //     //             });
    //     //             this.sortResults(this.incidents);
    //     //         });
    

    // this.collections = [
    //     'accused', 'books', 'manuscripts', 'oldNotes', 'newspapers', 'websites'
    // ]; 

    // this.accusedInfo = ['accusations', 'names', 'punishments'];

    // this.findIncidentData = (incident)=>{
    //     console.log('4 finding all the data for this incident');
    //     // console.log('finding data for this caseNum: ', incident.caseNum);
    //     //the code still needs to be added here to look up additional case info
    //     for (let i=0; i < this.collections.length; i++){
    //         lynchSvc.getAllData(incident, this.collections[i])
    //             .then((moreData)=>{
    //                 // console.log(moreData);
    //                 incident[this.collections[i]] = moreData;
    //                 // console.log('incident is ', incident);
               
                 
    //                 if (this.collections[i] === 'accused'){
    //                     // console.log('incident.accused is ', incident.accused);
    //                     for (let j=0; j < incident.accused.length; j++){
    //                         for (let k=0; k<this.accusedInfo.length; k++){
    //                             lynchSvc.getAccusedData(incident, incident.accused[i], this.accusedInfo[k])
    //                                 .then((accusedData)=>{
    //                                     // console.log(accusedData);
    //                                     incident.accused[j][this.accusedInfo[k]] = accusedData;
    //                                 });
    //                         }
    //                     }
    //                 }
    //             });
    //     }
    //     timeout(function(){
    //         //this code creates a string of all of the names for an accused person
    //         // console.log('right before loops.  incident.accused is ', incident.accused);
    //         // console.log('incident.accused.length is ', incident.accused.length);
    //         if (incident.accused){
    //             for (let l= 0; l < incident.accused.length; l++){
    //                 incident.accused[l].namesString = '';
    //                 // console.log('this accused names are ', incident.accused[l].names);
    //                 if(incident.accused[l].names){
    //                     if(incident.accused[l].names.length>1){
    //                         for (let m =0; m < incident.accused[l].names.length; m++){
    //                             let newFullName = '';
    //                             if (incident.accused[l].names[m].first){
    //                                 newFullName += incident.accused[l].names[m].first;  
    //                             }
    //                             if (incident.accused[l].names[m].middle){
    //                                 newFullName += ' ' + incident.accused[l].names[m].middle;  
    //                             }
    //                             if (incident.accused[l].names[m].last){
    //                                 newFullName += ' ' + incident.accused[l].names[m].last;  
    //                             }

    //                             if (incident.accused[l].names.length-1 === m){
    //                                 incident.accused[l].namesString += newFullName;
    //                             }
    //                         }
    //                     }    
    //                     else{
    //                         incident.accused[l].namesString += newFullName + ', ';
    //                     }
    //                 }
    //             }
    //         }
    //         //this code adds author strings for the books
    //         if (incident.books){
    //             incident.books.forEach((book)=>{
    //                 let bookPeople = ['au', 'editor'];
    //                 for (let n = 0; n < bookPeople.length; n++){
    //                     let str = bookPeople[n] + 'String';
    //                     book[str] = '';
    //                     if (book[bookPeople[n] + 'Fn']){
    //                         book[str] += book.auFn + ' ';
    //                     } 
    //                     if(book[bookPeople[n] + 'Mn']){
    //                         book[str] += book.auMn + ' ';
    //                     }
    //                     if(book[bookPeople[n] + 'Ln']){
    //                         book[str] += book.auLn;
    //                     }
    //                     if (book[bookPeople[n] + 'suffix']){
    //                         book[str] += ' ' + book.auSuffix + ' ';
    //                     } 
    //                 }
    //             });
    //         }
    //         rootScope.$broadcast('locationUpdated', incident);
    //     },500);
    // };

    
};