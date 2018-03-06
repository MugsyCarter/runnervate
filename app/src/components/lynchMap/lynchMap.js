import template from './lynchMap.html';

export default {
    template,
    controller
};

controller.$inject = ['lynchService', '$timeout', '$rootScope', 'googleMapsUrl', 'NgMap'];

function controller(lynchSvc, timeout, rootScope, googleMapsUrl, NgMap) {
    this.mapURL=googleMapsUrl;
    this.incident=null;

    this.races = rootScope.races;
    this.states = rootScope.states;
    this.counties = rootScope.counties;
    this.weapons = rootScope.weapons;

    console.log('this is ', this);

    rootScope.$on('locationUpdated', (event, location)=>{
        console.log('broadcast recieved', location);
        this.incident = location;
        console.log('and this is ', this);
    });


    this.updateMap= (incidents) =>{
        console.log('incidents loaded: ', incidents);
        NgMap.getMap().then(function(map) {
            console.log(map.getCenter());
            //remove old markers
            if(map.markers){
                map.markers.forEach((marker)=>{
                    marker.setMap(null);
                });
            }
            map.markers = [];
            console.log('map is ', map);
            console.log('markers', map.markers);
            console.log('shapes', map.shapes);
            console.log('class', map.class);

            for (let i =0; i < incidents.length; i++){
                console.log('add marker called');
                let newMarker = new google.maps.Marker({
                    title: incidents[i].suspectNames
                });
            
                newMarker.addListener('click', function() {
                    map.setZoom(10);
                    map.setCenter(newMarker.getPosition());
                    // alert(incidents[i].year + incidents[i].place + incidents[i].county + incidents[i].suspectNames);
                    this.location = incidents[i];
                    rootScope.$emit('updateLocation', this.location);
                    console.log('this.location', this.location);
                });

                var bounds = new google.maps.LatLngBounds();
                var lat = incidents[i].latDecimal;
                var lng = incidents[i].lonDecimal;
                var latlng = new google.maps.LatLng(lat, lng);
                newMarker.setPosition(latlng);
                map.markers.push(newMarker);
                // newMarker.setMap(map);
                bounds.extend(latlng);
            };
            console.log('map is ', map);
            console.log('markers are', map.markers);
            //add new markers
            map.markers.forEach((marker)=>{
                marker.setMap(map);
            });
        });
   
    };
    
    this.updateMapIncidents = ()=>{
        rootScope.map = true;
        rootScope.searchIncidents();
    };
   
    rootScope.$on('incidentsUpdated', (event, incidents)=>{
        console.log('incident update broadcast recieved', incidents);
        this.incidents = incidents;
        this.updateMap(this.incidents);
    });

    this.updateMapIncidents();
 
}


