import template from './about.html';


export default {
    template,
    controller
};


controller.$inject = ['$scope', '$log', 'uiGmapGoogleMapApiProvider'];

function controller($scope, $log, GoogleMapApi) {
    angular.extend($scope, {
        map: {center: 
        {
            latitude: 40.1451, 
            longitude: -99.6680  
        }, 
            zoom: 4 
        },
        searchbox: { 
            template:'searchbox.tpl.html', 
            events:{
                places_changed: function (searchBox) {}
            }
        },
        options: {
            scrollwheel: false
        }
    });
    
    GoogleMapApi.then(function(maps) {
        maps.visualRefresh = true;
    });
};