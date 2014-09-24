'use strict';

angular.module('webFrisbApp')
  .controller('HistoryCtrl', function ($scope, $rootScope,$location,$timeout,gameService) {
    $scope.orderProp = 'date'
    gameService.getGames().then(function(games){
      $scope.games = games
    })
    $scope.continue = function(){
      $location.path('/View')
    }; 
    $scope.formatDate = function(date){
      return moment(date).lang('fi').format('dd DD.MM.YYYY');
    };
    $scope.viewHistory = function(game){
      $scope.game = $(this)[0].game;
      $rootScope.game = $scope.game;
      $scope.continue();
    };
  });
