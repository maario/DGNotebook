'use strict';

angular.module('webFrisbApp')
  .controller('MainCtrl', function ($scope,$rootScope,$location,$timeout,gameService) {
    gameService.getGames().then(function(games){
      $scope.games = games
    })
    $scope.orderProp = 'date'
    $scope.continue = function(){
      $location.path('/View')
    }; 
    $scope.formatDate = function(date){
      return moment(date).lang('fi').format('DD.MM.YYYY');
    };
    $scope.viewHistory = function(game){
      $scope.game = $(this)[0].game;
      $rootScope.game = $scope.game;
      $scope.continue();
    };
    
  });