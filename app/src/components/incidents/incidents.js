import template from './incidents.html';


export default {
    template,
    controller
};

controller.$inject = ['lynchService', '$timeout', '$rootScope', 'googleMapsUrl', 'NgMap'];

function controller(lynchSvc, timeout, rootScope, googleMapsUrl, NgMap) {
    console.log('root scoped query is ', rootScope.query);
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
        for (let i=this.minResult; i <=this.maxResult; i++){
            this.activeIncidents.push(this.incidents[i]);
        }
        this.loading = false;
    };



    this.showIncident= (incident)=>{
        // this.updateMap(incident);
        rootScope.$emit('updateLocation', incident);
    };

    rootScope.$on('locationUpdated', (event, location)=>{
        console.log('broadcast recieved', location);
        location.fullView = true;
    });

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
        this.loading = true;
        console.log('1');
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
    
    this.names = [
        {
          "accusedID": 1,
          "caseNum": 1,
          "fullName": "Antoine",
          "first": "Antoine",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 1,
          "caseNum": 27,
          "fullName": "Antoine",
          "first": "Antoine",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 2,
          "caseNum": 1,
          "fullName": "Montreuil ",
          "first": "Montreuil ",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 3,
          "caseNum": 1,
          "fullName": "Pepi",
          "first": "Pepi",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 3,
          "caseNum": 27,
          "fullName": "Pepi",
          "first": "Pepi",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 4,
          "caseNum": 1,
          "fullName": "Tchal",
          "first": "Tchal",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 4,
          "caseNum": 27,
          "fullName": "Tchal",
          "first": "Tchal",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 5,
          "caseNum": 2,
          "fullName": "Samuel Roberts",
          "first": "Samuel",
          "middle": "",
          "last": "Roberts"
        },
        {
          "accusedID": 6,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 7,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 8,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 9,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 10,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 11,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 12,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 13,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 14,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 15,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 16,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 17,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 18,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 19,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 20,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 21,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 22,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 23,
          "caseNum": 2,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 24,
          "caseNum": 3,
          "fullName": "Wooly Mike",
          "first": "Wooly Mike",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 25,
          "caseNum": 4,
          "fullName": "Dionisio Ocho",
          "first": "Dionisio",
          "middle": "",
          "last": "Ocho"
        },
        {
          "accusedID": 26,
          "caseNum": 4,
          "fullName": "Gabino Casias",
          "first": "Gabino",
          "middle": "",
          "last": "Casias"
        },
        {
          "accusedID": 27,
          "caseNum": 4,
          "fullName": "Pablo Martinez",
          "first": "Pablo",
          "middle": "",
          "last": "Martinez"
        },
        {
          "accusedID": 28,
          "caseNum": 4,
          "fullName": "Rinz Molina",
          "first": "Rinz",
          "middle": "",
          "last": "Molina"
        },
        {
          "accusedID": 29,
          "caseNum": 4,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 30,
          "caseNum": 5,
          "fullName": "Hewster",
          "first": "",
          "middle": "",
          "last": "Hewster"
        },
        {
          "accusedID": 31,
          "caseNum": 5,
          "fullName": "Hewster",
          "first": "",
          "middle": "",
          "last": "Hewster"
        },
        {
          "accusedID": 32,
          "caseNum": 6,
          "fullName": "Richard Crone",
          "first": "Richard",
          "middle": "",
          "last": "Crone"
        },
        {
          "accusedID": 32,
          "caseNum": 6,
          "fullName": "Richard Crone",
          "first": "Irish Dick",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 33,
          "caseNum": 7,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 34,
          "caseNum": 7,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 35,
          "caseNum": 7,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 36,
          "caseNum": 7,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 37,
          "caseNum": 7,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 38,
          "caseNum": 7,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 39,
          "caseNum": 7,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 40,
          "caseNum": 7,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 41,
          "caseNum": 8,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 42,
          "caseNum": 9,
          "fullName": "Jim",
          "first": "Jim",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 43,
          "caseNum": 10,
          "fullName": "Johnson",
          "first": "",
          "middle": "",
          "last": "Johnson"
        },
        {
          "accusedID": 44,
          "caseNum": 11,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 45,
          "caseNum": 11,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 46,
          "caseNum": 11,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 47,
          "caseNum": 12,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 48,
          "caseNum": 13,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 49,
          "caseNum": 14,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 50,
          "caseNum": 15,
          "fullName": "William Hepel Robinson",
          "first": "William",
          "middle": "Hepel",
          "last": "Robinson"
        },
        {
          "accusedID": 51,
          "caseNum": 16,
          "fullName": "Bowen",
          "first": "",
          "middle": "",
          "last": "Bowen"
        },
        {
          "accusedID": 52,
          "caseNum": 17,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 53,
          "caseNum": 18,
          "fullName": "Jessie Dinwiddie",
          "first": "Jessie",
          "middle": "",
          "last": "Dinwiddie"
        },
        {
          "accusedID": 54,
          "caseNum": 19,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 55,
          "caseNum": 19,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 56,
          "caseNum": 19,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 57,
          "caseNum": 20,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 58,
          "caseNum": 20,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 59,
          "caseNum": 20,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 60,
          "caseNum": 21,
          "fullName": "Smith",
          "first": "",
          "middle": "",
          "last": "Smith"
        },
        {
          "accusedID": 61,
          "caseNum": 22,
          "fullName": "Pacheco",
          "first": "",
          "middle": "",
          "last": "Pacheco"
        },
        {
          "accusedID": 62,
          "caseNum": 23,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 63,
          "caseNum": 25,
          "fullName": "Frederick J. Roe",
          "first": "Frederick",
          "middle": "J.",
          "last": "Roe"
        },
        {
          "accusedID": 64,
          "caseNum": 26,
          "fullName": "Charles Simmons",
          "first": "Charles",
          "middle": "",
          "last": "Simmons"
        },
        {
          "accusedID": 65,
          "caseNum": 26,
          "fullName": "James Baxter",
          "first": "James",
          "middle": "",
          "last": "Baxter"
        },
        {
          "accusedID": 66,
          "caseNum": 28,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 67,
          "caseNum": 28,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 68,
          "caseNum": 28,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 69,
          "caseNum": 28,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 70,
          "caseNum": 28,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 71,
          "caseNum": 29,
          "fullName": "Jackson",
          "first": "",
          "middle": "",
          "last": "Jackson"
        },
        {
          "accusedID": 72,
          "caseNum": 29,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 73,
          "caseNum": 30,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 74,
          "caseNum": 31,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 75,
          "caseNum": 32,
          "fullName": "S. S. Easterbrooks",
          "first": "S.",
          "middle": "S.",
          "last": "Easterbrooks"
        },
        {
          "accusedID": 76,
          "caseNum": 33,
          "fullName": "Evans",
          "first": "",
          "middle": "",
          "last": "Evans"
        },
        {
          "accusedID": 77,
          "caseNum": 34,
          "fullName": "Andrew S. Scott",
          "first": "Andrew",
          "middle": "S.",
          "last": "Scott"
        },
        {
          "accusedID": 78,
          "caseNum": 35,
          "fullName": "Cecilia Mesa",
          "first": "Cecilia",
          "middle": "",
          "last": "Mesa"
        },
        {
          "accusedID": 79,
          "caseNum": 35,
          "fullName": "Solomon Pico",
          "first": "Solomon",
          "middle": "",
          "last": "Pico"
        },
        {
          "accusedID": 80,
          "caseNum": 35,
          "fullName": "William Otis",
          "first": "William",
          "middle": "",
          "last": "Otis"
        },
        {
          "accusedID": 80,
          "caseNum": 35,
          "fullName": "William Otis",
          "first": "William",
          "middle": "",
          "last": "Hall"
        },
        {
          "accusedID": 80,
          "caseNum": 35,
          "fullName": "William Otis",
          "first": "William",
          "middle": "",
          "last": "Wood"
        },
        {
          "accusedID": 80,
          "caseNum": 35,
          "fullName": "William Otis",
          "first": "William",
          "middle": "Otis",
          "last": "Hall"
        },
        {
          "accusedID": 80,
          "caseNum": 35,
          "fullName": "William Otis",
          "first": "Bill",
          "middle": "",
          "last": "Wood"
        },
        {
          "accusedID": 80,
          "caseNum": 35,
          "fullName": "William Otis",
          "first": "Bill",
          "middle": "",
          "last": "Otis"
        },
        {
          "accusedID": 80,
          "caseNum": 81,
          "fullName": "William Otis",
          "first": "William",
          "middle": "",
          "last": "Otis"
        },
        {
          "accusedID": 80,
          "caseNum": 81,
          "fullName": "William Otis",
          "first": "William",
          "middle": "",
          "last": "Hall"
        },
        {
          "accusedID": 80,
          "caseNum": 81,
          "fullName": "William Otis",
          "first": "William",
          "middle": "",
          "last": "Wood"
        },
        {
          "accusedID": 80,
          "caseNum": 81,
          "fullName": "William Otis",
          "first": "William",
          "middle": "Otis",
          "last": "Hall"
        },
        {
          "accusedID": 80,
          "caseNum": 81,
          "fullName": "William Otis",
          "first": "Bill",
          "middle": "",
          "last": "Wood"
        },
        {
          "accusedID": 80,
          "caseNum": 81,
          "fullName": "William Otis",
          "first": "Bill",
          "middle": "",
          "last": "Otis"
        },
        {
          "accusedID": 81,
          "caseNum": 36,
          "fullName": "Jones",
          "first": "",
          "middle": "",
          "last": "Jones"
        },
        {
          "accusedID": 82,
          "caseNum": 37,
          "fullName": "George Miller",
          "first": "George",
          "middle": "",
          "last": "Miller"
        },
        {
          "accusedID": 83,
          "caseNum": 37,
          "fullName": "Henry Rigler",
          "first": "Henry",
          "middle": "",
          "last": "Rigler"
        },
        {
          "accusedID": 84,
          "caseNum": 37,
          "fullName": "John Allen",
          "first": "John",
          "middle": "",
          "last": "Allen"
        },
        {
          "accusedID": 85,
          "caseNum": 38,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 86,
          "caseNum": 39,
          "fullName": "J. Spofford",
          "first": "J.",
          "middle": "",
          "last": "Spofford"
        },
        {
          "accusedID": 87,
          "caseNum": 39,
          "fullName": "John Emory",
          "first": "John",
          "middle": "",
          "last": "Emory"
        },
        {
          "accusedID": 87,
          "caseNum": 39,
          "fullName": "John Emory",
          "first": "Sailor Tom",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 88,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 89,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 90,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 91,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 92,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 93,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 94,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 95,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 96,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 97,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 98,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 99,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 100,
          "caseNum": 39,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 101,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 102,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 103,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 104,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 105,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 106,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 107,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 108,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 109,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 110,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 111,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 112,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 113,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 114,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 115,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 116,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 117,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 118,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 119,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 120,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 121,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 122,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 123,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 124,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 125,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 126,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 127,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 128,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 129,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 130,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 131,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 132,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 133,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 134,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 135,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 136,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 137,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 138,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 139,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 140,
          "caseNum": 40,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 141,
          "caseNum": 41,
          "fullName": "Francisco Galvez",
          "first": "Francisco",
          "middle": "",
          "last": "Galvez"
        },
        {
          "accusedID": 142,
          "caseNum": 41,
          "fullName": "Jesus Moreno",
          "first": "Jesus",
          "middle": "",
          "last": "Moreno"
        },
        {
          "accusedID": 143,
          "caseNum": 41,
          "fullName": "Luis Cracia",
          "first": "Luis",
          "middle": "",
          "last": "Cracia"
        },
        {
          "accusedID": 144,
          "caseNum": 41,
          "fullName": "Ramon Dias",
          "first": "Ramon",
          "middle": "",
          "last": "Dias"
        },
        {
          "accusedID": 145,
          "caseNum": 41,
          "fullName": "Timoteo Sandoval",
          "first": "Timoteo",
          "middle": "",
          "last": "Sandoval"
        },
        {
          "accusedID": 146,
          "caseNum": 42,
          "fullName": "Hamilton McCauley",
          "first": "Hamilton",
          "middle": "",
          "last": "McCauley"
        },
        {
          "accusedID": 147,
          "caseNum": 44,
          "fullName": "Gatson",
          "first": "",
          "middle": "",
          "last": "Gatson"
        },
        {
          "accusedID": 147,
          "caseNum": 44,
          "fullName": "Gatson",
          "first": "",
          "middle": "",
          "last": "Gaston"
        },
        {
          "accusedID": 148,
          "caseNum": 45,
          "fullName": "O'Brien",
          "first": "",
          "middle": "",
          "last": "O'Brien"
        },
        {
          "accusedID": 149,
          "caseNum": 46,
          "fullName": "Alberto de la Cruz",
          "first": "Alberto",
          "middle": "",
          "last": "de la Cruz"
        },
        {
          "accusedID": 150,
          "caseNum": 46,
          "fullName": "Martia Lopez",
          "first": "Martia",
          "middle": "",
          "last": "Lopez"
        },
        {
          "accusedID": 151,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 152,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 153,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 154,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 155,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 156,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 157,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 158,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 159,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 160,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 161,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 162,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 163,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 164,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 165,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 166,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 167,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 168,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 169,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 170,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 171,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 172,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 173,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 174,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 175,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 176,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 177,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 178,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 179,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 180,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 181,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 182,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 183,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 184,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 185,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 186,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 187,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 188,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 189,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 190,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 191,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 192,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 193,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 194,
          "caseNum": 48,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 195,
          "caseNum": 49,
          "fullName": "Thomas Jenkins",
          "first": "Thomas",
          "middle": "",
          "last": "Jenkins"
        },
        {
          "accusedID": 195,
          "caseNum": 550,
          "fullName": "Thomas Jenkins",
          "first": "Thomas",
          "middle": "",
          "last": "Jenkins"
        },
        {
          "accusedID": 195,
          "caseNum": 550,
          "fullName": "Thomas Jenkins",
          "first": "Henry",
          "middle": "",
          "last": "Jenkins"
        },
        {
          "accusedID": 196,
          "caseNum": 51,
          "fullName": "William McEvoy",
          "first": "William",
          "middle": "",
          "last": "McEvoy"
        },
        {
          "accusedID": 197,
          "caseNum": 53,
          "fullName": "John Jenkins",
          "first": "John",
          "middle": "",
          "last": "Jenkins"
        },
        {
          "accusedID": 197,
          "caseNum": 53,
          "fullName": "John Jenkins",
          "first": "",
          "middle": "",
          "last": "Simpton"
        },
        {
          "accusedID": 198,
          "caseNum": 54,
          "fullName": "Antonio Cruz",
          "first": "Antonio",
          "middle": "",
          "last": "Cruz"
        },
        {
          "accusedID": 199,
          "caseNum": 54,
          "fullName": "Patricio Janori",
          "first": "Patricio",
          "middle": "",
          "last": "Janori"
        },
        {
          "accusedID": 200,
          "caseNum": 55,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 201,
          "caseNum": 55,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 202,
          "caseNum": 56,
          "fullName": "Hetherington",
          "first": "",
          "middle": "",
          "last": "Hetherington"
        },
        {
          "accusedID": 203,
          "caseNum": 57,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 204,
          "caseNum": 58,
          "fullName": "Samuel Gallagher",
          "first": "Samuel",
          "middle": "",
          "last": "Gallagher"
        },
        {
          "accusedID": 205,
          "caseNum": 59,
          "fullName": "Juan",
          "first": "Juan",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 206,
          "caseNum": 60,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 207,
          "caseNum": 60,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 208,
          "caseNum": 61,
          "fullName": "Pitcher",
          "first": "",
          "middle": "",
          "last": "Pitcher"
        },
        {
          "accusedID": 209,
          "caseNum": 62,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 210,
          "caseNum": 63,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 211,
          "caseNum": 64,
          "fullName": "David Hill",
          "first": "David",
          "middle": "",
          "last": "Hill"
        },
        {
          "accusedID": 211,
          "caseNum": 64,
          "fullName": "David Hill",
          "first": "Charles",
          "middle": "",
          "last": "May"
        },
        {
          "accusedID": 211,
          "caseNum": 64,
          "fullName": "David Hill",
          "first": "Jim",
          "middle": "",
          "last": "Hill"
        },
        {
          "accusedID": 212,
          "caseNum": 65,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 213,
          "caseNum": 65,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 214,
          "caseNum": 65,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 215,
          "caseNum": 65,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 216,
          "caseNum": 66,
          "fullName": "John Nelson",
          "first": "John",
          "middle": "",
          "last": "Nelson"
        },
        {
          "accusedID": 217,
          "caseNum": 67,
          "fullName": "Josefa Loaiza",
          "first": "Josefa",
          "middle": "",
          "last": "Loaiza"
        },
        {
          "accusedID": 218,
          "caseNum": 68,
          "fullName": "James Gibson",
          "first": "James",
          "middle": "",
          "last": "Gibson"
        },
        {
          "accusedID": 219,
          "caseNum": 68,
          "fullName": "John Thompson",
          "first": "John",
          "middle": "",
          "last": "Thompson"
        },
        {
          "accusedID": 220,
          "caseNum": 68,
          "fullName": "Owen Cruthers",
          "first": "Owen",
          "middle": "",
          "last": "Cruthers"
        },
        {
          "accusedID": 221,
          "caseNum": 68,
          "fullName": "William Benjamin Robinson",
          "first": "William",
          "middle": "Benjamin",
          "last": "Robinson"
        },
        {
          "accusedID": 222,
          "caseNum": 69,
          "fullName": "James Stuart",
          "first": "James",
          "middle": "",
          "last": "Stuart"
        },
        {
          "accusedID": 222,
          "caseNum": 69,
          "fullName": "James Stuart",
          "first": "William",
          "middle": "",
          "last": "Stephens"
        },
        {
          "accusedID": 222,
          "caseNum": 69,
          "fullName": "James Stuart",
          "first": "William",
          "middle": "",
          "last": "Stevens"
        },
        {
          "accusedID": 223,
          "caseNum": 70,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 224,
          "caseNum": 71,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 225,
          "caseNum": 71,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 226,
          "caseNum": 73,
          "fullName": "Hill",
          "first": "",
          "middle": "",
          "last": "Hill"
        },
        {
          "accusedID": 227,
          "caseNum": 75,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 228,
          "caseNum": 76,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 229,
          "caseNum": 78,
          "fullName": "Haynes",
          "first": "",
          "middle": "",
          "last": "Haynes"
        },
        {
          "accusedID": 230,
          "caseNum": 79,
          "fullName": "George Adams",
          "first": "George",
          "middle": "",
          "last": "Adams"
        },
        {
          "accusedID": 231,
          "caseNum": 80,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 232,
          "caseNum": 80,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 233,
          "caseNum": 82,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 234,
          "caseNum": 82,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 235,
          "caseNum": 82,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 236,
          "caseNum": 83,
          "fullName": "John Thornpen",
          "first": "John",
          "middle": "",
          "last": "Thornpen"
        },
        {
          "accusedID": 237,
          "caseNum": 84,
          "fullName": "James Graham",
          "first": "James",
          "middle": "",
          "last": "Graham"
        },
        {
          "accusedID": 238,
          "caseNum": 85,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 239,
          "caseNum": 85,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 240,
          "caseNum": 86,
          "fullName": "Hugh Morgan",
          "first": "Hugh",
          "middle": "",
          "last": "Morgan"
        },
        {
          "accusedID": 241,
          "caseNum": 87,
          "fullName": "William Heppard",
          "first": "William",
          "middle": "",
          "last": "Heppard"
        },
        {
          "accusedID": 241,
          "caseNum": 87,
          "fullName": "William Heppard",
          "first": "",
          "middle": "",
          "last": "Robinson"
        },
        {
          "accusedID": 242,
          "caseNum": 88,
          "fullName": "Frank Reynolds",
          "first": "Frank",
          "middle": "",
          "last": "Reynolds"
        },
        {
          "accusedID": 243,
          "caseNum": 89,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 244,
          "caseNum": 89,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 245,
          "caseNum": 89,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 246,
          "caseNum": 89,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 247,
          "caseNum": 90,
          "fullName": "Robert McKenzie",
          "first": "Robert",
          "middle": "",
          "last": "McKenzie"
        },
        {
          "accusedID": 247,
          "caseNum": 90,
          "fullName": "Robert McKenzie",
          "first": "Robert",
          "middle": "",
          "last": "McKinney"
        },
        {
          "accusedID": 248,
          "caseNum": 90,
          "fullName": "Samuel Whittaker",
          "first": "Samuel",
          "middle": "",
          "last": "Whittaker"
        },
        {
          "accusedID": 249,
          "caseNum": 91,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 250,
          "caseNum": 92,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 251,
          "caseNum": 93,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 252,
          "caseNum": 94,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 253,
          "caseNum": 95,
          "fullName": "Mercer",
          "first": "",
          "middle": "",
          "last": "Mercer"
        },
        {
          "accusedID": 254,
          "caseNum": 96,
          "fullName": "Aaron Bradbury",
          "first": "Aaron",
          "middle": "",
          "last": "Bradbury"
        },
        {
          "accusedID": 255,
          "caseNum": 97,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 256,
          "caseNum": 98,
          "fullName": "John Donahue",
          "first": "John",
          "middle": "",
          "last": "Donahue"
        },
        {
          "accusedID": 256,
          "caseNum": 98,
          "fullName": "John Donahue",
          "first": "John",
          "middle": "",
          "last": "Donahoe"
        },
        {
          "accusedID": 257,
          "caseNum": 99,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 258,
          "caseNum": 100,
          "fullName": "Paddy Welsh",
          "first": "Paddy",
          "middle": "",
          "last": "Welsh"
        },
        {
          "accusedID": 259,
          "caseNum": 101,
          "fullName": "Griffin",
          "first": "",
          "middle": "",
          "last": "Griffin"
        },
        {
          "accusedID": 260,
          "caseNum": 102,
          "fullName": "Little John",
          "first": "Little John",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 261,
          "caseNum": 103,
          "fullName": "W. E. Conkling",
          "first": "W.",
          "middle": "E.",
          "last": "Conkling"
        },
        {
          "accusedID": 262,
          "caseNum": 104,
          "fullName": "Seymour",
          "first": "Seymour",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 263,
          "caseNum": 106,
          "fullName": "W. G. Hance",
          "first": "W.",
          "middle": "G.",
          "last": "Hance"
        },
        {
          "accusedID": 264,
          "caseNum": 107,
          "fullName": "Toby",
          "first": "Toby",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 265,
          "caseNum": 108,
          "fullName": "Abner J. Dixon",
          "first": "Abner",
          "middle": "J.",
          "last": "Dixon"
        },
        {
          "accusedID": 266,
          "caseNum": 109,
          "fullName": "Antonio Gonzales",
          "first": "Antonio",
          "middle": "",
          "last": "Gonzales"
        },
        {
          "accusedID": 267,
          "caseNum": 110,
          "fullName": "Domingo",
          "first": "Domingo",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 268,
          "caseNum": 112,
          "fullName": "David Brown",
          "first": "David",
          "middle": "",
          "last": "Brown"
        },
        {
          "accusedID": 268,
          "caseNum": 112,
          "fullName": "David Brown",
          "first": "William",
          "middle": "",
          "last": "Brown"
        },
        {
          "accusedID": 269,
          "caseNum": 113,
          "fullName": "James Campbell",
          "first": "James",
          "middle": "",
          "last": "Campbell"
        },
        {
          "accusedID": 270,
          "caseNum": 114,
          "fullName": "Silvermann",
          "first": "",
          "middle": "",
          "last": "Silvermann"
        },
        {
          "accusedID": 271,
          "caseNum": 115,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 272,
          "caseNum": 116,
          "fullName": "Charley Bucroft",
          "first": "Charley",
          "middle": "",
          "last": "Bucroft"
        },
        {
          "accusedID": 273,
          "caseNum": 116,
          "fullName": "John Bucroft",
          "first": "John",
          "middle": "",
          "last": "Bucroft"
        },
        {
          "accusedID": 274,
          "caseNum": 117,
          "fullName": "Brown",
          "first": "",
          "middle": "",
          "last": "Brown"
        },
        {
          "accusedID": 275,
          "caseNum": 118,
          "fullName": "George Tanner",
          "first": "George",
          "middle": "",
          "last": "Tanner"
        },
        {
          "accusedID": 276,
          "caseNum": 119,
          "fullName": "Carlos Esclava",
          "first": "Carlos",
          "middle": "",
          "last": "Esclava"
        },
        {
          "accusedID": 277,
          "caseNum": 120,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 278,
          "caseNum": 121,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 279,
          "caseNum": 122,
          "fullName": "Henry George",
          "first": "Henry",
          "middle": "",
          "last": "George"
        },
        {
          "accusedID": 280,
          "caseNum": 122,
          "fullName": "William Miller",
          "first": "William",
          "middle": "",
          "last": "Miller"
        },
        {
          "accusedID": 281,
          "caseNum": 123,
          "fullName": "Mills",
          "first": "",
          "middle": "",
          "last": "Mills"
        },
        {
          "accusedID": 282,
          "caseNum": 124,
          "fullName": "James Hughlett",
          "first": "James",
          "middle": "",
          "last": "Hughlett"
        },
        {
          "accusedID": 282,
          "caseNum": 124,
          "fullName": "James Hughlett",
          "first": "James",
          "middle": "",
          "last": "Hewlett"
        },
        {
          "accusedID": 283,
          "caseNum": 125,
          "fullName": "John Balthus",
          "first": "John",
          "middle": "",
          "last": "Balthus"
        },
        {
          "accusedID": 284,
          "caseNum": 126,
          "fullName": "Hensley",
          "first": "",
          "middle": "",
          "last": "Hensley"
        },
        {
          "accusedID": 285,
          "caseNum": 127,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 286,
          "caseNum": 127,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 287,
          "caseNum": 127,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 288,
          "caseNum": 127,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 289,
          "caseNum": 128,
          "fullName": "Washington Rideout",
          "first": "Washington",
          "middle": "",
          "last": "Rideout"
        },
        {
          "accusedID": 289,
          "caseNum": 128,
          "fullName": "Washington Rideout",
          "first": "Page",
          "middle": "",
          "last": "Rideout"
        },
        {
          "accusedID": 290,
          "caseNum": 129,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 291,
          "caseNum": 129,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 292,
          "caseNum": 130,
          "fullName": "John Jackson",
          "first": "John",
          "middle": "",
          "last": "Jackson"
        },
        {
          "accusedID": 293,
          "caseNum": 131,
          "fullName": "Jose Cheverino",
          "first": "Jose",
          "middle": "",
          "last": "Cheverino"
        },
        {
          "accusedID": 294,
          "caseNum": 132,
          "fullName": "Cruz Flores",
          "first": "Cruz",
          "middle": "",
          "last": "Flores"
        },
        {
          "accusedID": 295,
          "caseNum": 132,
          "fullName": "Mariano",
          "first": "Mariano",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 296,
          "caseNum": 134,
          "fullName": "William",
          "first": "",
          "middle": "",
          "last": "William"
        },
        {
          "accusedID": 297,
          "caseNum": 136,
          "fullName": "Dunn",
          "first": "",
          "middle": "",
          "last": "Dunn"
        },
        {
          "accusedID": 298,
          "caseNum": 138,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 299,
          "caseNum": 138,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 300,
          "caseNum": 138,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 301,
          "caseNum": 138,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 302,
          "caseNum": 138,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 303,
          "caseNum": 139,
          "fullName": "Raymond",
          "first": "Raymond",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 303,
          "caseNum": 139,
          "fullName": "Raymond",
          "first": "Roger",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 304,
          "caseNum": 140,
          "fullName": "Kit Shannon",
          "first": "Kit",
          "middle": "",
          "last": "Shannon"
        },
        {
          "accusedID": 305,
          "caseNum": 141,
          "fullName": "Francis Boyd",
          "first": "Francis",
          "middle": "",
          "last": "Boyd"
        },
        {
          "accusedID": 306,
          "caseNum": 142,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 307,
          "caseNum": 143,
          "fullName": "Pablo Panso",
          "first": "Pablo",
          "middle": "",
          "last": "Panso"
        },
        {
          "accusedID": 307,
          "caseNum": 143,
          "fullName": "Pablo Panso",
          "first": "Pablo",
          "middle": "",
          "last": "Pansa"
        },
        {
          "accusedID": 308,
          "caseNum": 144,
          "fullName": "Joshua Robinson",
          "first": "Joshua",
          "middle": "",
          "last": "Robinson"
        },
        {
          "accusedID": 309,
          "caseNum": 145,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 310,
          "caseNum": 145,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 311,
          "caseNum": 146,
          "fullName": "Dominguez Hernandez",
          "first": "Dominguez",
          "middle": "",
          "last": "Hernandez"
        },
        {
          "accusedID": 311,
          "caseNum": 146,
          "fullName": "Dominguez Hernandez",
          "first": "Mariano",
          "middle": "",
          "last": "Dominguez"
        },
        {
          "accusedID": 312,
          "caseNum": 147,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 313,
          "caseNum": 148,
          "fullName": "Doroteo Zavaleta",
          "first": "Doroteo",
          "middle": "",
          "last": "Zavaleta"
        },
        {
          "accusedID": 313,
          "caseNum": 148,
          "fullName": "Doroteo Zavaleta",
          "first": "Dolores",
          "middle": "",
          "last": "Savaleta"
        },
        {
          "accusedID": 313,
          "caseNum": 148,
          "fullName": "Doroteo Zavaleta",
          "first": "Doroteo",
          "middle": "",
          "last": "Zabaleta"
        },
        {
          "accusedID": 314,
          "caseNum": 148,
          "fullName": "Jesus Rivas",
          "first": "Jesus",
          "middle": "",
          "last": "Rivas"
        },
        {
          "accusedID": 315,
          "caseNum": 149,
          "fullName": "Capistrano",
          "first": "Capistrano",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 316,
          "caseNum": 150,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 317,
          "caseNum": 150,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 318,
          "caseNum": 150,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 319,
          "caseNum": 150,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 320,
          "caseNum": 150,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 321,
          "caseNum": 150,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 322,
          "caseNum": 151,
          "fullName": "Johnson",
          "first": "",
          "middle": "",
          "last": "Johnson"
        },
        {
          "accusedID": 323,
          "caseNum": 152,
          "fullName": "Ross",
          "first": "",
          "middle": "",
          "last": "Ross"
        },
        {
          "accusedID": 324,
          "caseNum": 153,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 325,
          "caseNum": 154,
          "fullName": "Antonio Duarto",
          "first": "Antonio",
          "middle": "",
          "last": "Duarto"
        },
        {
          "accusedID": 326,
          "caseNum": 154,
          "fullName": "Jesus Brisano",
          "first": "Jesus",
          "middle": "",
          "last": "Brisano"
        },
        {
          "accusedID": 327,
          "caseNum": 155,
          "fullName": "Dolores Pico",
          "first": "Dolores",
          "middle": "",
          "last": "Pico"
        },
        {
          "accusedID": 328,
          "caseNum": 156,
          "fullName": "Michael Grant",
          "first": "Michael",
          "middle": "",
          "last": "Grant"
        },
        {
          "accusedID": 329,
          "caseNum": 157,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 330,
          "caseNum": 158,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 331,
          "caseNum": 159,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 332,
          "caseNum": 160,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 333,
          "caseNum": 161,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 334,
          "caseNum": 162,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 335,
          "caseNum": 163,
          "fullName": "Walden",
          "first": "",
          "middle": "",
          "last": "Walden"
        },
        {
          "accusedID": 336,
          "caseNum": 164,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 337,
          "caseNum": 165,
          "fullName": "Reyes Feliz",
          "first": "Reyes",
          "middle": "",
          "last": "Feliz"
        },
        {
          "accusedID": 338,
          "caseNum": 166,
          "fullName": "Barumas",
          "first": "",
          "middle": "",
          "last": "Barumas"
        },
        {
          "accusedID": 339,
          "caseNum": 166,
          "fullName": "Benito Lopez",
          "first": "Benito",
          "middle": "",
          "last": "Lopez"
        },
        {
          "accusedID": 340,
          "caseNum": 166,
          "fullName": "Cipriano Sandoval",
          "first": "Cipriano",
          "middle": "",
          "last": "Sandoval"
        },
        {
          "accusedID": 341,
          "caseNum": 167,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 342,
          "caseNum": 168,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 343,
          "caseNum": 169,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 344,
          "caseNum": 170,
          "fullName": "Jose Delores Velaszques",
          "first": "Jose",
          "middle": "Delores",
          "last": "Velaszques"
        },
        {
          "accusedID": 345,
          "caseNum": 171,
          "fullName": "William K. Jones",
          "first": "William",
          "middle": "K.",
          "last": "Jones"
        },
        {
          "accusedID": 346,
          "caseNum": 172,
          "fullName": "James Edmonson",
          "first": "James",
          "middle": "",
          "last": "Edmonson"
        },
        {
          "accusedID": 346,
          "caseNum": 172,
          "fullName": "James Edmonson",
          "first": "Jim Ugly",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 347,
          "caseNum": 173,
          "fullName": "Christopher Ferril",
          "first": "Christopher",
          "middle": "",
          "last": "Ferril"
        },
        {
          "accusedID": 348,
          "caseNum": 174,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 349,
          "caseNum": 174,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 350,
          "caseNum": 175,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 351,
          "caseNum": 176,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 352,
          "caseNum": 177,
          "fullName": "Antonio Valencia",
          "first": "Antonio",
          "middle": "",
          "last": "Valencia"
        },
        {
          "accusedID": 353,
          "caseNum": 178,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 354,
          "caseNum": 178,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 355,
          "caseNum": 178,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 356,
          "caseNum": 178,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 357,
          "caseNum": 178,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 358,
          "caseNum": 178,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 359,
          "caseNum": 179,
          "fullName": "Big Bill",
          "first": "Big Bill",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 360,
          "caseNum": 179,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 361,
          "caseNum": 180,
          "fullName": "Conrad Sacksin",
          "first": "Conrad",
          "middle": "",
          "last": "Sacksin"
        },
        {
          "accusedID": 362,
          "caseNum": 181,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 363,
          "caseNum": 182,
          "fullName": "Isaac D. Martin",
          "first": "Isaac",
          "middle": "D.",
          "last": "Martinez"
        },
        {
          "accusedID": 363,
          "caseNum": 182,
          "fullName": "Isaac D. Martin",
          "first": "",
          "middle": "",
          "last": "Smith"
        },
        {
          "accusedID": 364,
          "caseNum": 183,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 365,
          "caseNum": 184,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 366,
          "caseNum": 184,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 367,
          "caseNum": 184,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 368,
          "caseNum": 186,
          "fullName": "Juan Sanchez",
          "first": "Juan",
          "middle": "",
          "last": "Sanchez"
        },
        {
          "accusedID": 369,
          "caseNum": 187,
          "fullName": "John Boyd",
          "first": "John",
          "middle": "",
          "last": "Boyd"
        },
        {
          "accusedID": 370,
          "caseNum": 188,
          "fullName": "C. Kanaska",
          "first": "C.",
          "middle": "",
          "last": "Kanaska"
        },
        {
          "accusedID": 370,
          "caseNum": 188,
          "fullName": "C. Kanaska",
          "first": "",
          "middle": "",
          "last": "Canosky"
        },
        {
          "accusedID": 371,
          "caseNum": 188,
          "fullName": "George McDonald",
          "first": "George",
          "middle": "",
          "last": "McDonald"
        },
        {
          "accusedID": 372,
          "caseNum": 189,
          "fullName": "James Noland",
          "first": "James",
          "middle": "",
          "last": "Noland"
        },
        {
          "accusedID": 372,
          "caseNum": 189,
          "fullName": "James Noland",
          "first": "James",
          "middle": "",
          "last": "Knolan"
        },
        {
          "accusedID": 373,
          "caseNum": 190,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 374,
          "caseNum": 190,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 375,
          "caseNum": 191,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 376,
          "caseNum": 192,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 377,
          "caseNum": 193,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 378,
          "caseNum": 194,
          "fullName": "Antonio Marto",
          "first": "Antonio",
          "middle": "",
          "last": "Marto"
        },
        {
          "accusedID": 379,
          "caseNum": 195,
          "fullName": "Polonia Sanchez",
          "first": "Polonia",
          "middle": "",
          "last": "Sanchez"
        },
        {
          "accusedID": 380,
          "caseNum": 196,
          "fullName": "John Clare",
          "first": "John",
          "middle": "",
          "last": "Clare"
        },
        {
          "accusedID": 381,
          "caseNum": 197,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 382,
          "caseNum": 198,
          "fullName": "Jesus Evarra",
          "first": "Jesus",
          "middle": "",
          "last": "Evarra"
        },
        {
          "accusedID": 382,
          "caseNum": 198,
          "fullName": "Jesus Evarra",
          "first": "Spanish Charley",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 382,
          "caseNum": 198,
          "fullName": "Jesus Evarra",
          "first": "Charley the Bullfighter",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 382,
          "caseNum": 198,
          "fullName": "Jesus Evarra",
          "first": "Mexican Charley",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 383,
          "caseNum": 199,
          "fullName": "Anastacio Higuerre",
          "first": "Anastacio",
          "middle": "",
          "last": "Higuerre"
        },
        {
          "accusedID": 383,
          "caseNum": 199,
          "fullName": "Anastacio Higuerre",
          "first": "Ignacio",
          "middle": "",
          "last": "Ygarra"
        },
        {
          "accusedID": 383,
          "caseNum": 199,
          "fullName": "Anastacio Higuerre",
          "first": "Juan",
          "middle": "",
          "last": "Higuera"
        },
        {
          "accusedID": 384,
          "caseNum": 199,
          "fullName": "Manuel Olivas",
          "first": "Manuel",
          "middle": "",
          "last": "Olivas"
        },
        {
          "accusedID": 384,
          "caseNum": 199,
          "fullName": "Manuel Olivas",
          "first": "Manuel",
          "middle": "",
          "last": "Olibas"
        },
        {
          "accusedID": 384,
          "caseNum": 199,
          "fullName": "Manuel Olivas",
          "first": "Manuel",
          "middle": "",
          "last": "Verdez"
        },
        {
          "accusedID": 385,
          "caseNum": 199,
          "fullName": "Ramon Espinosa",
          "first": "Ramon",
          "middle": "",
          "last": "Espinosa"
        },
        {
          "accusedID": 385,
          "caseNum": 199,
          "fullName": "Ramon Espinosa",
          "first": "Ramon",
          "middle": "",
          "last": "Espagnol"
        },
        {
          "accusedID": 386,
          "caseNum": 200,
          "fullName": "Prasey",
          "first": "",
          "middle": "",
          "last": "Prasey"
        },
        {
          "accusedID": 387,
          "caseNum": 201,
          "fullName": "Bernardo Daniel",
          "first": "Bernardo",
          "middle": "",
          "last": "Daniel"
        },
        {
          "accusedID": 388,
          "caseNum": 202,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 389,
          "caseNum": 203,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 390,
          "caseNum": 203,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 391,
          "caseNum": 205,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 392,
          "caseNum": 205,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 393,
          "caseNum": 207,
          "fullName": "Jose Arode",
          "first": "Jose",
          "middle": "",
          "last": "Arode"
        },
        {
          "accusedID": 393,
          "caseNum": 207,
          "fullName": "Jose Arode",
          "first": "Jose",
          "middle": "",
          "last": "Stode"
        },
        {
          "accusedID": 394,
          "caseNum": 207,
          "fullName": "Juan P. Gonzalez",
          "first": "Juan",
          "middle": "P.",
          "last": "Gonzalez"
        },
        {
          "accusedID": 395,
          "caseNum": 207,
          "fullName": "Salvador Valdez",
          "first": "Salvador",
          "middle": "",
          "last": "Valdez"
        },
        {
          "accusedID": 396,
          "caseNum": 208,
          "fullName": "Dolores",
          "first": "Dolores",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 396,
          "caseNum": 208,
          "fullName": "Dolores",
          "first": "Dollores",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 397,
          "caseNum": 208,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 398,
          "caseNum": 209,
          "fullName": "Peter Nicolas",
          "first": "Peter",
          "middle": "",
          "last": "Nicolas"
        },
        {
          "accusedID": 399,
          "caseNum": 211,
          "fullName": "Swarz",
          "first": "Christopher",
          "middle": "",
          "last": "Bennett"
        },
        {
          "accusedID": 399,
          "caseNum": 211,
          "fullName": "Swarz",
          "first": "",
          "middle": "",
          "last": "Swarz"
        },
        {
          "accusedID": 399,
          "caseNum": 211,
          "fullName": "Swarz",
          "first": "",
          "middle": "",
          "last": "Swartz"
        },
        {
          "accusedID": 400,
          "caseNum": 212,
          "fullName": "William Ritchie",
          "first": "William",
          "middle": "",
          "last": "Ritchie"
        },
        {
          "accusedID": 400,
          "caseNum": 212,
          "fullName": "William Ritchie",
          "first": "William",
          "middle": "",
          "last": "Richie"
        },
        {
          "accusedID": 401,
          "caseNum": 213,
          "fullName": "Henry",
          "first": "Henry",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 402,
          "caseNum": 213,
          "fullName": "Isaac",
          "first": "Isaac",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 403,
          "caseNum": 214,
          "fullName": "Demasio Berriessa",
          "first": "Demasio",
          "middle": "",
          "last": "Berriessa"
        },
        {
          "accusedID": 403,
          "caseNum": 214,
          "fullName": "Demasio Berriessa",
          "first": "",
          "middle": "",
          "last": "Berreyesa"
        },
        {
          "accusedID": 404,
          "caseNum": 215,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 405,
          "caseNum": 216,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 406,
          "caseNum": 217,
          "fullName": "Amadee Canu",
          "first": "Amadee",
          "middle": "",
          "last": "Canu"
        },
        {
          "accusedID": 407,
          "caseNum": 217,
          "fullName": "Pierre Archambault",
          "first": "Pierre",
          "middle": "",
          "last": "Archambault"
        },
        {
          "accusedID": 408,
          "caseNum": 218,
          "fullName": "Demas",
          "first": "Demas",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 409,
          "caseNum": 218,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 410,
          "caseNum": 218,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 411,
          "caseNum": 219,
          "fullName": "Jack Roarke",
          "first": "Jack",
          "middle": "",
          "last": "Roarke"
        },
        {
          "accusedID": 412,
          "caseNum": 220,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 413,
          "caseNum": 221,
          "fullName": "Macy",
          "first": "",
          "middle": "",
          "last": "Macy"
        },
        {
          "accusedID": 414,
          "caseNum": 222,
          "fullName": "David Brown",
          "first": "David",
          "middle": "",
          "last": "Brown"
        },
        {
          "accusedID": 415,
          "caseNum": 223,
          "fullName": "Edward Crane Griffiths",
          "first": "Edward",
          "middle": "Crane",
          "last": "Griffiths"
        },
        {
          "accusedID": 416,
          "caseNum": 225,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 417,
          "caseNum": 226,
          "fullName": "Bob Parker",
          "first": "Bob",
          "middle": "",
          "last": "Parker"
        },
        {
          "accusedID": 418,
          "caseNum": 226,
          "fullName": "George Seldon",
          "first": "George",
          "middle": "",
          "last": "Seldon"
        },
        {
          "accusedID": 418,
          "caseNum": 226,
          "fullName": "George Seldon",
          "first": "George",
          "middle": "",
          "last": "Sheldon"
        },
        {
          "accusedID": 419,
          "caseNum": 227,
          "fullName": "William M. Johnson",
          "first": "William",
          "middle": "M.",
          "last": "Johnson"
        },
        {
          "accusedID": 420,
          "caseNum": 228,
          "fullName": "James Moran",
          "first": "James",
          "middle": "",
          "last": "Moran"
        },
        {
          "accusedID": 421,
          "caseNum": 231,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 422,
          "caseNum": 233,
          "fullName": "Justo Betancour",
          "first": "Justo",
          "middle": "",
          "last": "Betancour"
        },
        {
          "accusedID": 423,
          "caseNum": 234,
          "fullName": "Adolpheus E. Moore",
          "first": "Adolpheus",
          "middle": "E.",
          "last": "Moore"
        },
        {
          "accusedID": 424,
          "caseNum": 234,
          "fullName": "Garretson",
          "first": "",
          "middle": "",
          "last": "Garretson"
        },
        {
          "accusedID": 425,
          "caseNum": 234,
          "fullName": "Pole Wilkerson",
          "first": "Pole",
          "middle": "",
          "last": "Wilkerson"
        },
        {
          "accusedID": 426,
          "caseNum": 234,
          "fullName": "William Hand",
          "first": "William",
          "middle": "",
          "last": "Hand"
        },
        {
          "accusedID": 427,
          "caseNum": 234,
          "fullName": "William Watson",
          "first": "William",
          "middle": "",
          "last": "Watson"
        },
        {
          "accusedID": 428,
          "caseNum": 235,
          "fullName": "John Fenning",
          "first": "John",
          "middle": "",
          "last": "Fenning"
        },
        {
          "accusedID": 429,
          "caseNum": 236,
          "fullName": "Jose",
          "first": "Jose",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 430,
          "caseNum": 236,
          "fullName": "Pertervine",
          "first": "Pertervine",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 431,
          "caseNum": 236,
          "fullName": "Trancolino",
          "first": "Trancolino",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 431,
          "caseNum": 236,
          "fullName": "Trancolino",
          "first": "Francolino",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 432,
          "caseNum": 237,
          "fullName": "Peter Carnes",
          "first": "Peter",
          "middle": "",
          "last": "Carnes"
        },
        {
          "accusedID": 433,
          "caseNum": 238,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 434,
          "caseNum": 239,
          "fullName": "Shimer",
          "first": "",
          "middle": "",
          "last": "Shimer"
        },
        {
          "accusedID": 435,
          "caseNum": 240,
          "fullName": "John S. Barclay",
          "first": "John",
          "middle": "S.",
          "last": "Barclay"
        },
        {
          "accusedID": 436,
          "caseNum": 241,
          "fullName": "John Thompson",
          "first": "John",
          "middle": "",
          "last": "Thompson"
        },
        {
          "accusedID": 437,
          "caseNum": 242,
          "fullName": "Francisco Sanchez",
          "first": "Francisco",
          "middle": "",
          "last": "Sanchez"
        },
        {
          "accusedID": 438,
          "caseNum": 242,
          "fullName": "Francisco Tapia",
          "first": "Francisco",
          "middle": "",
          "last": "Tapia"
        },
        {
          "accusedID": 439,
          "caseNum": 242,
          "fullName": "James G. Lackner",
          "first": "James",
          "middle": "G.",
          "last": "Lackner"
        },
        {
          "accusedID": 440,
          "caseNum": 242,
          "fullName": "Jesus Pino",
          "first": "Jesus",
          "middle": "",
          "last": "Pino"
        },
        {
          "accusedID": 441,
          "caseNum": 243,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 442,
          "caseNum": 244,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 443,
          "caseNum": 245,
          "fullName": "Harris",
          "first": "",
          "middle": "",
          "last": "Harris"
        },
        {
          "accusedID": 444,
          "caseNum": 245,
          "fullName": "Hill",
          "first": "",
          "middle": "",
          "last": "Hill"
        },
        {
          "accusedID": 445,
          "caseNum": 246,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 446,
          "caseNum": 248,
          "fullName": "William A. Mann",
          "first": "William",
          "middle": "A.",
          "last": "Mann"
        },
        {
          "accusedID": 446,
          "caseNum": 248,
          "fullName": "William A. Mann",
          "first": "",
          "middle": "",
          "last": "Jones"
        },
        {
          "accusedID": 447,
          "caseNum": 249,
          "fullName": "Charles Osborne",
          "first": "Charles",
          "middle": "",
          "last": "Osborne"
        },
        {
          "accusedID": 448,
          "caseNum": 250,
          "fullName": "Isadoro Soto",
          "first": "Isadoro",
          "middle": "",
          "last": "Soto"
        },
        {
          "accusedID": 449,
          "caseNum": 251,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 450,
          "caseNum": 253,
          "fullName": "Juan B. Lopez",
          "first": "Juan",
          "middle": "B.",
          "last": "Lopez"
        },
        {
          "accusedID": 451,
          "caseNum": 253,
          "fullName": "R. Soto",
          "first": "R.",
          "middle": "",
          "last": "Soto"
        },
        {
          "accusedID": 451,
          "caseNum": 253,
          "fullName": "R. Soto",
          "first": "Raimundo",
          "middle": "",
          "last": "Soto"
        },
        {
          "accusedID": 452,
          "caseNum": 253,
          "fullName": "R. Zuniga",
          "first": "R.",
          "middle": "",
          "last": "Zuniga"
        },
        {
          "accusedID": 452,
          "caseNum": 253,
          "fullName": "R. Zuniga",
          "first": "Ramon",
          "middle": "",
          "last": "Senega"
        },
        {
          "accusedID": 453,
          "caseNum": 253,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 454,
          "caseNum": 254,
          "fullName": "Charles Cora",
          "first": "Charles",
          "middle": "",
          "last": "Cora"
        },
        {
          "accusedID": 455,
          "caseNum": 254,
          "fullName": "James P. Casey",
          "first": "James",
          "middle": "P.",
          "last": "Casey"
        },
        {
          "accusedID": 456,
          "caseNum": 256,
          "fullName": "A. J. Goff",
          "first": "A.",
          "middle": "J.",
          "last": "Goff"
        },
        {
          "accusedID": 457,
          "caseNum": 257,
          "fullName": "Joseph Hetheringon",
          "first": "Joseph",
          "middle": "",
          "last": "Hetheringon"
        },
        {
          "accusedID": 458,
          "caseNum": 257,
          "fullName": "Philander Brace",
          "first": "Philander",
          "middle": "",
          "last": "Brace"
        },
        {
          "accusedID": 459,
          "caseNum": 258,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 460,
          "caseNum": 260,
          "fullName": "C. Colebrook",
          "first": "C.",
          "middle": "",
          "last": "Colebrook"
        },
        {
          "accusedID": 461,
          "caseNum": 261,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 462,
          "caseNum": 262,
          "fullName": "Jose Castro",
          "first": "Jose",
          "middle": "",
          "last": "Castro"
        },
        {
          "accusedID": 463,
          "caseNum": 264,
          "fullName": "Chung Yew",
          "first": "Chung",
          "middle": "",
          "last": "Yew"
        },
        {
          "accusedID": 464,
          "caseNum": 264,
          "fullName": "Huey",
          "first": "Huey",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 465,
          "caseNum": 264,
          "fullName": "Low Sick",
          "first": "Low",
          "middle": "",
          "last": "Sick"
        },
        {
          "accusedID": 466,
          "caseNum": 264,
          "fullName": "Sam Wau",
          "first": "Sam",
          "middle": "",
          "last": "Wau"
        },
        {
          "accusedID": 467,
          "caseNum": 264,
          "fullName": "Tom Buc",
          "first": "Tom",
          "middle": "",
          "last": "Buc"
        },
        {
          "accusedID": 468,
          "caseNum": 265,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 469,
          "caseNum": 266,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 470,
          "caseNum": 267,
          "fullName": "Miguel Soto",
          "first": "Miguel",
          "middle": "",
          "last": "Soto"
        },
        {
          "accusedID": 471,
          "caseNum": 268,
          "fullName": "Diego Navarro",
          "first": "Diego",
          "middle": "",
          "last": "Navarro"
        },
        {
          "accusedID": 472,
          "caseNum": 268,
          "fullName": "Jose Santos",
          "first": "Jose",
          "middle": "",
          "last": "Santos"
        },
        {
          "accusedID": 473,
          "caseNum": 268,
          "fullName": "Juan Valenzuela",
          "first": "Juan",
          "middle": "",
          "last": "Valenzuela"
        },
        {
          "accusedID": 474,
          "caseNum": 268,
          "fullName": "Pedro Lopez",
          "first": "Pedro",
          "middle": "",
          "last": "Lopez"
        },
        {
          "accusedID": 475,
          "caseNum": 269,
          "fullName": "Francisco Ardillero",
          "first": "Francisco",
          "middle": "",
          "last": "Ardillero"
        },
        {
          "accusedID": 476,
          "caseNum": 269,
          "fullName": "Juan Silvas",
          "first": "Juan",
          "middle": "",
          "last": "Silvas"
        },
        {
          "accusedID": 476,
          "caseNum": 269,
          "fullName": "Juan Silvas",
          "first": "Juan",
          "middle": "",
          "last": "Cataba"
        },
        {
          "accusedID": 477,
          "caseNum": 270,
          "fullName": "Jose Jesus Espinosa",
          "first": "Jose",
          "middle": "Jesus",
          "last": "Espinosa"
        },
        {
          "accusedID": 478,
          "caseNum": 271,
          "fullName": "Encarnacion Berreyessa",
          "first": "Encarnacion",
          "middle": "",
          "last": "Berreyessa"
        },
        {
          "accusedID": 479,
          "caseNum": 272,
          "fullName": "Andreas Frontez",
          "first": "Andreas",
          "middle": "",
          "last": "Frontez"
        },
        {
          "accusedID": 479,
          "caseNum": 272,
          "fullName": "Andreas Frontez",
          "first": "Andreas",
          "middle": "",
          "last": "Fontes"
        },
        {
          "accusedID": 479,
          "caseNum": 272,
          "fullName": "Andreas Frontez",
          "first": "Jose",
          "middle": "Ygnacio",
          "last": "Fontes"
        },
        {
          "accusedID": 480,
          "caseNum": 272,
          "fullName": "Francisco Daniel",
          "first": "Francisco",
          "middle": "",
          "last": "Daniel"
        },
        {
          "accusedID": 480,
          "caseNum": 272,
          "fullName": "Francisco Daniel",
          "first": "Pancho",
          "middle": "",
          "last": "Daniel"
        },
        {
          "accusedID": 480,
          "caseNum": 272,
          "fullName": "Francisco Daniel",
          "first": "El Guerro",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 481,
          "caseNum": 272,
          "fullName": "Pequino",
          "first": "Pequino",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 481,
          "caseNum": 272,
          "fullName": "Pequino",
          "first": "el Guerro Galindo",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 482,
          "caseNum": 273,
          "fullName": "Juan Flores",
          "first": "Juan",
          "middle": "",
          "last": "Flores"
        },
        {
          "accusedID": 483,
          "caseNum": 274,
          "fullName": "Anastacio Garcia",
          "first": "Anastacio",
          "middle": "",
          "last": "Garcia"
        },
        {
          "accusedID": 483,
          "caseNum": 274,
          "fullName": "Anastacio Garcia",
          "first": "Jose",
          "middle": "Anastacio",
          "last": "Garcia"
        },
        {
          "accusedID": 484,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 485,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 486,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 487,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 488,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 489,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 490,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 491,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 492,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 493,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 494,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 495,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 496,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 497,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 498,
          "caseNum": 276,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 499,
          "caseNum": 277,
          "fullName": "Jose Maria Egare",
          "first": "Jose",
          "middle": "Maria",
          "last": "Egare"
        },
        {
          "accusedID": 500,
          "caseNum": 278,
          "fullName": "Johnson",
          "first": "",
          "middle": "",
          "last": "Johnson"
        },
        {
          "accusedID": 501,
          "caseNum": 278,
          "fullName": "Jones",
          "first": "",
          "middle": "",
          "last": "Jones"
        },
        {
          "accusedID": 502,
          "caseNum": 278,
          "fullName": "Lake",
          "first": "",
          "middle": "",
          "last": "Lake"
        },
        {
          "accusedID": 503,
          "caseNum": 278,
          "fullName": "Ringgold",
          "first": "",
          "middle": "",
          "last": "Ringgold"
        },
        {
          "accusedID": 504,
          "caseNum": 279,
          "fullName": "Mrs. C",
          "first": "",
          "middle": "",
          "last": "Mrs. C"
        },
        {
          "accusedID": 505,
          "caseNum": 280,
          "fullName": "Dean",
          "first": "",
          "middle": "",
          "last": "Dean"
        },
        {
          "accusedID": 506,
          "caseNum": 282,
          "fullName": "Julian",
          "first": "Julian",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 507,
          "caseNum": 283,
          "fullName": "Hoskins",
          "first": "",
          "middle": "",
          "last": "Hoskins"
        },
        {
          "accusedID": 508,
          "caseNum": 284,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 509,
          "caseNum": 284,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 510,
          "caseNum": 284,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 511,
          "caseNum": 285,
          "fullName": "Robinson",
          "first": "",
          "middle": "",
          "last": "Robinson"
        },
        {
          "accusedID": 512,
          "caseNum": 286,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 513,
          "caseNum": 286,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 514,
          "caseNum": 286,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 515,
          "caseNum": 286,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 516,
          "caseNum": 287,
          "fullName": "Henry Lorrenz",
          "first": "Henry",
          "middle": "",
          "last": "Lorrenz"
        },
        {
          "accusedID": 517,
          "caseNum": 288,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 518,
          "caseNum": 289,
          "fullName": "Aguerra",
          "first": "",
          "middle": "",
          "last": "Aguerra"
        },
        {
          "accusedID": 519,
          "caseNum": 290,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 520,
          "caseNum": 290,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 521,
          "caseNum": 290,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 522,
          "caseNum": 290,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 523,
          "caseNum": 290,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 524,
          "caseNum": 290,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 525,
          "caseNum": 291,
          "fullName": "Stepplefield",
          "first": "",
          "middle": "",
          "last": "Lawson"
        },
        {
          "accusedID": 525,
          "caseNum": 291,
          "fullName": "Stepplefield",
          "first": "",
          "middle": "",
          "last": "Stepplefield"
        },
        {
          "accusedID": 525,
          "caseNum": 291,
          "fullName": "Stepplefield",
          "first": "",
          "middle": "",
          "last": "Stepperfield"
        },
        {
          "accusedID": 526,
          "caseNum": 291,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 527,
          "caseNum": 291,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 528,
          "caseNum": 292,
          "fullName": "Jesus Anastasia",
          "first": "Jesus",
          "middle": "",
          "last": "Anastasia"
        },
        {
          "accusedID": 528,
          "caseNum": 292,
          "fullName": "Jesus Anastasia",
          "first": "Anastasia",
          "middle": "",
          "last": "Jesus"
        },
        {
          "accusedID": 529,
          "caseNum": 293,
          "fullName": "Aaron Bracey",
          "first": "Aaron",
          "middle": "",
          "last": "Bracey"
        },
        {
          "accusedID": 530,
          "caseNum": 294,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 531,
          "caseNum": 294,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 532,
          "caseNum": 294,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 533,
          "caseNum": 295,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 534,
          "caseNum": 296,
          "fullName": "James E. Carter",
          "first": "James",
          "middle": "E.",
          "last": "Carter"
        },
        {
          "accusedID": 535,
          "caseNum": 298,
          "fullName": "Ysidro Silvas",
          "first": "Ysidro",
          "middle": "",
          "last": "Silvas"
        },
        {
          "accusedID": 536,
          "caseNum": 299,
          "fullName": "Anderson",
          "first": "",
          "middle": "",
          "last": "Anderson"
        },
        {
          "accusedID": 537,
          "caseNum": 300,
          "fullName": "Snow",
          "first": "",
          "middle": "",
          "last": "Snow"
        },
        {
          "accusedID": 538,
          "caseNum": 301,
          "fullName": "William C. Deputy",
          "first": "William",
          "middle": "C.",
          "last": "Deputy"
        },
        {
          "accusedID": 539,
          "caseNum": 302,
          "fullName": "John",
          "first": "John",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 540,
          "caseNum": 303,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 541,
          "caseNum": 304,
          "fullName": "Pancho Daniel",
          "first": "Pancho",
          "middle": "",
          "last": "Daniel"
        },
        {
          "accusedID": 542,
          "caseNum": 305,
          "fullName": "Harrison Morgan",
          "first": "Harrison",
          "middle": "",
          "last": "Morgan"
        },
        {
          "accusedID": 542,
          "caseNum": 305,
          "fullName": "Harrison Morgan",
          "first": "",
          "middle": "",
          "last": "Parrott"
        },
        {
          "accusedID": 543,
          "caseNum": 305,
          "fullName": "Wallace",
          "first": "",
          "middle": "",
          "last": "Wallace"
        },
        {
          "accusedID": 544,
          "caseNum": 306,
          "fullName": "Badillo",
          "first": "",
          "middle": "",
          "last": "Badillo"
        },
        {
          "accusedID": 545,
          "caseNum": 306,
          "fullName": "Francisco Badillo",
          "first": "Francisco",
          "middle": "",
          "last": "Badillo"
        },
        {
          "accusedID": 545,
          "caseNum": 306,
          "fullName": "Francisco Badillo",
          "first": "",
          "middle": "",
          "last": "Bardella"
        },
        {
          "accusedID": 546,
          "caseNum": 308,
          "fullName": "Antonio Ruez",
          "first": "Antonio",
          "middle": "",
          "last": "Ruez"
        },
        {
          "accusedID": 547,
          "caseNum": 309,
          "fullName": "Benjamin Doyle",
          "first": "Benjamin",
          "middle": "",
          "last": "Doyle"
        },
        {
          "accusedID": 548,
          "caseNum": 309,
          "fullName": "George Rush",
          "first": "George",
          "middle": "",
          "last": "Rush"
        },
        {
          "accusedID": 549,
          "caseNum": 309,
          "fullName": "William Grey",
          "first": "William",
          "middle": "",
          "last": "Grey"
        },
        {
          "accusedID": 550,
          "caseNum": 309,
          "fullName": "William Riddle",
          "first": "William",
          "middle": "",
          "last": "Riddle"
        },
        {
          "accusedID": 551,
          "caseNum": 310,
          "fullName": "To-ah-yo-la",
          "first": "To-ah-yo-la",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 551,
          "caseNum": 310,
          "fullName": "To-ah-yo-la",
          "first": "To-an-yo-la",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 552,
          "caseNum": 311,
          "fullName": "Jose Claudio Alvitre",
          "first": "Jose",
          "middle": "Claudio",
          "last": "Alvitre"
        },
        {
          "accusedID": 553,
          "caseNum": 312,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 554,
          "caseNum": 313,
          "fullName": "Francisco Cota",
          "first": "Francisco",
          "middle": "",
          "last": "Cota"
        },
        {
          "accusedID": 555,
          "caseNum": 314,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 556,
          "caseNum": 315,
          "fullName": "Allajo",
          "first": "",
          "middle": "",
          "last": "Allajo"
        },
        {
          "accusedID": 557,
          "caseNum": 315,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 558,
          "caseNum": 315,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 559,
          "caseNum": 315,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 560,
          "caseNum": 315,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 561,
          "caseNum": 316,
          "fullName": "Manuel Vera",
          "first": "Manuel",
          "middle": "",
          "last": "Vera"
        },
        {
          "accusedID": 562,
          "caseNum": 317,
          "fullName": "Capitan",
          "first": "Capitan",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 563,
          "caseNum": 317,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 564,
          "caseNum": 317,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 565,
          "caseNum": 317,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 566,
          "caseNum": 317,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 567,
          "caseNum": 318,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 568,
          "caseNum": 319,
          "fullName": "Andrew Wood",
          "first": "Andrew",
          "middle": "",
          "last": "Wood"
        },
        {
          "accusedID": 569,
          "caseNum": 319,
          "fullName": "Boston Damewood",
          "first": "Boston",
          "middle": "",
          "last": "Damewood"
        },
        {
          "accusedID": 569,
          "caseNum": 319,
          "fullName": "Boston Damewood",
          "first": "Ross",
          "middle": "",
          "last": "Damcord"
        },
        {
          "accusedID": 569,
          "caseNum": 319,
          "fullName": "Boston Damewood",
          "first": "Boss",
          "middle": "",
          "last": "Damwood"
        },
        {
          "accusedID": 569,
          "caseNum": 319,
          "fullName": "Boston Damewood",
          "first": "Boss",
          "middle": "",
          "last": "Daimwood"
        },
        {
          "accusedID": 570,
          "caseNum": 319,
          "fullName": "Eli Chase",
          "first": "Eli",
          "middle": "",
          "last": "Chase"
        },
        {
          "accusedID": 571,
          "caseNum": 319,
          "fullName": "José Sylvester Olivas",
          "first": "José",
          "middle": "Sylvester",
          "last": "Olivas"
        },
        {
          "accusedID": 572,
          "caseNum": 319,
          "fullName": "José Yrreba",
          "first": "José",
          "middle": "",
          "last": "Yrreba"
        },
        {
          "accusedID": 572,
          "caseNum": 319,
          "fullName": "José Yrreba",
          "first": "José",
          "middle": "",
          "last": "Ibarra"
        },
        {
          "accusedID": 573,
          "caseNum": 320,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 574,
          "caseNum": 321,
          "fullName": "Manuel Ceredel",
          "first": "Manuel",
          "middle": "",
          "last": "Ceredel"
        },
        {
          "accusedID": 575,
          "caseNum": 322,
          "fullName": "Charles Wilkins",
          "first": "Charles",
          "middle": "",
          "last": "Wilkins"
        },
        {
          "accusedID": 575,
          "caseNum": 322,
          "fullName": "Charles Wilkins",
          "first": "John",
          "middle": "",
          "last": "Peters"
        },
        {
          "accusedID": 576,
          "caseNum": 323,
          "fullName": "Gregorio Orozco",
          "first": "Gregorio",
          "middle": "",
          "last": "Orozco"
        },
        {
          "accusedID": 576,
          "caseNum": 323,
          "fullName": "Gregorio Orozco",
          "first": "Gregoria",
          "middle": "",
          "last": "Orozco"
        },
        {
          "accusedID": 576,
          "caseNum": 323,
          "fullName": "Gregorio Orozco",
          "first": "Gregoria",
          "middle": "",
          "last": "Orosco"
        },
        {
          "accusedID": 577,
          "caseNum": 324,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 578,
          "caseNum": 324,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 579,
          "caseNum": 324,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 580,
          "caseNum": 324,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 581,
          "caseNum": 325,
          "fullName": "Dickinson",
          "first": "",
          "middle": "",
          "last": "Dickinson"
        },
        {
          "accusedID": 582,
          "caseNum": 326,
          "fullName": "Francisco Lopez",
          "first": "Francisco",
          "middle": "",
          "last": "Lopez"
        },
        {
          "accusedID": 583,
          "caseNum": 326,
          "fullName": "Patricinio Lopez",
          "first": "Patricinio",
          "middle": "",
          "last": "Lopez"
        },
        {
          "accusedID": 584,
          "caseNum": 326,
          "fullName": "Salvador Mesquita",
          "first": "Salvador",
          "middle": "",
          "last": "Mesquita"
        },
        {
          "accusedID": 585,
          "caseNum": 327,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 586,
          "caseNum": 327,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 587,
          "caseNum": 328,
          "fullName": "Juan Iguera",
          "first": "Juan",
          "middle": "",
          "last": "Iguera"
        },
        {
          "accusedID": 587,
          "caseNum": 328,
          "fullName": "Juan Iguera",
          "first": "",
          "middle": "",
          "last": "Higura"
        },
        {
          "accusedID": 588,
          "caseNum": 329,
          "fullName": "John Barnhart",
          "first": "John",
          "middle": "",
          "last": "Barnhart"
        },
        {
          "accusedID": 589,
          "caseNum": 330,
          "fullName": "Charles Lee",
          "first": "Charles",
          "middle": "",
          "last": "Lee"
        },
        {
          "accusedID": 590,
          "caseNum": 330,
          "fullName": "Patrick Murphy",
          "first": "Patrick",
          "middle": "",
          "last": "Murphy"
        },
        {
          "accusedID": 591,
          "caseNum": 331,
          "fullName": "Billy Wilburn",
          "first": "Billy",
          "middle": "",
          "last": "Wilburn"
        },
        {
          "accusedID": 592,
          "caseNum": 331,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 593,
          "caseNum": 331,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 594,
          "caseNum": 331,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 595,
          "caseNum": 332,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 596,
          "caseNum": 333,
          "fullName": "Elder Thompson",
          "first": "Elder",
          "middle": "",
          "last": "Thompson"
        },
        {
          "accusedID": 596,
          "caseNum": 333,
          "fullName": "Elder Thompson",
          "first": "Elder",
          "middle": "",
          "last": "Thomson"
        },
        {
          "accusedID": 597,
          "caseNum": 334,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 598,
          "caseNum": 334,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 599,
          "caseNum": 335,
          "fullName": "Estevan",
          "first": "Estevan",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 599,
          "caseNum": 335,
          "fullName": "Estevan",
          "first": "Estaban",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 600,
          "caseNum": 336,
          "fullName": "Webb",
          "first": "",
          "middle": "",
          "last": "Webb"
        },
        {
          "accusedID": 601,
          "caseNum": 337,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 602,
          "caseNum": 339,
          "fullName": "Rains",
          "first": "",
          "middle": "",
          "last": "Rains"
        },
        {
          "accusedID": 603,
          "caseNum": 341,
          "fullName": "Lucas Garcia",
          "first": "Lucas",
          "middle": "",
          "last": "Garcia"
        },
        {
          "accusedID": 604,
          "caseNum": 342,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 605,
          "caseNum": 343,
          "fullName": "Gregorio Gomez",
          "first": "Gregorio",
          "middle": "",
          "last": "Gomez"
        },
        {
          "accusedID": 606,
          "caseNum": 343,
          "fullName": "Jesus Gomez",
          "first": "Jesus",
          "middle": "",
          "last": "Gomez"
        },
        {
          "accusedID": 607,
          "caseNum": 343,
          "fullName": "Valentine Vargas",
          "first": "Valentine",
          "middle": "",
          "last": "Vargas"
        },
        {
          "accusedID": 608,
          "caseNum": 344,
          "fullName": "Charles Olson",
          "first": "Charles",
          "middle": "",
          "last": "Olson"
        },
        {
          "accusedID": 608,
          "caseNum": 344,
          "fullName": "Charles Olson",
          "first": "",
          "middle": "",
          "last": "Olsen"
        },
        {
          "accusedID": 609,
          "caseNum": 345,
          "fullName": "Santana Duartz",
          "first": "Santana",
          "middle": "",
          "last": "Duartz"
        },
        {
          "accusedID": 609,
          "caseNum": 345,
          "fullName": "Santana Duartz",
          "first": "Sacramento",
          "middle": "",
          "last": "Duarte"
        },
        {
          "accusedID": 610,
          "caseNum": 346,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 611,
          "caseNum": 346,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 612,
          "caseNum": 347,
          "fullName": "Miguel Lachenais",
          "first": "Miguel",
          "middle": "",
          "last": "Lachenais"
        },
        {
          "accusedID": 612,
          "caseNum": 347,
          "fullName": "Miguel Lachenais",
          "first": "Michel",
          "middle": "",
          "last": "Lachenai"
        },
        {
          "accusedID": 612,
          "caseNum": 347,
          "fullName": "Miguel Lachenais",
          "first": "Louis",
          "middle": "",
          "last": "Lachenai"
        },
        {
          "accusedID": 613,
          "caseNum": 348,
          "fullName": "James McCrory",
          "first": "James",
          "middle": "",
          "last": "McCrory"
        },
        {
          "accusedID": 613,
          "caseNum": 348,
          "fullName": "James McCrory",
          "first": "J.",
          "middle": "C.",
          "last": "Mcrary"
        },
        {
          "accusedID": 614,
          "caseNum": 349,
          "fullName": "George Hargrand",
          "first": "George",
          "middle": "",
          "last": "Hargrand"
        },
        {
          "accusedID": 614,
          "caseNum": 349,
          "fullName": "George Hargrand",
          "first": "George",
          "middle": "",
          "last": "Hargen"
        },
        {
          "accusedID": 615,
          "caseNum": 350,
          "fullName": "Matt Tarpey",
          "first": "Matt",
          "middle": "",
          "last": "Tarpey"
        },
        {
          "accusedID": 616,
          "caseNum": 351,
          "fullName": "Pete",
          "first": "Pete",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 617,
          "caseNum": 352,
          "fullName": "Billy Smith",
          "first": "Billy",
          "middle": "",
          "last": "Smith"
        },
        {
          "accusedID": 618,
          "caseNum": 352,
          "fullName": "Charley Howard",
          "first": "Charley",
          "middle": "",
          "last": "Howard"
        },
        {
          "accusedID": 619,
          "caseNum": 352,
          "fullName": "Joe Barbie",
          "first": "Joe",
          "middle": "",
          "last": "Barbie"
        },
        {
          "accusedID": 620,
          "caseNum": 352,
          "fullName": "John Blanchon",
          "first": "John",
          "middle": "",
          "last": "Blanchon"
        },
        {
          "accusedID": 621,
          "caseNum": 352,
          "fullName": "John Williams",
          "first": "John",
          "middle": "",
          "last": "Williams"
        },
        {
          "accusedID": 622,
          "caseNum": 352,
          "fullName": "Joseph Newell",
          "first": "Joseph",
          "middle": "",
          "last": "Newell"
        },
        {
          "accusedID": 623,
          "caseNum": 352,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 624,
          "caseNum": 352,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 625,
          "caseNum": 352,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 626,
          "caseNum": 352,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 627,
          "caseNum": 353,
          "fullName": "Jake Linson",
          "first": "Jake",
          "middle": "",
          "last": "Linson"
        },
        {
          "accusedID": 628,
          "caseNum": 354,
          "fullName": "Blanchard",
          "first": "",
          "middle": "",
          "last": "Blanchard"
        },
        {
          "accusedID": 629,
          "caseNum": 355,
          "fullName": "Ernst Reusch",
          "first": "Ernst",
          "middle": "",
          "last": "Reusch"
        },
        {
          "accusedID": 629,
          "caseNum": 355,
          "fullName": "Ernst Reusch",
          "first": "",
          "middle": "",
          "last": "Rensch"
        },
        {
          "accusedID": 630,
          "caseNum": 357,
          "fullName": "Jesus Ramos",
          "first": "Jesus",
          "middle": "",
          "last": "Ramos"
        },
        {
          "accusedID": 631,
          "caseNum": 358,
          "fullName": "George Brown",
          "first": "George",
          "middle": "",
          "last": "Brown"
        },
        {
          "accusedID": 632,
          "caseNum": 358,
          "fullName": "Harry Howard",
          "first": "Harry",
          "middle": "",
          "last": "Howard"
        },
        {
          "accusedID": 633,
          "caseNum": 358,
          "fullName": "Potter",
          "first": "",
          "middle": "",
          "last": "Potter"
        },
        {
          "accusedID": 634,
          "caseNum": 358,
          "fullName": "Seth McCain",
          "first": "Seth",
          "middle": "",
          "last": "McCain"
        },
        {
          "accusedID": 635,
          "caseNum": 358,
          "fullName": "Spence",
          "first": "",
          "middle": "",
          "last": "Spence"
        },
        {
          "accusedID": 635,
          "caseNum": 358,
          "fullName": "Spence",
          "first": "",
          "middle": "",
          "last": "Spencer"
        },
        {
          "accusedID": 636,
          "caseNum": 359,
          "fullName": "Antonio Igarra",
          "first": "Antonio",
          "middle": "",
          "last": "Igarra"
        },
        {
          "accusedID": 636,
          "caseNum": 359,
          "fullName": "Antonio Igarra",
          "first": "",
          "middle": "",
          "last": "Ygarra"
        },
        {
          "accusedID": 636,
          "caseNum": 359,
          "fullName": "Antonio Igarra",
          "first": "Antone",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 637,
          "caseNum": 360,
          "fullName": "Yereger",
          "first": "",
          "middle": "",
          "last": "Yereger"
        },
        {
          "accusedID": 638,
          "caseNum": 361,
          "fullName": "Thomas W. Henley",
          "first": "Thomas",
          "middle": "W.",
          "last": "Henley"
        },
        {
          "accusedID": 639,
          "caseNum": 362,
          "fullName": "Joseph Murphey",
          "first": "Joseph",
          "middle": "",
          "last": "Murphey"
        },
        {
          "accusedID": 640,
          "caseNum": 363,
          "fullName": "Francisdo Arias",
          "first": "Francisdo",
          "middle": "",
          "last": "Arias"
        },
        {
          "accusedID": 641,
          "caseNum": 363,
          "fullName": "José Chamalis",
          "first": "José",
          "middle": "",
          "last": "Chamalis"
        },
        {
          "accusedID": 642,
          "caseNum": 364,
          "fullName": "Justin Arajo",
          "first": "Justin",
          "middle": "",
          "last": "Arajo"
        },
        {
          "accusedID": 643,
          "caseNum": 365,
          "fullName": "Antonio Maron",
          "first": "Antonio",
          "middle": "",
          "last": "Maron"
        },
        {
          "accusedID": 643,
          "caseNum": 365,
          "fullName": "Antonio Maron",
          "first": "Anthony",
          "middle": "",
          "last": "Maron"
        },
        {
          "accusedID": 644,
          "caseNum": 365,
          "fullName": "Bessena Ruiz",
          "first": "Bessena",
          "middle": "",
          "last": "Ruiz"
        },
        {
          "accusedID": 644,
          "caseNum": 365,
          "fullName": "Bessena Ruiz",
          "first": "Vicente",
          "middle": "",
          "last": "Ruiz"
        },
        {
          "accusedID": 645,
          "caseNum": 365,
          "fullName": "Fermin Elder",
          "first": "Fermin",
          "middle": "",
          "last": "Elder"
        },
        {
          "accusedID": 645,
          "caseNum": 365,
          "fullName": "Fermin Elder",
          "first": "Fermin",
          "middle": "",
          "last": "Eldeo"
        },
        {
          "accusedID": 646,
          "caseNum": 365,
          "fullName": "Francisco Ensinas",
          "first": "Francisco",
          "middle": "",
          "last": "Ensinas"
        },
        {
          "accusedID": 646,
          "caseNum": 365,
          "fullName": "Francisco Ensinas",
          "first": "Encinas",
          "middle": "",
          "last": "Enlado"
        },
        {
          "accusedID": 647,
          "caseNum": 365,
          "fullName": "Miguel Elias",
          "first": "Miguel",
          "middle": "",
          "last": "Elias"
        },
        {
          "accusedID": 647,
          "caseNum": 365,
          "fullName": "Miguel Elias",
          "first": "Francisco",
          "middle": "",
          "last": "Elias"
        },
        {
          "accusedID": 648,
          "caseNum": 366,
          "fullName": "Christian Mutschler",
          "first": "Christian",
          "middle": "",
          "last": "Mutschler"
        },
        {
          "accusedID": 649,
          "caseNum": 367,
          "fullName": "Thomas Yoakum",
          "first": "Thomas",
          "middle": "",
          "last": "Yoakum"
        },
        {
          "accusedID": 650,
          "caseNum": 367,
          "fullName": "William Yoakum",
          "first": "William",
          "middle": "",
          "last": "Yoakum"
        },
        {
          "accusedID": 651,
          "caseNum": 368,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 652,
          "caseNum": 369,
          "fullName": "Abijah Gibson",
          "first": "Abijah",
          "middle": "",
          "last": "Gibson"
        },
        {
          "accusedID": 653,
          "caseNum": 369,
          "fullName": "Elijah Frost",
          "first": "Elijah",
          "middle": "",
          "last": "Frost"
        },
        {
          "accusedID": 654,
          "caseNum": 369,
          "fullName": "Tom McCracken",
          "first": "Tom",
          "middle": "",
          "last": "McCracken"
        },
        {
          "accusedID": 655,
          "caseNum": 370,
          "fullName": "Victo Miranda",
          "first": "Victo",
          "middle": "",
          "last": "Miranda"
        },
        {
          "accusedID": 655,
          "caseNum": 370,
          "fullName": "Victo Miranda",
          "first": "Victor",
          "middle": "",
          "last": "Mirando"
        },
        {
          "accusedID": 656,
          "caseNum": 371,
          "fullName": "Thomas James",
          "first": "Thomas",
          "middle": "",
          "last": "James"
        },
        {
          "accusedID": 656,
          "caseNum": 371,
          "fullName": "Thomas James",
          "first": "J.",
          "middle": "F.",
          "last": "Noakes"
        },
        {
          "accusedID": 657,
          "caseNum": 372,
          "fullName": "Tom Herbert",
          "first": "Tom",
          "middle": "",
          "last": "Herbert"
        },
        {
          "accusedID": 657,
          "caseNum": 372,
          "fullName": "Tom Herbert",
          "first": "Tom",
          "middle": "",
          "last": "Hurbert"
        },
        {
          "accusedID": 658,
          "caseNum": 373,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 659,
          "caseNum": 374,
          "fullName": "Jim Moore",
          "first": "Jim",
          "middle": "",
          "last": "Moore"
        },
        {
          "accusedID": 660,
          "caseNum": 374,
          "fullName": "Jim Williams",
          "first": "Jim",
          "middle": "",
          "last": "Williams"
        },
        {
          "accusedID": 661,
          "caseNum": 375,
          "fullName": "Encarnacion Garcia",
          "first": "Encarnacion",
          "middle": "",
          "last": "Garcia"
        },
        {
          "accusedID": 661,
          "caseNum": 375,
          "fullName": "Encarnacion Garcia",
          "first": "Incarnacion",
          "middle": "",
          "last": "Garcia"
        },
        {
          "accusedID": 662,
          "caseNum": 376,
          "fullName": "William Richardson",
          "first": "William",
          "middle": "",
          "last": "Richardson"
        },
        {
          "accusedID": 663,
          "caseNum": 378,
          "fullName": "Louis Farthing",
          "first": "Louis",
          "middle": "",
          "last": "Farthing"
        },
        {
          "accusedID": 664,
          "caseNum": 378,
          "fullName": "William H. White",
          "first": "William",
          "middle": "H.",
          "last": "White"
        },
        {
          "accusedID": 664,
          "caseNum": 378,
          "fullName": "William H. White",
          "first": "William",
          "middle": "",
          "last": "Pitts"
        },
        {
          "accusedID": 665,
          "caseNum": 379,
          "fullName": "Jimmy Delaney",
          "first": "Jimmy",
          "middle": "",
          "last": "Delaney"
        },
        {
          "accusedID": 666,
          "caseNum": 380,
          "fullName": "A. W. Powers",
          "first": "A.",
          "middle": "W.",
          "last": "Powers"
        },
        {
          "accusedID": 666,
          "caseNum": 380,
          "fullName": "A. W. Powers",
          "first": "Americus",
          "middle": "W.",
          "last": "Powers"
        },
        {
          "accusedID": 667,
          "caseNum": 381,
          "fullName": "J. Hemmi",
          "first": "J.",
          "middle": "",
          "last": "Hemmi"
        },
        {
          "accusedID": 668,
          "caseNum": 381,
          "fullName": "Peter Hemmi",
          "first": "Peter",
          "middle": "",
          "last": "Hemmi"
        },
        {
          "accusedID": 668,
          "caseNum": 381,
          "fullName": "Peter Hemmi",
          "first": "Peter",
          "middle": "",
          "last": "Homey"
        },
        {
          "accusedID": 668,
          "caseNum": 381,
          "fullName": "Peter Hemmi",
          "first": "Peter",
          "middle": "",
          "last": "Horney"
        },
        {
          "accusedID": 669,
          "caseNum": 382,
          "fullName": "Hong Di",
          "first": "Hong",
          "middle": "",
          "last": "Di"
        },
        {
          "accusedID": 670,
          "caseNum": 383,
          "fullName": "McCutcheon",
          "first": "",
          "middle": "",
          "last": "McCutcheon"
        },
        {
          "accusedID": 670,
          "caseNum": 383,
          "fullName": "McCutcheon",
          "first": "",
          "middle": "",
          "last": "McCutchan"
        },
        {
          "accusedID": 671,
          "caseNum": 384,
          "fullName": "Tacho",
          "first": "Tacho",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 672,
          "caseNum": 385,
          "fullName": "E. L. Criswell",
          "first": "E.",
          "middle": "L.",
          "last": "Criswell"
        },
        {
          "accusedID": 673,
          "caseNum": 386,
          "fullName": "B. D. Yantis",
          "first": "B.",
          "middle": "D.",
          "last": "Yantis"
        },
        {
          "accusedID": 674,
          "caseNum": 386,
          "fullName": "Calvin Hall",
          "first": "Calvin",
          "middle": "",
          "last": "Hall"
        },
        {
          "accusedID": 675,
          "caseNum": 386,
          "fullName": "Frank Hall",
          "first": "Frank",
          "middle": "",
          "last": "Hall"
        },
        {
          "accusedID": 676,
          "caseNum": 386,
          "fullName": "James Hall",
          "first": "James",
          "middle": "",
          "last": "Hall"
        },
        {
          "accusedID": 677,
          "caseNum": 386,
          "fullName": "Martin Hall",
          "first": "Martin",
          "middle": "",
          "last": "Hall"
        },
        {
          "accusedID": 678,
          "caseNum": 387,
          "fullName": "Mickey",
          "first": "Mickey",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 678,
          "caseNum": 387,
          "fullName": "Mickey",
          "first": "Bill",
          "middle": "",
          "last": "Lyon"
        },
        {
          "accusedID": 679,
          "caseNum": 388,
          "fullName": "Lewis Ford",
          "first": "Lewis",
          "middle": "",
          "last": "Ford"
        },
        {
          "accusedID": 680,
          "caseNum": 389,
          "fullName": "Devine",
          "first": "",
          "middle": "",
          "last": "Devine"
        },
        {
          "accusedID": 680,
          "caseNum": 389,
          "fullName": "Devine",
          "first": "",
          "middle": "",
          "last": "Divine"
        },
        {
          "accusedID": 681,
          "caseNum": 390,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 682,
          "caseNum": 391,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 683,
          "caseNum": 392,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 684,
          "caseNum": 393,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 685,
          "caseNum": 394,
          "fullName": "Pablo",
          "first": "Pablo",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 686,
          "caseNum": 395,
          "fullName": "Starkey",
          "first": "",
          "middle": "",
          "last": "Starkey"
        },
        {
          "accusedID": 687,
          "caseNum": 396,
          "fullName": "Eustis",
          "first": "",
          "middle": "",
          "last": "Eustis"
        },
        {
          "accusedID": 688,
          "caseNum": 396,
          "fullName": "Grant",
          "first": "",
          "middle": "",
          "last": "Grant"
        },
        {
          "accusedID": 689,
          "caseNum": 398,
          "fullName": "Thomas Fillmore",
          "first": "Thomas",
          "middle": "",
          "last": "Fillmore"
        },
        {
          "accusedID": 690,
          "caseNum": 399,
          "fullName": "Robert Fisher",
          "first": "Robert",
          "middle": "",
          "last": "Fisher"
        },
        {
          "accusedID": 691,
          "caseNum": 401,
          "fullName": "William Wilson",
          "first": "William",
          "middle": "",
          "last": "Wilson"
        },
        {
          "accusedID": 692,
          "caseNum": 402,
          "fullName": "Yankee Jim",
          "first": "Yankee Jim",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 693,
          "caseNum": 405,
          "fullName": "Sage",
          "first": "",
          "middle": "",
          "last": "Sage"
        },
        {
          "accusedID": 694,
          "caseNum": 406,
          "fullName": "Coyote Joe",
          "first": "Coyote Joe",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 695,
          "caseNum": 407,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 696,
          "caseNum": 407,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 697,
          "caseNum": 408,
          "fullName": "James Simpson",
          "first": "James",
          "middle": "",
          "last": "Simpson"
        },
        {
          "accusedID": 698,
          "caseNum": 408,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 699,
          "caseNum": 408,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 700,
          "caseNum": 409,
          "fullName": "James",
          "first": "",
          "middle": "",
          "last": "James"
        },
        {
          "accusedID": 701,
          "caseNum": 409,
          "fullName": "Staggers",
          "first": "",
          "middle": "",
          "last": "Staggers"
        },
        {
          "accusedID": 702,
          "caseNum": 410,
          "fullName": "Bill Hardin",
          "first": "Bill",
          "middle": "",
          "last": "Hardin"
        },
        {
          "accusedID": 702,
          "caseNum": 410,
          "fullName": "Bill Hardin",
          "first": "Bill",
          "middle": "",
          "last": "Harding"
        },
        {
          "accusedID": 703,
          "caseNum": 411,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 704,
          "caseNum": 413,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 705,
          "caseNum": 414,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 706,
          "caseNum": 414,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 707,
          "caseNum": 415,
          "fullName": "Church",
          "first": "",
          "middle": "",
          "last": "Church"
        },
        {
          "accusedID": 708,
          "caseNum": 416,
          "fullName": "J. B. Isabell",
          "first": "J.",
          "middle": "B.",
          "last": "Isabell"
        },
        {
          "accusedID": 709,
          "caseNum": 416,
          "fullName": "Robert Coulburn",
          "first": "Robert",
          "middle": "",
          "last": "Coulburn"
        },
        {
          "accusedID": 710,
          "caseNum": 417,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 711,
          "caseNum": 418,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 712,
          "caseNum": 419,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 713,
          "caseNum": 422,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 714,
          "caseNum": 422,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 715,
          "caseNum": 423,
          "fullName": "A. Bardt",
          "first": "A.",
          "middle": "",
          "last": "Bardt"
        },
        {
          "accusedID": 716,
          "caseNum": 424,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 717,
          "caseNum": 425,
          "fullName": "John Ross",
          "first": "John",
          "middle": "",
          "last": "Ross"
        },
        {
          "accusedID": 718,
          "caseNum": 426,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 719,
          "caseNum": 427,
          "fullName": "Henry Miller",
          "first": "Henry",
          "middle": "",
          "last": "Miller"
        },
        {
          "accusedID": 720,
          "caseNum": 427,
          "fullName": "Jonathan Pillsbury",
          "first": "Jonathan",
          "middle": "",
          "last": "Pillsbury"
        },
        {
          "accusedID": 721,
          "caseNum": 427,
          "fullName": "Tom Parks",
          "first": "Tom",
          "middle": "",
          "last": "Parks"
        },
        {
          "accusedID": 722,
          "caseNum": 428,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 723,
          "caseNum": 428,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 724,
          "caseNum": 428,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 725,
          "caseNum": 428,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 726,
          "caseNum": 430,
          "fullName": "James Taylor",
          "first": "James",
          "middle": "",
          "last": "Taylor"
        },
        {
          "accusedID": 727,
          "caseNum": 431,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 728,
          "caseNum": 432,
          "fullName": "George Wright",
          "first": "George",
          "middle": "",
          "last": "Wright"
        },
        {
          "accusedID": 729,
          "caseNum": 432,
          "fullName": "Porter",
          "first": "",
          "middle": "",
          "last": "Porter"
        },
        {
          "accusedID": 730,
          "caseNum": 433,
          "fullName": "George Taylor",
          "first": "George",
          "middle": "",
          "last": "Taylor"
        },
        {
          "accusedID": 731,
          "caseNum": 434,
          "fullName": "McDivitt",
          "first": "",
          "middle": "",
          "last": "McDivitt"
        },
        {
          "accusedID": 732,
          "caseNum": 435,
          "fullName": "Charles Thompson",
          "first": "Charles",
          "middle": "",
          "last": "Thompson"
        },
        {
          "accusedID": 733,
          "caseNum": 436,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 734,
          "caseNum": 436,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 735,
          "caseNum": 437,
          "fullName": "William Lomax",
          "first": "William",
          "middle": "",
          "last": "Lomax"
        },
        {
          "accusedID": 736,
          "caseNum": 438,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 737,
          "caseNum": 438,
          "fullName": "Wood",
          "first": "",
          "middle": "",
          "last": "Wood"
        },
        {
          "accusedID": 738,
          "caseNum": 439,
          "fullName": "Rafael Escobar",
          "first": "Rafael",
          "middle": "",
          "last": "Escobar"
        },
        {
          "accusedID": 739,
          "caseNum": 440,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 740,
          "caseNum": 440,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 741,
          "caseNum": 440,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 742,
          "caseNum": 440,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 743,
          "caseNum": 440,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 744,
          "caseNum": 441,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 745,
          "caseNum": 441,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 746,
          "caseNum": 441,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 747,
          "caseNum": 441,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 748,
          "caseNum": 441,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 749,
          "caseNum": 441,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 750,
          "caseNum": 442,
          "fullName": "Woods",
          "first": "",
          "middle": "",
          "last": "Woods"
        },
        {
          "accusedID": 751,
          "caseNum": 443,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 752,
          "caseNum": 443,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 753,
          "caseNum": 443,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 754,
          "caseNum": 443,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 755,
          "caseNum": 443,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 756,
          "caseNum": 443,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 757,
          "caseNum": 443,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 758,
          "caseNum": 443,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 759,
          "caseNum": 444,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 760,
          "caseNum": 445,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 761,
          "caseNum": 446,
          "fullName": "Pancho",
          "first": "Pancho",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 762,
          "caseNum": 446,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 763,
          "caseNum": 446,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 764,
          "caseNum": 446,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 765,
          "caseNum": 446,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 766,
          "caseNum": 446,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 767,
          "caseNum": 446,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 768,
          "caseNum": 446,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 769,
          "caseNum": 446,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 770,
          "caseNum": 446,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 771,
          "caseNum": 446,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 772,
          "caseNum": 447,
          "fullName": "George Wilson",
          "first": "George",
          "middle": "",
          "last": "Wilson"
        },
        {
          "accusedID": 773,
          "caseNum": 448,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 774,
          "caseNum": 449,
          "fullName": "Pete",
          "first": "Pete",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 775,
          "caseNum": 450,
          "fullName": "George Mitchell",
          "first": "George",
          "middle": "",
          "last": "Mitchell"
        },
        {
          "accusedID": 776,
          "caseNum": 451,
          "fullName": "José Alvitre",
          "first": "José",
          "middle": "",
          "last": "Alvitre"
        },
        {
          "accusedID": 777,
          "caseNum": 451,
          "fullName": "Juan Alvitre",
          "first": "Juan",
          "middle": "",
          "last": "Alvitre"
        },
        {
          "accusedID": 778,
          "caseNum": 452,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 779,
          "caseNum": 452,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 780,
          "caseNum": 454,
          "fullName": "Nep",
          "first": "Nep",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 781,
          "caseNum": 454,
          "fullName": "Nep's father",
          "first": "Nep's father",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 782,
          "caseNum": 455,
          "fullName": "Tom",
          "first": "Tom",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 783,
          "caseNum": 457,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 784,
          "caseNum": 457,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 785,
          "caseNum": 458,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 786,
          "caseNum": 459,
          "fullName": "John O'Donnell",
          "first": "John",
          "middle": "",
          "last": "O'Donnell"
        },
        {
          "accusedID": 787,
          "caseNum": 460,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 788,
          "caseNum": 461,
          "fullName": "Jesus Arellanes",
          "first": "Jesus",
          "middle": "",
          "last": "Arellanes"
        },
        {
          "accusedID": 789,
          "caseNum": 462,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 790,
          "caseNum": 463,
          "fullName": "Jack McDowell",
          "first": "Jack",
          "middle": "",
          "last": "McDowell"
        },
        {
          "accusedID": 791,
          "caseNum": 463,
          "fullName": "James Welch",
          "first": "James",
          "middle": "",
          "last": "Welch"
        },
        {
          "accusedID": 792,
          "caseNum": 464,
          "fullName": "Robbes",
          "first": "",
          "middle": "",
          "last": "Robbes"
        },
        {
          "accusedID": 792,
          "caseNum": 464,
          "fullName": "Robbes",
          "first": "",
          "middle": "",
          "last": "Robles"
        },
        {
          "accusedID": 793,
          "caseNum": 465,
          "fullName": "Spikey",
          "first": "Spikey",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 794,
          "caseNum": 466,
          "fullName": "Juan de Dios Supulveda",
          "first": "Juan",
          "middle": "de Dios",
          "last": "Supulveda"
        },
        {
          "accusedID": 794,
          "caseNum": 466,
          "fullName": "Juan de Dios Supulveda",
          "first": "Juan",
          "middle": "de Dias",
          "last": "Supulveda"
        },
        {
          "accusedID": 795,
          "caseNum": 468,
          "fullName": "Ah Cut",
          "first": "Ah",
          "middle": "",
          "last": "Cut"
        },
        {
          "accusedID": 796,
          "caseNum": 468,
          "fullName": "Ah Long",
          "first": "Ah",
          "middle": "",
          "last": "Long"
        },
        {
          "accusedID": 796,
          "caseNum": 468,
          "fullName": "Ah Long",
          "first": "Ah",
          "middle": "",
          "last": "Tong"
        },
        {
          "accusedID": 797,
          "caseNum": 468,
          "fullName": "Ah Loo",
          "first": "Ah",
          "middle": "",
          "last": "Loo"
        },
        {
          "accusedID": 797,
          "caseNum": 468,
          "fullName": "Ah Loo",
          "first": "Ah",
          "middle": "",
          "last": "Lo"
        },
        {
          "accusedID": 798,
          "caseNum": 468,
          "fullName": "Ah Wan",
          "first": "Ah",
          "middle": "",
          "last": "Wan"
        },
        {
          "accusedID": 798,
          "caseNum": 468,
          "fullName": "Ah Wan",
          "first": "Ah",
          "middle": "",
          "last": "Won"
        },
        {
          "accusedID": 799,
          "caseNum": 468,
          "fullName": "Ah Was",
          "first": "Ah",
          "middle": "",
          "last": "Was"
        },
        {
          "accusedID": 799,
          "caseNum": 468,
          "fullName": "Ah Was",
          "first": "Ah",
          "middle": "",
          "last": "Wad"
        },
        {
          "accusedID": 800,
          "caseNum": 468,
          "fullName": "Chang Wan",
          "first": "Chang",
          "middle": "",
          "last": "Wan"
        },
        {
          "accusedID": 800,
          "caseNum": 468,
          "fullName": "Chang Wan",
          "first": "Chang",
          "middle": "",
          "last": "Tong"
        },
        {
          "accusedID": 801,
          "caseNum": 468,
          "fullName": "Chee Long Tong",
          "first": "Chee",
          "middle": "Long",
          "last": "Tong"
        },
        {
          "accusedID": 801,
          "caseNum": 468,
          "fullName": "Chee Long Tong",
          "first": "Gene",
          "middle": "",
          "last": "Tong"
        },
        {
          "accusedID": 802,
          "caseNum": 468,
          "fullName": "Day Kee",
          "first": "Day",
          "middle": "",
          "last": "Kee"
        },
        {
          "accusedID": 802,
          "caseNum": 468,
          "fullName": "Day Kee",
          "first": "Da",
          "middle": "",
          "last": "Kee"
        },
        {
          "accusedID": 803,
          "caseNum": 468,
          "fullName": "Fun Yu",
          "first": "Fun",
          "middle": "",
          "last": "Yu"
        },
        {
          "accusedID": 804,
          "caseNum": 468,
          "fullName": "Ho Hing",
          "first": "Ho",
          "middle": "",
          "last": "Hing"
        },
        {
          "accusedID": 805,
          "caseNum": 468,
          "fullName": "Joung Burrow",
          "first": "Joung",
          "middle": "",
          "last": "Burrow"
        },
        {
          "accusedID": 805,
          "caseNum": 468,
          "fullName": "Joung Burrow",
          "first": "Johnny",
          "middle": "",
          "last": "Burrow"
        },
        {
          "accusedID": 806,
          "caseNum": 468,
          "fullName": "Lo Hey",
          "first": "Lo",
          "middle": "",
          "last": "Hey"
        },
        {
          "accusedID": 806,
          "caseNum": 468,
          "fullName": "Lo Hey",
          "first": "Lo",
          "middle": "",
          "last": "By"
        },
        {
          "accusedID": 806,
          "caseNum": 468,
          "fullName": "Lo Hey",
          "first": "Ko",
          "middle": "",
          "last": "Ke"
        },
        {
          "accusedID": 807,
          "caseNum": 468,
          "fullName": "Long Quai",
          "first": "Long",
          "middle": "",
          "last": "Quai"
        },
        {
          "accusedID": 807,
          "caseNum": 468,
          "fullName": "Long Quai",
          "first": "Teong",
          "middle": "",
          "last": "Quai"
        },
        {
          "accusedID": 807,
          "caseNum": 468,
          "fullName": "Long Quai",
          "first": "Leong",
          "middle": "",
          "last": "Quai"
        },
        {
          "accusedID": 808,
          "caseNum": 468,
          "fullName": "Tong Wan",
          "first": "Tong",
          "middle": "",
          "last": "Wan"
        },
        {
          "accusedID": 808,
          "caseNum": 468,
          "fullName": "Tong Wan",
          "first": "Hung",
          "middle": "Fong",
          "last": "Wan"
        },
        {
          "accusedID": 808,
          "caseNum": 468,
          "fullName": "Tong Wan",
          "first": "Fong",
          "middle": "",
          "last": "Won"
        },
        {
          "accusedID": 809,
          "caseNum": 468,
          "fullName": "Wa Sin Quai",
          "first": "Wa",
          "middle": "Sin",
          "last": "Quai"
        },
        {
          "accusedID": 809,
          "caseNum": 468,
          "fullName": "Wa Sin Quai",
          "first": "Wa",
          "middle": "Sin",
          "last": "Quae"
        },
        {
          "accusedID": 809,
          "caseNum": 468,
          "fullName": "Wa Sin Quai",
          "first": "Who",
          "middle": "",
          "last": "Sim"
        },
        {
          "accusedID": 810,
          "caseNum": 468,
          "fullName": "Wan Fo",
          "first": "Wan",
          "middle": "",
          "last": "Fo"
        },
        {
          "accusedID": 810,
          "caseNum": 468,
          "fullName": "Wan Fo",
          "first": "Ah",
          "middle": "",
          "last": "Fee"
        },
        {
          "accusedID": 810,
          "caseNum": 468,
          "fullName": "Wan Fo",
          "first": "Wan",
          "middle": "",
          "last": "Fee"
        },
        {
          "accusedID": 810,
          "caseNum": 468,
          "fullName": "Wan Fo",
          "first": "Ah",
          "middle": "",
          "last": "Fo"
        },
        {
          "accusedID": 811,
          "caseNum": 468,
          "fullName": "Wing Chee",
          "first": "Wing",
          "middle": "",
          "last": "Chee"
        },
        {
          "accusedID": 811,
          "caseNum": 468,
          "fullName": "Wing Chee",
          "first": "Wang",
          "middle": "",
          "last": "Chee"
        },
        {
          "accusedID": 812,
          "caseNum": 468,
          "fullName": "Wong Chin",
          "first": "Wong",
          "middle": "",
          "last": "Chin"
        },
        {
          "accusedID": 812,
          "caseNum": 468,
          "fullName": "Wong Chin",
          "first": "Wong",
          "middle": "",
          "last": "Chun"
        },
        {
          "accusedID": 813,
          "caseNum": 468,
          "fullName": "Wong Tuck",
          "first": "Wong",
          "middle": "",
          "last": "Tuck"
        },
        {
          "accusedID": 814,
          "caseNum": 470,
          "fullName": "Carlos Ferman",
          "first": "Carlos",
          "middle": "",
          "last": "Ferman"
        },
        {
          "accusedID": 814,
          "caseNum": 470,
          "fullName": "Carlos Ferman",
          "first": "Carlos",
          "middle": "",
          "last": "Firmah"
        },
        {
          "accusedID": 815,
          "caseNum": 470,
          "fullName": "Eustagio Santyo",
          "first": "Eustagio",
          "middle": "",
          "last": "Santyo"
        },
        {
          "accusedID": 815,
          "caseNum": 470,
          "fullName": "Eustagio Santyo",
          "first": "Eustacio",
          "middle": "",
          "last": "Montillo"
        },
        {
          "accusedID": 816,
          "caseNum": 470,
          "fullName": "Frank Doheny",
          "first": "Frank",
          "middle": "",
          "last": "Doheny"
        },
        {
          "accusedID": 816,
          "caseNum": 470,
          "fullName": "Frank Doheny",
          "first": "Frank",
          "middle": "",
          "last": "Dabney"
        },
        {
          "accusedID": 816,
          "caseNum": 470,
          "fullName": "Frank Doheny",
          "first": "Frank",
          "middle": "",
          "last": "Debany"
        },
        {
          "accusedID": 816,
          "caseNum": 470,
          "fullName": "Frank Doheny",
          "first": "Frank",
          "middle": "",
          "last": "Debeney"
        },
        {
          "accusedID": 816,
          "caseNum": 470,
          "fullName": "Frank Doheny",
          "first": "Frank",
          "middle": "",
          "last": "Debney"
        },
        {
          "accusedID": 816,
          "caseNum": 470,
          "fullName": "Frank Doheny",
          "first": "Frank ",
          "middle": "",
          "last": "Dabeeny"
        },
        {
          "accusedID": 817,
          "caseNum": 470,
          "fullName": "Gumasindo Palacio",
          "first": "Gumasindo",
          "middle": "",
          "last": "Palacio"
        },
        {
          "accusedID": 817,
          "caseNum": 470,
          "fullName": "Gumasindo Palacio",
          "first": "Gumacindo",
          "middle": "",
          "last": "Palacio"
        },
        {
          "accusedID": 817,
          "caseNum": 470,
          "fullName": "Gumasindo Palacio",
          "first": "Gumesindo",
          "middle": "",
          "last": "Palacio"
        },
        {
          "accusedID": 818,
          "caseNum": 471,
          "fullName": "Indian Charley",
          "first": "Indian Charley",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 819,
          "caseNum": 472,
          "fullName": "Refugio Boca",
          "first": "Refugio",
          "middle": "",
          "last": "Boca"
        },
        {
          "accusedID": 819,
          "caseNum": 472,
          "fullName": "Refugio Boca",
          "first": "Refugio",
          "middle": "",
          "last": "Baco"
        },
        {
          "accusedID": 819,
          "caseNum": 472,
          "fullName": "Refugio Boca",
          "first": "Refugio",
          "middle": "",
          "last": "Montallo"
        },
        {
          "accusedID": 819,
          "caseNum": 472,
          "fullName": "Refugio Boca",
          "first": "Refugia",
          "middle": "",
          "last": "Baca"
        },
        {
          "accusedID": 819,
          "caseNum": 472,
          "fullName": "Refugio Boca",
          "first": "Refugio",
          "middle": "",
          "last": "Montalla"
        },
        {
          "accusedID": 820,
          "caseNum": 473,
          "fullName": "John McCoy",
          "first": "John",
          "middle": "",
          "last": "McCoy"
        },
        {
          "accusedID": 821,
          "caseNum": 474,
          "fullName": "Jose Semferino Fellom",
          "first": "Jose",
          "middle": "Semferino",
          "last": "Fellom"
        },
        {
          "accusedID": 821,
          "caseNum": 474,
          "fullName": "Jose Semferino Fellom",
          "first": "Sulfarano",
          "middle": "",
          "last": "Fallon"
        },
        {
          "accusedID": 821,
          "caseNum": 474,
          "fullName": "Jose Semferino Fellom",
          "first": "",
          "middle": "",
          "last": "Fallen"
        },
        {
          "accusedID": 822,
          "caseNum": 475,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 823,
          "caseNum": 475,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 824,
          "caseNum": 475,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 825,
          "caseNum": 477,
          "fullName": "Joseph de Roche",
          "first": "Joseph",
          "middle": "",
          "last": "de Roche"
        },
        {
          "accusedID": 825,
          "caseNum": 477,
          "fullName": "Joseph de Roche",
          "first": "Joseph",
          "middle": "",
          "last": "Daroche"
        },
        {
          "accusedID": 826,
          "caseNum": 478,
          "fullName": "Francisco Jimeno",
          "first": "Francisco",
          "middle": "",
          "last": "Jimeno"
        },
        {
          "accusedID": 828,
          "caseNum": 480,
          "fullName": "Henry D. Benner",
          "first": "Henry",
          "middle": "D.",
          "last": "Benner"
        },
        {
          "accusedID": 829,
          "caseNum": 481,
          "fullName": "Holden Dick",
          "first": "Holden",
          "middle": "",
          "last": "Dick"
        },
        {
          "accusedID": 830,
          "caseNum": 481,
          "fullName": "Vicente Olivas",
          "first": "Vicente",
          "middle": "",
          "last": "Olivas"
        },
        {
          "accusedID": 830,
          "caseNum": 481,
          "fullName": "Vicente Olivas",
          "first": "Mexican Ben",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 831,
          "caseNum": 482,
          "fullName": "George Vuga",
          "first": "George",
          "middle": "",
          "last": "Vuga"
        },
        {
          "accusedID": 831,
          "caseNum": 482,
          "fullName": "George Vuga",
          "first": "George",
          "middle": "",
          "last": "Vuza"
        },
        {
          "accusedID": 832,
          "caseNum": 483,
          "fullName": "Julian Ladon",
          "first": "Julian",
          "middle": "",
          "last": "Ladon"
        },
        {
          "accusedID": 832,
          "caseNum": 483,
          "fullName": "Julian Ladon",
          "first": "Julian",
          "middle": "",
          "last": "Ledon"
        },
        {
          "accusedID": 832,
          "caseNum": 483,
          "fullName": "Julian Ladon",
          "first": "Julian",
          "middle": "",
          "last": "Leden"
        },
        {
          "accusedID": 832,
          "caseNum": 483,
          "fullName": "Julian Ladon",
          "first": "Julian",
          "middle": "",
          "last": "Medon"
        },
        {
          "accusedID": 832,
          "caseNum": 483,
          "fullName": "Julian Ladon",
          "first": "",
          "middle": "",
          "last": "Bedon"
        },
        {
          "accusedID": 833,
          "caseNum": 484,
          "fullName": "John Wright",
          "first": "John",
          "middle": "",
          "last": "Wright"
        },
        {
          "accusedID": 834,
          "caseNum": 485,
          "fullName": "Ah Tai",
          "first": "Ah",
          "middle": "",
          "last": "Tai"
        },
        {
          "accusedID": 834,
          "caseNum": 485,
          "fullName": "Ah Tai",
          "first": "Ah",
          "middle": "Quong",
          "last": "Tia"
        },
        {
          "accusedID": 834,
          "caseNum": 485,
          "fullName": "Ah Tai",
          "first": "Ah",
          "middle": "Quong",
          "last": "Tai"
        },
        {
          "accusedID": 835,
          "caseNum": 486,
          "fullName": "Charles Ruggles",
          "first": "Charles",
          "middle": "",
          "last": "Ruggles"
        },
        {
          "accusedID": 836,
          "caseNum": 486,
          "fullName": "John Ruggles",
          "first": "John",
          "middle": "",
          "last": "Ruggles"
        },
        {
          "accusedID": 837,
          "caseNum": 487,
          "fullName": "Francisco Torres",
          "first": "Francisco",
          "middle": "",
          "last": "Torres"
        },
        {
          "accusedID": 837,
          "caseNum": 487,
          "fullName": "Francisco Torres",
          "first": "Joseph",
          "middle": "",
          "last": "Bermuda"
        },
        {
          "accusedID": 838,
          "caseNum": 488,
          "fullName": "J. W. Smith",
          "first": "J.",
          "middle": "W.",
          "last": "Smith"
        },
        {
          "accusedID": 839,
          "caseNum": 489,
          "fullName": "Jesus Fuen",
          "first": "Jesus",
          "middle": "",
          "last": "Fuen"
        },
        {
          "accusedID": 840,
          "caseNum": 490,
          "fullName": "William Dean",
          "first": "William",
          "middle": "",
          "last": "Dean"
        },
        {
          "accusedID": 841,
          "caseNum": 491,
          "fullName": "Victor Adams",
          "first": "Victor",
          "middle": "",
          "last": "Adams"
        },
        {
          "accusedID": 842,
          "caseNum": 492,
          "fullName": "Garland Stemler",
          "first": "Garland",
          "middle": "",
          "last": "Stemler"
        },
        {
          "accusedID": 842,
          "caseNum": 492,
          "fullName": "Garland Stemler",
          "first": "Garland",
          "middle": "",
          "last": "Semier"
        },
        {
          "accusedID": 843,
          "caseNum": 492,
          "fullName": "Lawrence H. Johnson",
          "first": "Lawrence",
          "middle": "H.",
          "last": "Johnson"
        },
        {
          "accusedID": 844,
          "caseNum": 492,
          "fullName": "Luis Moreno",
          "first": "Luis",
          "middle": "",
          "last": "Moreno"
        },
        {
          "accusedID": 845,
          "caseNum": 492,
          "fullName": "William Null",
          "first": "William",
          "middle": "",
          "last": null
        },
        {
          "accusedID": 846,
          "caseNum": 493,
          "fullName": "William Archer",
          "first": "William",
          "middle": "",
          "last": "Archer"
        },
        {
          "accusedID": 847,
          "caseNum": 494,
          "fullName": "Alfrred Littlefield",
          "first": "Alfrred",
          "middle": "",
          "last": "Littlefield"
        },
        {
          "accusedID": 847,
          "caseNum": 494,
          "fullName": "Alfrred Littlefield",
          "first": "Jack",
          "middle": "",
          "last": "Littlefield"
        },
        {
          "accusedID": 848,
          "caseNum": 495,
          "fullName": "Yung Fook",
          "first": "Yung",
          "middle": "",
          "last": "Fook"
        },
        {
          "accusedID": 848,
          "caseNum": 495,
          "fullName": "Yung Fook",
          "first": "Young",
          "middle": "",
          "last": "Fook"
        },
        {
          "accusedID": 848,
          "caseNum": 495,
          "fullName": "Yung Fook",
          "first": "Yung",
          "middle": "",
          "last": "Look"
        },
        {
          "accusedID": 849,
          "caseNum": 496,
          "fullName": "Joe Simpson",
          "first": "Joe",
          "middle": "",
          "last": "Simpson"
        },
        {
          "accusedID": 850,
          "caseNum": 497,
          "fullName": "Charles Valento",
          "first": "Charles",
          "middle": "",
          "last": "Valento"
        },
        {
          "accusedID": 850,
          "caseNum": 497,
          "fullName": "Charles Valento",
          "first": "Charles",
          "middle": "",
          "last": "Vallente"
        },
        {
          "accusedID": 850,
          "caseNum": 497,
          "fullName": "Charles Valento",
          "first": "Charles",
          "middle": "",
          "last": "Valenti"
        },
        {
          "accusedID": 850,
          "caseNum": 497,
          "fullName": "Charles Valento",
          "first": "Spanny",
          "middle": "",
          "last": "Valente"
        },
        {
          "accusedID": 851,
          "caseNum": 497,
          "fullName": "George Boyd",
          "first": "George",
          "middle": "",
          "last": "Boyd"
        },
        {
          "accusedID": 852,
          "caseNum": 497,
          "fullName": "Terrence Fitts",
          "first": "Terrence",
          "middle": "",
          "last": "Fitts"
        },
        {
          "accusedID": 853,
          "caseNum": 498,
          "fullName": "John M. Holmes",
          "first": "John",
          "middle": "M.",
          "last": "Holmes"
        },
        {
          "accusedID": 854,
          "caseNum": 498,
          "fullName": "Thomas H. Thurmond",
          "first": "Thomas",
          "middle": "H.",
          "last": "Thurmond"
        },
        {
          "accusedID": 855,
          "caseNum": 499,
          "fullName": "Joe Williams",
          "first": "Joe",
          "middle": "",
          "last": "Williams"
        },
        {
          "accusedID": 856,
          "caseNum": 500,
          "fullName": "Santos Peralta",
          "first": "Santos",
          "middle": "",
          "last": "Peralta"
        },
        {
          "accusedID": 856,
          "caseNum": 500,
          "fullName": "Santos Peralta",
          "first": "Santus",
          "middle": "",
          "last": "Peraltus"
        },
        {
          "accusedID": 857,
          "caseNum": 501,
          "fullName": "Joaquin Valenzuela",
          "first": "Joaquin",
          "middle": "",
          "last": "Valenzuela"
        },
        {
          "accusedID": 857,
          "caseNum": 501,
          "fullName": "Joaquin Valenzuela",
          "first": "Joaquin",
          "middle": "",
          "last": "Ocomorenia"
        },
        {
          "accusedID": 857,
          "caseNum": 501,
          "fullName": "Joaquin Valenzuela",
          "first": "Nacamereno",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 857,
          "caseNum": 501,
          "fullName": "Joaquin Valenzuela",
          "first": "Joaquin",
          "middle": "",
          "last": "Nelanzuela"
        },
        {
          "accusedID": 858,
          "caseNum": 502,
          "fullName": "Luciano Tapia",
          "first": "Luciano",
          "middle": "",
          "last": "Tapia"
        },
        {
          "accusedID": 858,
          "caseNum": 502,
          "fullName": "Luciano Tapia",
          "first": "El Mesteno",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 858,
          "caseNum": 502,
          "fullName": "Luciano Tapia",
          "first": "Mestend",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 859,
          "caseNum": 503,
          "fullName": "Jose Antonio Garcia",
          "first": "Jose",
          "middle": "Antonio",
          "last": "Garcia"
        },
        {
          "accusedID": 860,
          "caseNum": 504,
          "fullName": "Pio Linares",
          "first": "Pio",
          "middle": "",
          "last": "Linares"
        },
        {
          "accusedID": 861,
          "caseNum": 505,
          "fullName": "Desidero Grijalva",
          "first": "Desidero",
          "middle": "",
          "last": "Grijalva"
        },
        {
          "accusedID": 861,
          "caseNum": 505,
          "fullName": "Desidero Grijalva",
          "first": "Desedaria",
          "middle": "",
          "last": "Geijelva"
        },
        {
          "accusedID": 861,
          "caseNum": 505,
          "fullName": "Desidero Grijalva",
          "first": "Disedario",
          "middle": "",
          "last": "Grizalva"
        },
        {
          "accusedID": 862,
          "caseNum": 505,
          "fullName": "Miguel Blanco",
          "first": "Miguel",
          "middle": "",
          "last": "Blanco"
        },
        {
          "accusedID": 863,
          "caseNum": 506,
          "fullName": "Nieves Eduriquez Robles",
          "first": "Nieves",
          "middle": "Eduriquez",
          "last": "Robles"
        },
        {
          "accusedID": 863,
          "caseNum": 506,
          "fullName": "Nieves Eduriquez Robles",
          "first": "Nieves",
          "middle": "Eduviques",
          "last": "Robles"
        },
        {
          "accusedID": 863,
          "caseNum": 506,
          "fullName": "Nieves Eduriquez Robles",
          "first": "Florian",
          "middle": "",
          "last": "Servin"
        },
        {
          "accusedID": 863,
          "caseNum": 506,
          "fullName": "Nieves Eduriquez Robles",
          "first": "Frolian",
          "middle": "",
          "last": "Servin"
        },
        {
          "accusedID": 864,
          "caseNum": 507,
          "fullName": "Manual Garcia",
          "first": "Manual",
          "middle": "",
          "last": "Garcia"
        },
        {
          "accusedID": 865,
          "caseNum": 508,
          "fullName": "Antonio Garcia",
          "first": "Antonio",
          "middle": "",
          "last": "Garcia"
        },
        {
          "accusedID": 866,
          "caseNum": 509,
          "fullName": "Manuel Castro",
          "first": "Manuel",
          "middle": "",
          "last": "Castro"
        },
        {
          "accusedID": 867,
          "caseNum": 510,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 868,
          "caseNum": 510,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 869,
          "caseNum": 511,
          "fullName": "Charley",
          "first": "Charley",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 869,
          "caseNum": 511,
          "fullName": "Charley",
          "first": "Charley Bill",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 870,
          "caseNum": 511,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 871,
          "caseNum": 512,
          "fullName": "Thomas George",
          "first": "Thomas",
          "middle": "",
          "last": "George"
        },
        {
          "accusedID": 872,
          "caseNum": 513,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 873,
          "caseNum": 514,
          "fullName": "Black Mow",
          "first": "Black Mow",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 874,
          "caseNum": 514,
          "fullName": "Jim",
          "first": "Jim",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 875,
          "caseNum": 514,
          "fullName": "Narpa",
          "first": "Narpa",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 876,
          "caseNum": 515,
          "fullName": "Dillon",
          "first": "",
          "middle": "",
          "last": "Dillon"
        },
        {
          "accusedID": 877,
          "caseNum": 516,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 878,
          "caseNum": 517,
          "fullName": "Jonathan Ogle",
          "first": "Jonathan",
          "middle": "",
          "last": "Ogle"
        },
        {
          "accusedID": 879,
          "caseNum": 518,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 880,
          "caseNum": 519,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 881,
          "caseNum": 520,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 882,
          "caseNum": 520,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 883,
          "caseNum": 520,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 884,
          "caseNum": 520,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 885,
          "caseNum": 520,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 886,
          "caseNum": 522,
          "fullName": "Christopher Bennett",
          "first": "Christopher",
          "middle": "",
          "last": "Bennett"
        },
        {
          "accusedID": 887,
          "caseNum": 523,
          "fullName": "Tubbs",
          "first": "",
          "middle": "",
          "last": "Tubbs"
        },
        {
          "accusedID": 888,
          "caseNum": 524,
          "fullName": "Cruz",
          "first": "",
          "middle": "",
          "last": "Cruz"
        },
        {
          "accusedID": 889,
          "caseNum": 525,
          "fullName": "Ramon Carillo",
          "first": "Ramon",
          "middle": "",
          "last": "Carillo"
        },
        {
          "accusedID": 889,
          "caseNum": 525,
          "fullName": "Ramon Carillo",
          "first": "Hose",
          "middle": "Antonio",
          "last": "Carillo"
        },
        {
          "accusedID": 890,
          "caseNum": 526,
          "fullName": "Pancho Redondo",
          "first": "Pancho",
          "middle": "",
          "last": "Redondo"
        },
        {
          "accusedID": 890,
          "caseNum": 526,
          "fullName": "Pancho Redondo",
          "first": "Francisco",
          "middle": "",
          "last": "Redondo"
        },
        {
          "accusedID": 891,
          "caseNum": 527,
          "fullName": "Chulu Castro",
          "first": "Chulu",
          "middle": "",
          "last": "Castro"
        },
        {
          "accusedID": 892,
          "caseNum": 528,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 893,
          "caseNum": 529,
          "fullName": "Jose Castro",
          "first": "Jose",
          "middle": "",
          "last": "Castro"
        },
        {
          "accusedID": 894,
          "caseNum": 530,
          "fullName": "Jose Alvijo",
          "first": "Jose",
          "middle": "",
          "last": "Alvijo"
        },
        {
          "accusedID": 895,
          "caseNum": 530,
          "fullName": "Rafael Martinez",
          "first": "Rafael",
          "middle": "",
          "last": "Martinez"
        },
        {
          "accusedID": 896,
          "caseNum": 531,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 897,
          "caseNum": 531,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 898,
          "caseNum": 532,
          "fullName": "Juan Salazar",
          "first": "Juan",
          "middle": "",
          "last": "Salazar"
        },
        {
          "accusedID": 898,
          "caseNum": 532,
          "fullName": "Juan Salazar",
          "first": "Juan",
          "middle": "",
          "last": "Salisar"
        },
        {
          "accusedID": 899,
          "caseNum": 532,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 900,
          "caseNum": 532,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 901,
          "caseNum": 533,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 902,
          "caseNum": 534,
          "fullName": "Flores",
          "first": "",
          "middle": "",
          "last": "Flores"
        },
        {
          "accusedID": 903,
          "caseNum": 535,
          "fullName": "James B. Yates",
          "first": "James",
          "middle": "B.",
          "last": "Yates"
        },
        {
          "accusedID": 904,
          "caseNum": 536,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 905,
          "caseNum": 536,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 906,
          "caseNum": 538,
          "fullName": "Benjamin F. Sprague",
          "first": "Benjamin",
          "middle": "F.",
          "last": "Sprague"
        },
        {
          "accusedID": 907,
          "caseNum": 539,
          "fullName": "Clyde L. Johnson",
          "first": "Clyde",
          "middle": "L.",
          "last": "Johnson"
        },
        {
          "accusedID": 907,
          "caseNum": 539,
          "fullName": "Clyde L. Johnson",
          "first": "Clifford",
          "middle": "L. ",
          "last": "Johnson"
        },
        {
          "accusedID": 907,
          "caseNum": 539,
          "fullName": "Clyde L. Johnson",
          "first": "Charles",
          "middle": "L.",
          "last": "Johnson"
        },
        {
          "accusedID": 908,
          "caseNum": 540,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 909,
          "caseNum": 541,
          "fullName": "Tom Bell",
          "first": "Tom",
          "middle": "",
          "last": "Bell"
        },
        {
          "accusedID": 909,
          "caseNum": 541,
          "fullName": "Tom Bell",
          "first": "George",
          "middle": "",
          "last": "Brooks"
        },
        {
          "accusedID": 909,
          "caseNum": 541,
          "fullName": "Tom Bell",
          "first": "Thomas",
          "middle": "",
          "last": "Hodges"
        },
        {
          "accusedID": 910,
          "caseNum": 542,
          "fullName": "Dennis Haggerty",
          "first": "Dennis",
          "middle": "",
          "last": "Haggerty"
        },
        {
          "accusedID": 911,
          "caseNum": 542,
          "fullName": "Henry Dowling",
          "first": "Henry",
          "middle": "",
          "last": "Dowling"
        },
        {
          "accusedID": 912,
          "caseNum": 543,
          "fullName": "J. J. Robbins",
          "first": "J.",
          "middle": "J.",
          "last": "Robbins"
        },
        {
          "accusedID": 913,
          "caseNum": 543,
          "fullName": "Joseph Doan",
          "first": "Joseph",
          "middle": "",
          "last": "Doan"
        },
        {
          "accusedID": 913,
          "caseNum": 543,
          "fullName": "Joseph Doan",
          "first": "Joseph",
          "middle": "",
          "last": "Doane"
        },
        {
          "accusedID": 914,
          "caseNum": 543,
          "fullName": "McCrellis",
          "first": "",
          "middle": "",
          "last": "McCrellis"
        },
        {
          "accusedID": 915,
          "caseNum": 543,
          "fullName": "McCrellis",
          "first": "",
          "middle": "",
          "last": "McCrellis"
        },
        {
          "accusedID": 916,
          "caseNum": 543,
          "fullName": "McCrellis",
          "first": "",
          "middle": "",
          "last": "McCrellis"
        },
        {
          "accusedID": 917,
          "caseNum": 543,
          "fullName": "McCrellis",
          "first": "",
          "middle": "",
          "last": "McCrellis"
        },
        {
          "accusedID": 918,
          "caseNum": 544,
          "fullName": "Henry Planz",
          "first": "Henry",
          "middle": "",
          "last": "Planz"
        },
        {
          "accusedID": 919,
          "caseNum": 545,
          "fullName": "James Cummings",
          "first": "James",
          "middle": "",
          "last": "Cummings"
        },
        {
          "accusedID": 920,
          "caseNum": 546,
          "fullName": "B. H. Harrington",
          "first": "B.",
          "middle": "H.",
          "last": "Harrington"
        },
        {
          "accusedID": 920,
          "caseNum": 546,
          "fullName": "B. H. Harrington",
          "first": "B.",
          "middle": "H.",
          "last": "Petrie"
        },
        {
          "accusedID": 921,
          "caseNum": 547,
          "fullName": "Joseph Ciserich",
          "first": "Joseph",
          "middle": "",
          "last": "Ciserich"
        },
        {
          "accusedID": 921,
          "caseNum": 547,
          "fullName": "Joseph Ciserich",
          "first": "Marion",
          "middle": "",
          "last": "Ciserich"
        },
        {
          "accusedID": 921,
          "caseNum": 547,
          "fullName": "Joseph Ciserich",
          "first": "Joseph",
          "middle": "",
          "last": "Siserich"
        },
        {
          "accusedID": 922,
          "caseNum": 548,
          "fullName": "John M. Jones",
          "first": "John",
          "middle": "M.",
          "last": "Jones"
        },
        {
          "accusedID": 923,
          "caseNum": 549,
          "fullName": "Russell",
          "first": "",
          "middle": "",
          "last": "Russell"
        },
        {
          "accusedID": 924,
          "caseNum": 550,
          "fullName": "A. J. Sloan",
          "first": "A.",
          "middle": "J.",
          "last": "Sloan"
        },
        {
          "accusedID": 924,
          "caseNum": 550,
          "fullName": "A. J. Sloan",
          "first": "Frank",
          "middle": "",
          "last": "Sloan"
        },
        {
          "accusedID": 925,
          "caseNum": 550,
          "fullName": "Frank Henston",
          "first": "Frank",
          "middle": "",
          "last": "Henston"
        },
        {
          "accusedID": 925,
          "caseNum": 550,
          "fullName": "Frank Henston",
          "first": "Frank",
          "middle": "",
          "last": "Houston"
        },
        {
          "accusedID": 926,
          "caseNum": 550,
          "fullName": "William F. Cleveland",
          "first": "William",
          "middle": "F.",
          "last": "Cleveland"
        },
        {
          "accusedID": 926,
          "caseNum": 550,
          "fullName": "William F. Cleveland",
          "first": "William",
          "middle": "",
          "last": "Cleaveland"
        },
        {
          "accusedID": 926,
          "caseNum": 550,
          "fullName": "William F. Cleveland",
          "first": "William",
          "middle": "",
          "last": "Cleanes"
        },
        {
          "accusedID": 927,
          "caseNum": 551,
          "fullName": "John Ryan",
          "first": "John",
          "middle": "",
          "last": "Ryan"
        },
        {
          "accusedID": 928,
          "caseNum": 552,
          "fullName": "William Kid",
          "first": "William",
          "middle": "",
          "last": "Kid"
        },
        {
          "accusedID": 929,
          "caseNum": 553,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 930,
          "caseNum": 553,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 931,
          "caseNum": 553,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 932,
          "caseNum": 554,
          "fullName": "N. Gray",
          "first": "N.",
          "middle": "",
          "last": "Gray"
        },
        {
          "accusedID": 933,
          "caseNum": 555,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 934,
          "caseNum": 556,
          "fullName": "J. W. Bagley",
          "first": "J.",
          "middle": "W.",
          "last": "Bagley"
        },
        {
          "accusedID": 935,
          "caseNum": 556,
          "fullName": "James Thompson",
          "first": "James",
          "middle": "",
          "last": "Thompson"
        },
        {
          "accusedID": 935,
          "caseNum": 556,
          "fullName": "James Thompson",
          "first": "John",
          "middle": "",
          "last": "Thompson"
        },
        {
          "accusedID": 935,
          "caseNum": 556,
          "fullName": "James Thompson",
          "first": "Liverpool Jack",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 936,
          "caseNum": 556,
          "fullName": "John Stephens",
          "first": "John",
          "middle": "",
          "last": "Stephens"
        },
        {
          "accusedID": 937,
          "caseNum": 557,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 938,
          "caseNum": 558,
          "fullName": "John Fisher",
          "first": "John",
          "middle": "",
          "last": "Fisher"
        },
        {
          "accusedID": 939,
          "caseNum": 559,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 940,
          "caseNum": 560,
          "fullName": "Mick",
          "first": "Mick",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 941,
          "caseNum": 561,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 942,
          "caseNum": 562,
          "fullName": "George Johnson",
          "first": "George",
          "middle": "",
          "last": "Johnson"
        },
        {
          "accusedID": 943,
          "caseNum": 563,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 944,
          "caseNum": 564,
          "fullName": "Unknown",
          "first": "",
          "middle": "",
          "last": "Unknown"
        },
        {
          "accusedID": 945,
          "caseNum": 565,
          "fullName": "Frederick Soltmore",
          "first": "Frederick",
          "middle": "",
          "last": "Soltmore"
        },
        {
          "accusedID": 945,
          "caseNum": 565,
          "fullName": "Frederick Soltmore",
          "first": "Frederick",
          "middle": "",
          "last": "Salkman"
        },
        {
          "accusedID": 945,
          "caseNum": 565,
          "fullName": "Frederick Soltmore",
          "first": "Frederick",
          "middle": "",
          "last": "Salkmyer"
        },
        {
          "accusedID": 945,
          "caseNum": 565,
          "fullName": "Frederick Soltmore",
          "first": "Mountain Jim",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 945,
          "caseNum": 565,
          "fullName": "Frederick Soltmore",
          "first": "Flat Foot",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 945,
          "caseNum": 565,
          "fullName": "Frederick Soltmore",
          "first": "Dutch Fred",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 946,
          "caseNum": 565,
          "fullName": "James Cochrane",
          "first": "James",
          "middle": "",
          "last": "Cochrane"
        },
        {
          "accusedID": 946,
          "caseNum": 565,
          "fullName": "James Cochrane",
          "first": "James",
          "middle": "",
          "last": "Cochran"
        },
        {
          "accusedID": 947,
          "caseNum": 565,
          "fullName": "James Niel",
          "first": "James",
          "middle": "",
          "last": "Niel"
        },
        {
          "accusedID": 947,
          "caseNum": 565,
          "fullName": "James Niel",
          "first": "James",
          "middle": "",
          "last": "Neal"
        },
        {
          "accusedID": 948,
          "caseNum": 565,
          "fullName": "James Wilson",
          "first": "James",
          "middle": "",
          "last": "Wilson"
        },
        {
          "accusedID": 948,
          "caseNum": 565,
          "fullName": "James Wilson",
          "first": "Mountain Jim",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 949,
          "caseNum": 565,
          "fullName": "Jerome Boland",
          "first": "Jerome",
          "middle": "",
          "last": "Boland"
        },
        {
          "accusedID": 949,
          "caseNum": 565,
          "fullName": "Jerome Boland",
          "first": "James",
          "middle": "",
          "last": "Boland"
        },
        {
          "accusedID": 950,
          "caseNum": 566,
          "fullName": "Bill Carr",
          "first": "Bill",
          "middle": "",
          "last": "Carr"
        },
        {
          "accusedID": 951,
          "caseNum": 566,
          "fullName": "C. P. Duane",
          "first": "C.",
          "middle": "P.",
          "last": "Duane"
        },
        {
          "accusedID": 951,
          "caseNum": 566,
          "fullName": "C. P. Duane",
          "first": "Charles",
          "middle": "P.",
          "last": "Duane"
        },
        {
          "accusedID": 952,
          "caseNum": 566,
          "fullName": "Edgar Bulger",
          "first": "Edgar",
          "middle": "",
          "last": "Bulger"
        },
        {
          "accusedID": 952,
          "caseNum": 566,
          "fullName": "Edgar Bulger",
          "first": "Edward",
          "middle": "",
          "last": "Bulger"
        },
        {
          "accusedID": 952,
          "caseNum": 570,
          "fullName": "Edgar Bulger",
          "first": "Edgar",
          "middle": "",
          "last": "Bulger"
        },
        {
          "accusedID": 952,
          "caseNum": 570,
          "fullName": "Edgar Bulger",
          "first": "Edward",
          "middle": "",
          "last": "Bulger"
        },
        {
          "accusedID": 953,
          "caseNum": 566,
          "fullName": "Martin Gallagher",
          "first": "Martin",
          "middle": "",
          "last": "Gallagher"
        },
        {
          "accusedID": 954,
          "caseNum": 566,
          "fullName": "William Mulligan",
          "first": "William",
          "middle": "",
          "last": "Mulligan"
        },
        {
          "accusedID": 955,
          "caseNum": 566,
          "fullName": "Wooley Kearney",
          "first": "Wooley",
          "middle": "",
          "last": "Kearney"
        },
        {
          "accusedID": 956,
          "caseNum": 567,
          "fullName": "Bill Lewis",
          "first": "Bill",
          "middle": "",
          "last": "Lewis"
        },
        {
          "accusedID": 957,
          "caseNum": 567,
          "fullName": "John Crowe",
          "first": "John",
          "middle": "",
          "last": "Crowe"
        },
        {
          "accusedID": 958,
          "caseNum": 567,
          "fullName": "John Lawler",
          "first": "John",
          "middle": "",
          "last": "Lawler"
        },
        {
          "accusedID": 959,
          "caseNum": 567,
          "fullName": "Terrence Kelley",
          "first": "Terrence",
          "middle": "",
          "last": "Kelley"
        },
        {
          "accusedID": 960,
          "caseNum": 567,
          "fullName": "Willliam Hamilton",
          "first": "Willliam",
          "middle": "",
          "last": "Hamilton"
        },
        {
          "accusedID": 961,
          "caseNum": 568,
          "fullName": "Alex Purple",
          "first": "Alex",
          "middle": "",
          "last": "Purple"
        },
        {
          "accusedID": 962,
          "caseNum": 568,
          "fullName": "Dan Aldrich",
          "first": "Dan",
          "middle": "",
          "last": "Aldrich"
        },
        {
          "accusedID": 963,
          "caseNum": 568,
          "fullName": "J. R. Maloney",
          "first": "J.",
          "middle": "R.",
          "last": "Maloney"
        },
        {
          "accusedID": 964,
          "caseNum": 568,
          "fullName": "Lewis Mahoney",
          "first": "Lewis",
          "middle": "",
          "last": "Mahoney"
        },
        {
          "accusedID": 965,
          "caseNum": 568,
          "fullName": "T. B. Cunningham",
          "first": "T.",
          "middle": "B.",
          "last": "Cunningham"
        },
        {
          "accusedID": 966,
          "caseNum": 568,
          "fullName": "Tom Mulloy",
          "first": "Tom",
          "middle": "",
          "last": "Mulloy"
        },
        {
          "accusedID": 966,
          "caseNum": 569,
          "fullName": "Abraham Kraft",
          "first": "Abraham",
          "middle": "",
          "last": "Kraft"
        },
        {
          "accusedID": 967,
          "caseNum": 569,
          "fullName": "Abraham Kraft",
          "first": "Abraham",
          "middle": "",
          "last": "Craft"
        },
        {
          "accusedID": 968,
          "caseNum": 569,
          "fullName": "James Burke",
          "first": "James",
          "middle": "",
          "last": "Burke"
        },
        {
          "accusedID": 968,
          "caseNum": 569,
          "fullName": "James Burke",
          "first": "Activity",
          "middle": "",
          "last": ""
        },
        {
          "accusedID": 969,
          "caseNum": 569,
          "fullName": "James White",
          "first": "James",
          "middle": "",
          "last": "White"
        },
        {
          "accusedID": 970,
          "caseNum": 569,
          "fullName": "William F. Mclean",
          "first": "William",
          "middle": "F.",
          "last": "Mclean"
        },
        {
          "accusedID": 971,
          "caseNum": 570,
          "fullName": "Chris Lily",
          "first": "Chris",
          "middle": "",
          "last": "Lily"
        },
        {
          "accusedID": 972,
          "caseNum": 570,
          "fullName": "Henry F. Foy",
          "first": "Henry",
          "middle": "F.",
          "last": "Foy"
        },
        {
          "accusedID": 972,
          "caseNum": 570,
          "fullName": "Henry F. Foy",
          "first": "H.",
          "middle": "F.",
          "last": "Toy"
        },
        {
          "accusedID": 973,
          "caseNum": 570,
          "fullName": "John Cooney",
          "first": "John",
          "middle": "",
          "last": "Cooney"
        },
        {
          "accusedID": 974,
          "caseNum": 570,
          "fullName": "Michael Brannegan",
          "first": "Michael",
          "middle": "",
          "last": "Brannegan"
        },
        {
          "accusedID": 974,
          "caseNum": 570,
          "fullName": "Michael Brannegan",
          "first": "Michael",
          "middle": "",
          "last": "Brannigan"
        }
       ];
};