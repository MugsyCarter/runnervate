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
                        title: incidents[i].suspectNames
                    });
            
                    newMarker.addListener('click', function() {
                        map.setZoom(10);
                        map.setCenter(newMarker.getPosition());
                        // alert(incidents[i].year + incidents[i].place + incidents[i].county + incidents[i].suspectNames);
                        this.location = incidents[i];
                        rootScope.$emit('updateLocation', this.location);
                        console.log('this.incident', this.location);
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
    });
    
}


