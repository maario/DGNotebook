'use strict';

angular
  .module('webFrisbApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'geolocation'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/Game',{
        templateUrl: 'views/game.html',
        controller: 'GameCtrl'
      })
      .when('/History',{
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl'
      })
      .when('/View',{
        templateUrl: 'views/view.html',
        controller: 'ViewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
