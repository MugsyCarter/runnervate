import template from './addTrip.html';

export default {
    template,
    controller
};

controller.$inject = [ '$rootScope', 'tripService', '$state'];

function controller(rootScope, tripSvc, $state) {
    this.trip = {
        name: null,
        type: null,
        start: null,
        end: null,
        description: null,
        mileage: null,
        people: [],
        fun: null,
        scenery: null,
        difficulty: null,
        overall: null,
        comments: [],
        photos: [],
        activities: []
    };
  
    this.addThisTrip= ()=>{
        console.log('adding this trip ', this.trip);
        // return tripSvc.addTrip(this.trip)
        //     .then((trip)=>{
        //         console.log('this trip was added to the DB ', trip);
        //     });
    };

          
    this.initAutocomplete = ()=>{
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -33.8688, lng: 151.2195},
            zoom: 13,
            mapTypeId: 'roadmap'
        });
    
            // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
            // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });
    
        var markers = [];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
    
            if (places.length == 0) {
                return;
            }
    
                // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];
    
                // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log('Returned place contains no geometry');
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
    
                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));
    
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    };

    this.mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(41.923, 12.513),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    
    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

    console.log('map is ', this.map);

    this.initAutocomplete();

};