import template from './lynchMap.html';

export default {
    template,
    controller
};

controller.$inject = ['lynchService', '$timeout', '$rootScope', 'googleMapsUrl', 'NgMap'];

function controller(lynchSvc, timeout, rootScope, googleMapsUrl, NgMap) {
    this.incident = null;

  

    lynchSvc.get()
    .then((incidents) => {
        this.incidents = incidents;
        console.log('incidents loaded: ', this.incidents);
        NgMap.getMap().then(function(map) {
            console.log(map.getCenter());
            console.log('markers', map.markers);
            console.log('shapes', map.shapes);
            console.log('class', map.class);

            for (let i =0; i < incidents.length; i++){
                    console.log('add marker called');
                    let newMarker = new google.maps.Marker({
                        title: "Hi marker "
                    });
            
                    newMarker.addListener('click', function() {
                        map.setZoom(10);
                        map.setCenter(newMarker.getPosition());
                        alert(incidents[i].year + incidents[i].place + incidents[i].county + incidents[i].suspectNames);
                        this.incident = incidents[i];
                        rootScope.$emit('updateLocation', this.incident);
                        console.log('this.incident', this.incident);
                      });

                    var bounds = new google.maps.LatLngBounds();
                    var lat = incidents[i].latDecimal;
                    var lng = incidents[i].lonDecimal;
                    var latlng = new google.maps.LatLng(lat, lng)
                    newMarker.setPosition(latlng);
                    newMarker.setMap(map);
                    bounds.extend(latlng);
                };
        });
        this.incident = rootScope.location;
    });
    



    // for (var i=0; i<8 ; i++) {
    //   markers[i] = new google.maps.Marker({
    //     title: "Hi marker " + i
    //   })
    // }
    // this.GenerateMapMarkers = function() {
    //     var numMarkers = Math.floor(Math.random() * 4) + 4;  // betwween 4 & 8 of them
    //      var bounds = new google.maps.LatLngBounds();

    //     for (i = 0; i < numMarkers; i++) {
    //         var lat =   1.280095 + (Math.random()/100);
    //         var lng = 103.850949 + (Math.random()/100);
    //         // You need to set markers according to google api instruction
    //         // you don't need to learn ngMap, but you need to learn google map api v3
    //         // https://developers.google.com/maps/documentation/javascript/markers
    //         var latlng = new google.maps.LatLng(lat, lng);
    //         markers[i].setPosition(latlng);
    //         markers[i].setMap(this.map);
    //         bounds.extend(latlng);
    //     }
        
    //     var centre = bounds.getCenter();
    //     this.map.setCenter(centre);
    // };  
    
    // timeout( this.GenerateMapMarkers, 2000);
  


    

    // var markers = [];
            
    // for (var i=0; i<8 ; i++) {
    //   markers[i] = new google.maps.Marker({
    //     title: "Hi marker " + i
    //   })
    // }
    // this.GenerateMapMarkers = function() {
    //     var numMarkers = Math.floor(Math.random() * 4) + 4;  // betwween 4 & 8 of them
    //      var bounds = new google.maps.LatLngBounds();

    //     for (i = 0; i < numMarkers; i++) {
    //         var lat =   1.280095 + (Math.random()/100);
    //         var lng = 103.850949 + (Math.random()/100);
    //         // You need to set markers according to google api instruction
    //         // you don't need to learn ngMap, but you need to learn google map api v3
    //         // https://developers.google.com/maps/documentation/javascript/markers
    //         var latlng = new google.maps.LatLng(lat, lng);
    //         markers[i].setPosition(latlng);
    //         markers[i].setMap(this.map);
    //         bounds.extend(latlng);
    //     }
        
    //     var centre = bounds.getCenter();
    //     this.map.setCenter(centre);
    // };  
    
    // timeout( this.GenerateMapMarkers, 2000);

    //     });
    // });



    this.mapURL =  googleMapsUrl;

    this.fart = ()=>{
        alert('fart');
        console.log('fart complete');
    }
    

   

    // google.maps.event.trigger(map, “resize”);


    // this.newFilter = false;
    // this.activeFilter = null;

    // this.queryNumber=-1; 

    // this.incidents = [];
    

    // this.newQuery = {
    //     category: null,
    //     target: null,
    //     number: null
    // };

    // this.queries = [];

    // this.filters = [
    //     {
    //         name: 'year',
    //         value: 'year'
    //     },
    //     {
    //         name: 'county',
    //         value: 'county'
    //     },
    //     {
    //         name: 'place',
    //         value: 'place'
    //     }
    // ];
   
    // this.oldCounties = ['Alameda County', 'Alpine County',
    //     'Amador County',
    //     'Butte County',
    //     'Calaveras County',
    //     'Colusa County',
    //     'Contra Costa County',
    //     'Del Norte County',
    //     'El Dorado County',
    //     'Fresno County',
    //     'Glenn County',
    //     'Humboldt County',
    //     'Imperial County',
    //     'Inyo County',
    //     'Kern County',
    //     'Kings County',
    //     'Lake County',
    //     'Lassen County',
    //     'Los Angeles County',
    //     'Madera County',
    //     'Marin County',
    //     'Mariposa County',
    //     'Mendocino County',
    //     'Merced County',
    //     'Modoc County',
    //     'Mono County',
    //     'Monterey County',
    //     'Napa County',
    //     'Nevada County',
    //     'Orange County',
    //     'Placer County',
    //     'Plumas County',
    //     'Riverside County',
    //     'Sacramento County',
    //     'San Benito County',
    //     'San Bernardino County',
    //     'San Diego County',
    //     'San Francisco County',
    //     'San Joaquin County',
    //     'San Luis Obispo County',
    //     'San Mateo County',
    //     'Santa Barbara County',
    //     'Santa Clara County',
    //     'Santa Cruz County',
    //     'Shasta County',
    //     'Sierra County',
    //     'Siskiyou County',
    //     'Solano County',
    //     'Sonoma County',
    //     'Stanislaus County',
    //     'Sutter County',
    //     'Tehama County',
    //     'Trinity County',
    //     'Tulare County',
    //     'Tuolumne County',
    //     'Ventura County',
    //     'Yolo County',
    //     'Yuba County'];

    // this.counties = [];

    // this.oldCounties.forEach((county)=>{
    //     let arr = county.split(' ');
    //     arr.pop();
    //     let str = arr.join(' ');
    //     this.counties.push(str);
    // });
    
    // this.classes = ['btn btn-primary', 'btn btn-secondary', 'btn btn-warning', 'btn btn-danger'];

    // this.buttonClass = 'btn btn-outline-primary';

    // this.addFilter = ()=>{
    //     this.newFilter=true;
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
    //             catergory: null,
    //             target: null,
    //             number: null
    //         };
    //         console.log('filters are ', this.filters);
    //     }
    // };

    // this.removeFilter = (filter)=>{
    //     console.log('removing this filter ', filter);

    //     this.filters.push(filter.category);

    //     let index = this.queries.findIndex((query)=>{
    //         console.log('query name is ' + query.category.name + ' and filter name is ' + filter.category.name);
    //         return query.category.name === filter.category.name;
    //     });

    //     this.queries.splice(index,1);

    // };

    // this.showIncident= (incident)=>{
    //     incident.fullView = true;
    // };

    // this.hideIncident= (incident)=>{
    //     incident.fullView = false;
    // };

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
    //         });
         
    // };

    // lynchSvc.get()
    //     .then((incidents)=>{
    //         this.incidents=incidents;
    //         console.log(this.incidents);
    //         this.incidentNumber = this.incidents.length;
    //         let sorted = this.incidents.sort((a,b)=>{
    //             return parseInt(a.year) > parseInt(b.year);
    //         });
    //         this.incidents = sorted;
    //     });



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


