import template from './incidents.html';

export default {
    template,
    controller
};

controller.$inject = ['lynchService', '$timeout', '$rootScope', 'googleMapsUrl'];

function controller(lynchSvc, timeout, rootScope, googleMapsUrl) {

    console.log('root scoped query is ', rootScope.query);
    this.user = rootScope.user;
    
    this.mapURL = googleMapsUrl;

    this.minResult = 0;
    this.maxResult = 10;

    this.nuke = false; 

    this.incidents = rootScope.incidents;
    this.activeIncidents = rootScope.ActiveIncidents;
    this.queries = rootScope.queries;
   
    this.counties = rootScope.counties;
    this.months = rootScope.months;
    
    rootScope.$on('incidentsUpdated', (event, incidents)=>{
        console.log('incident update broadcast recieved', incidents);
        this.incidents = incidents;
        this.incidentNumber = this.incidents.length;
        this.minResult = 1;
        this.maxResult = this.incidents.length;
        if ((this.incidents.length)>9){
            this.maxResult = 10;
        }
        this.updateActiveIncidents();
    });
   
    this.updateActiveIncidents = ()=>{
        this.activeIncidents = [];
        for (let i = this.minResult-1; i < this.maxResult; i ++){
            this.activeIncidents.push(this.incidents[i]);
        }
    };

    this.showIncident= (incident)=>{
        incident.fullView = true;
    };

    this.hideIncident= (incident)=>{
        incident.fullView = false;
    };

    this.editIncident=(incident)=>{
        rootScope.$emit('editIncident', incident);
    };

    this.deleteIncident = (incident)=>{
        console.log('deleting this incident ', incident);
        lynchSvc.deleteIncident(incident)
            .then((incident)=>{
                console.log(incident + 'was deleted');
                this.searchIncidents();
            });
    };

    this.proposeDeletion = (incident)=>{
        console.log('suggesting this incident be deleted: ', incident);
    };

    this.nextResults = ()=>{
        this.minResult += 10;
        this.maxResult += 10;
        if (this.maxResult > this.incidents.length){
            this.maxResult = this.incidents.length;
        }
        this.updateActiveIncidents();
    };

    this.previousResults = ()=>{
        if (this.maxResult % 10 !== 0){
            this.maxResult -=(this.maxResult % 10);
        }
        else{
            this.maxResult -= 10;
        }
        this.minResult -= 10;
        this.updateActiveIncidents();
    };

    // this.searchIncidents = ()=>{
    //     console.log('searching incidents with these queries ', this.queries);
    //     let queryString = '';
    //     if (this.queries.length > 0){
    //         queryString += '?' + this.queries[0].category.value + '=' + this.queries[0].target;
    //         for (let i=1; i < this.queries.length; i++){
    //             queryString += '&' + this.queries[i].category.value + '=' + this.queries[i].target; 
    //         }
    //     }
    //     console.log(queryString);
    //     lynchSvc.getByQuery(queryString)
    //         .then((incidents)=>{
    //             this.incidents=incidents;
    //             console.log(this.incidents);
    //             this.incidentNumber = this.incidents.length;
    //             this.incidents.sort((a,b)=>{
    //                 return a.year > b.year;
    //             });
    //             this.minResult = 1;
    //             this.maxResult = this.incidents.length;
    //             if ((this.incidents.length)>9){
    //                 this.maxResult = 10;
    //             }
    //             this.updateActiveIncidents();
    //         });
    // };



  



    //this is the nuclear option to totally wipe the database of incident entries
    //BE CAREFUL!
    this.deleteIncidents= ()=>{
        console.log('nuking these incidents: ', this.incidents);
        for (let i=0; i < this.incidents.length; i++){
            lynchSvc.deleteIncident(this.incidents[i])
            .then((incident)=>{
                console.log(incident + 'was deleted');
            });
        }
    };



    // this code populates the DB
    this.populateDatabase=()=>{
        console.log(this.oldJSON);    
        this.oldJSON.forEach((entry)=>{
            if(entry.yearMonthDay !== null){
                let splitDate = entry.yearMonthDay.split('/');
                console.log('split date is ', splitDate);
                entry.month = parseInt(splitDate[1]);
                entry.day = parseInt(splitDate[2]);
               
                if (entry.month === 0){
                    entry.month = null;
                    entry.day = null;
                    entry.dateString = entry.year;
                }

                else if (entry.day === 0){
                    entry.day = null;
                    entry.dateString = this.months[entry.month] + ' ' + entry.year;
                }

                else{
                    let suffix = 'th';
                    if (entry.day === 1){
                        suffix = 'st';
                    }
                    else if (entry.day === 2){
                        suffix = 'nd';
                    }
                    else if (entry.day === 3){
                        suffix = 'rd';
                    }
                    entry.dateString = this.months[entry.month] + ' ' + entry.day + suffix + ', ' + entry.year;
                }
            }
            else if(entry.yearMonth !== null){
                let splitDate = entry.yearMonthDay.split('/');
                console.log('split date is ', splitDate);
                entry.month = parseInt(splitDate[1]);
                entry.dateString = this.months[entry.month] + ' ' + entry.year;
            }
            else{
                entry.dateString = entry.year;
            }
            lynchSvc.addIncident(entry)
                .then((incident)=>{
                    console.log('posted ', incident);
                });
            console.log(entry);
        });
    };


    //on load
    this.loadIncidents = ()=>{
        if (rootScope.query){
            console.log('query found: ', rootScope.query);
            this.newQuery = 
            {
                category: {name: 'place', value: 'place'},
                target: rootScope.query,
                number: null
            };
            this.addFilter();
        }
        else{
            console.log('no rootscope query found');
        }
        rootScope.map = false;
        rootScope.searchIncidents();
    };   

    this.loadIncidents();
};