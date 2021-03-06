import template from './incidents.html';


export default {
    template,
    controller
};

controller.$inject = ['lynchService', '$timeout', '$rootScope', 'googleMapsUrl', 'NgMap', '$location', '$anchorScroll'];

function controller(lynchSvc, timeout, rootScope, googleMapsUrl, NgMap, $location, $anchorScroll) {
    // console.log('root scoped query is ', rootScope.query);
    this.loading = true;
    this.user = rootScope.user;

    this.mapURL = googleMapsUrl;

    this.minResult = 0;
    this.maxResult = 10;

    this.nuke = true; 

    this.incidents = rootScope.incidents;
    this.activeIncidents = rootScope.ActiveIncidents;
    this.queries = rootScope.queries;
   
    this.counties = rootScope.counties;
    this.months = rootScope.months;
    
    this.updateActiveIncidents = ()=>{
        this.activeIncidents = [];
        console.log('these are the incidents', this.incidents);
        for (let i=this.minResult-1; i <this.maxResult; i++){
            if(this.incidents.length>1){
                this.incidents[i].fullView = false;
            }
            else{
                this.incidents[i].fullView = true;
            }
            this.incidents[i].showSources = false;
            this.activeIncidents.push(this.incidents[i]);
        }
        console.log('these are the active incidents ', this.activeIncidents);
        rootScope.activeIncidents = this.activeIncidents;
        this.completeIncidents = this.incidents;
        this.loading = false;
        // rootScope.getCompleteIncidents();
    };

    this.showIncident= (incident)=>{
        // this.updateMap(incident);
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
                this.updateActiveIncidents();
            });
    };

    this.proposeDeletion = (incident)=>{
        console.log('suggesting this incident be deleted: ', incident);
    };

    this.nextResults = ()=>{
        this.loading = true;
        this.minResult += 10;
        this.maxResult += 10;
        if (this.maxResult > this.incidents.length){
            this.maxResult = this.incidents.length;
        }
        this.updateActiveIncidents();
    };

    this.previousResults = ()=>{
        this.loading = true;
        if (this.maxResult % 10 !== 0){
            this.maxResult -=(this.maxResult % 10);
        }
        else{
            this.maxResult -= 10;
        }
        this.minResult -= 10;
        this.updateActiveIncidents();
    };

    this.updateMap= (incident) =>{
        console.log('updating map for this incident: ', incident);
        let mapID = 'map-' + incident._id;
        NgMap.getMap({id:mapID}).then(function(map) {
            console.log(map.getCenter());
            let newMarker = new google.maps.Marker({
                title: incident.suspectNames
            });
            
            newMarker.addListener('click', function() {
                map.setZoom(10);
                map.setCenter(newMarker.getPosition());
                // alert(incidents[i].year + incidents[i].place + incidents[i].county + incidents[i].suspectNames);
            });

            var bounds = new google.maps.LatLngBounds();
            var lat = incident.latDecimal;
            var lng = incident.lonDecimal;
            var latlng = new google.maps.LatLng(lat, lng);
            newMarker.setPosition(latlng);
            // map.markers.push(newMarker);
            newMarker.setMap(map);
            bounds.extend(latlng);
            console.log('map is ', map);
            console.log('marker is', map.markers);
        });
    };



    //this is the nuclear option to totally wipe the database of incident entries
    //BE CAREFUL!
    this.deleteIncidents= ()=>{
        console.log('nuking incidents');
        for (let i=0; i < this.incidents.length; i++){
            lynchSvc.deleteIncident(this.incidents[i])
            .then((incident)=>{
                console.log(incident + 'was deleted');
            });
        }
    };

    this.populateDB = (collection)=>{
        console.log('this.incidents ', this.incidents);
        console.log('adding this collection', collection);
        this[collection].forEach((entry)=>{
            lynchSvc.addOther(collection, entry)
                .then((posted)=>{
                    console.log('posted ', posted);
                });
        });
    };

    this.deleteCollection= (collection)=>{
        console.log('deleting this collection: ', collection);
        lynchSvc.getCollection(collection)
        .then((items)=>{
            console.log('items are ', items);
            for (let i=0; i < items.length; i++){
                lynchSvc.deleteCollection(collection, items[i])
                .then((deleted)=>{
                    console.log(deleted + 'was deleted');
                });
            }
        });
    };

    this.populateDatabase=()=>{
        console.log(this.oldJSON);    
        //this code makes date strings
        this.oldJSON.forEach((entry)=>{
            if(entry.yearMonthDay !== null){
                let splitDate = entry.yearMonthDay.split('/');
                console.log('split date is ', splitDate);
                entry.month = parseInt(splitDate[1]);
                entry.day = parseInt(splitDate[2]);  
                // 
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
                    if (entry.day === 1 || entry.day === 21 || entry.day === 31){
                        suffix = 'st';
                    }
                    else if (entry.day === 2 || entry.day === 22){
                        suffix = 'nd';
                    }
                    else if (entry.day === 3 || entry.day === 33){
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
            //this code makes location strings
            entry.locationString = entry.place;
            if (entry.county){
                entry.locationString += '.  ' + entry.county + ' County';
            }
            if (entry.state){
                entry.locationString += ', ' + entry.state;
            }
            lynchSvc.addIncident(entry)
                .then((incident)=>{
                    console.log('posted ', incident);
                });
            console.log(entry);
        });
    };


    //on load
    this.loadAllIncidents = ()=>{
        if(!rootScope.activeIncidents){
            console.log('no active incidents');
            this.loading = true;
            rootScope.loadIncidents();
            rootScope.getCompleteIncidents();
        }
        else{
            this.activeIncidents = rootScope.activeIncidents;
            console.log('no need to load, dawg');
        }
            // console.log('1');
            // if (rootScope.query){
            //     console.log('query found: ', rootScope.query);
            //     this.newQuery = 
            //     {
            //         category: {name: 'place', value: 'place'},
            //         target: rootScope.query,
            //         number: null
            //     };
            //     this.addFilter();
            // }
            // else{
            //     console.log('no rootscope query found');
            // }
            // rootScope.map = false;   
    };   

    this.loadAllIncidents(); 


    this.goToTop = function(loc) {
        console.log('this gototop called', loc);
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash(loc);
        // call $anchorScroll()
        $anchorScroll();
    };

    this.toggleSources = function (incident, toggle) {
        if (toggle==='show'){
            incident.showSources = true;
        }
        else{
            incident.showSources = false;
        }
    };


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
   
    // rootScope.$on('fullIncident', (event, incident)=>{
    //     this.activeIncidents[0].fullView = true;
    //     this.goToTop(incident.caseNum);
    // });
   
    rootScope.$on('locationUpdated', (event, location)=>{
        console.log('broadcast recieved', location);
        if (this.activeIncidents){
            if(this.activeIncidents.length === 1){
                this.goToTop(this.activeIncidents[0].caseNum);
            }
        }
    });
};