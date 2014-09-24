'use strict';

angular.module('webFrisbApp')
  .controller('ViewCtrl', function ($scope, $rootScope,$location,$timeout,gameService) {
    $scope.game = $rootScope.game;
    if($scope.game === undefined){
      $location.path('/History')
    }
    $scope.colors = {
      'positive':'success',
      'neutral':'default',
      'negative':'danger'
    };
    $scope.colorTotal = function(score,elid,par){
      $('#'+elid).addClass($scope.colorByValue(score-par));
      return score-par;
    };
    $scope.colorScore = function(score,elid,par){
      $('#'+elid).addClass($scope.colorByValue(score-par));
      return score;
    };
    $scope.colorByValue = function(value){
      if(value > 0){
        return $scope.colors.negative;
      }else if(value === 0){
        return $scope.colors.neutral;
      }else{
        return $scope.colors.positive;
      }
    };
    $scope.formatDate = function(date){
      return moment(date).lang('fi').format('DD.MM.YYYY');
    };
    $scope.indexIn = function(o,a){
      for(var i = 0 ; i<a.length; i++){
        if(a[i].id === o.id){
          return i
        }
      }
      return -1
    }
    $scope.delete = function(){
      $scope.closePopup();
      gameService.getGames().then(function(games){
        games.splice($scope.indexIn($scope.game,games),1);
        gameService.setGames(games).then(function(games){
          $location.path('/History')
        })
      })
    };
    $scope.confirmDelete = function(){
      $scope.game = $(this)[0].game;
      $scope.generatePopup('delete-popup');
    };
    
    $scope.getTotalsumOfPars = function(){
      var sum = new Number(0);
      for(var i = 0 ; i<$scope.game.fairways.length; i++){
        var par = new Number($scope.game.fairways[i].par);
        sum += par;
      };
      return sum;
    };
    $scope.getTotalScore = function(name){
      var sum = 0;
      for(var i = 0 ; i<$scope.game.fairways.length; i++){
        var score  = new Number($scope.game.fairways[i][name]);
        sum += score;
      };
      return sum;
    };
    $scope.closePopup = function(){
      $.magnificPopup.close()
    }
    $scope.generatePopup = function(popid){
      $.magnificPopup.open({
          items: {
            src: '#'+popid
          },
          modal: true,
          type: 'inline',
          closeBtnInside:true
        });
    }
  });
