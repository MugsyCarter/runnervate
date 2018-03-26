import angular from 'angular';
import './scss/main.scss';
import components from './components';
import services from './services';
import uiRouter from 'angular-ui-router';
import ngmap from 'ngmap';
import routes from './routes'; 


//import defaultRoute from 'angular-ui-router-default';
import 'angular-ui-router/release/stateEvents';


const app = angular.module('myApp', [components, services, uiRouter, ngmap]);

//switch between these two lines to switch between local host and heroku api urls
app.value('apiUrl', 'http://localhost:3000/api');
//app.value('apiUrl', 'https://runOn.herokuapp.com/api');

app.value('googleMapsUrl', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC2HGq4Hh7k7CUBs6VNkEJDI6UbPchNQyY');

app.config(routes);

//route debugger
app.run(function($rootScope) {
    $rootScope.$on('$stateChangeError', console.log.bind(console));
});

