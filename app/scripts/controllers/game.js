'use strict';

angular.module('webFrisbApp')
  .controller('GameCtrl', function ($scope,$rootScope,$location,$timeout,locationService,gameService, Global) {
    $scope.game = {
      'place': Global.location,
      'date': moment().lang('fi').format('YYYY-MM-DD'),
      'players':[],
      'fairways':[],
      'id': null
    }
    
    $scope.orderProp = 'index';
    $scope.colors = {
        'positive':'success',
        'neutral':'default',
        'negative':'danger'
    };
    $scope.addPlayer = function(){
    	if($scope.temp && $scope.temp.playername != ""){
    		var player = {};
	    	player.name = $scope.temp.playername;
	    	player.score = 0;
	    	player.fairways = [];
	    	$scope.game.players.push(player);
	    	$scope.temp.playername = "";
        $('#playerlistmarks').append("<span id='"+player.name+"-icon' class='fa fa-child'></span>")
    	};
    };
    $scope.addPlayersToStorage = function(){
      localforage.getItem('players').then(function(players){
          for(var i = 0 ; i<$scope.game.players.length; i++){
            if(players === null){
              var index = -1
            }else{
              var index = $scope.indexOfPlayer($scope.game.players[i].name,players)  
            }
            if(index === -1){
              //lisää
              var p = {}
              p.name=$scope.game.players[i].name
              p.times = 1
              if(players === null){
                players = []
              }
              players.push(p)
            }else{
              //päivitä
              players[i].times++
            }
            localforage.setItem('players',players);
          }  
        
      })
    }
    $scope.indexOfPlayer = function(name,store){
      for(var i = 0 ; i<store.length ; i++){
        if(store[i].name === name){
          return i;
        }
      }
      return -1;
    }
    $scope.continue = function(){
      localforage.getItem('times_played').then(function(times){
        if(times !== null){
          times++
        }else{
          times = 1
        }
        localforage.setItem('times_played',times)
      })
      $scope.addPlayersToStorage()
      $('#startingGame').hide();
      $('#prepGameHeader').hide();
      $('#game').show();
      
    }
    $scope.addValueTo = function(elementId, addValue){
      var e = $('#'+elementId);
      var curr_val = new Number(e.val());
      curr_val += addValue;
      if(curr_val > 0){
        e.val(curr_val)
      }
    }
    $scope.changeTempScore = function(name,score){
      var scoreBtn = name+'TempScore';
      $scope.addValueTo(scoreBtn,score);
    };
    $scope.nextFairway = function(){
      if($scope.legalMove()){
        $scope.saveFairway()
      }else{
        $scope.generatePopup('notify-popup')
      }
        
    }
    $scope.legalMove = function(){
      for(var i = 0 ; i<$scope.game.players.length; i++){
        if($('#'+$scope.game.players[i].name+'TempScore').val() < 1){
          return false
        }
      }
      return true
    }
    $scope.saveFairway = function(){
      var fairway = {}
      fairway.par = $('#parBtn').val()
      for(var i = 0 ; i<$scope.game.players.length; i++){
        var name = $scope.game.players[i].name
        var score = $('#'+name+'TempScore').val()
        fairway[name] = score
        $scope.game.players[i].score += score - fairway.par 
        $('#'+name+'TempScore').val(0);
      }
      if($scope.game.fairways.length == 0){
        fairway.index = 1  
      }else{
        fairway.index = $scope.game.fairways.length + 1
      }
      $scope.game.fairways.push(fairway)
      gameService.setGame($scope.game).then(function(g){
        $scope.initNextFairway()
      })

    }
    
  
    $scope.initNextFairway = function(){
      $scope.changePlayerScoreBtn()
      $('#parBtn').val(3)
      $scope.colorMiniScores()
    }
    $scope.colorMiniScores = function(){
      for(var i = 0 ; i<$scope.game.players.length ; i++){
        var p = $scope.game.players[i]
        var score = p.score
        if(score === 0){
          $('#miniscore_'+p.name).attr("class","label alert-info")
        }else if(score > 0){
          $('#miniscore_'+p.name).attr("class","label alert-danger")
        }else{
          $('#miniscore_'+p.name).attr("class","label alert-success")
        }
      }
    }
    $scope.changePlayerScoreBtn = function(){
      for(var i = 0 ; i<$scope.game.players.length; i++){
        var el = $('#'+$scope.game.players[i].name+'_score')
        el.removeClass()
        el.addClass('label label-'+$scope.colorByValue($scope.game.players[i].score))
      }
    }
    $scope.toggleScoreTable = function(){
      $('#scoreTable table').toggle()
      if(!Modernizr.fontface){
        if($('#scoreTable button span').html() == 'open'){
          $('#scoreTable button span').html('close')
        }else{
          $('#scoreTable button span').html('open')
        }
      }else{
        $('#scoreTable button span').toggleClass('fa fa-chevron-up')
        $('#scoreTable button span').toggleClass('fa fa-chevron-down')  
      }
    }

    $scope.colorScore = function(score,elid,par){
      $('#'+elid).addClass($scope.colorByValue(score-par))
      return score
    }
    $scope.colorTotal = function(score,elid,par){
      $('#'+elid).addClass($scope.colorByValue(score-par));
      return score-par;
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
    $scope.colorByValue = function(value){
        if(value > 0){
            return $scope.colors.negative
        }else if(value == 0){
            return $scope.colors.neutral
        }else{
            return $scope.colors.positive
        }
    }
    $scope.initLastGame = function(){
      gameService.getGame().then(function(game){
        $scope.game = game;
        var prom = $timeout(function(){
          $scope.continue()
          $timeout.cancel(prom)
        },5);
      },function(err){
        if(Global.players !== undefined){
            for(var i = 0 ; i<Global.players.length; i++){
              var player = {}
              player.name = Global.players[i]
              player.score = 0
              player.fairways = []
              $scope.game.players.push(player)
              $('#playerlistmarks').append("<span id='"+player.name+"-icon' class='fa fa-child'></span>")
            }
          }
      })
    }
    $scope.endGame = function(){
      if($scope.legalMove()){
        $scope.nextFairway();
      }
      $scope.generatePopup('exit-popup')
    }
    $scope.saveGame = function(){
      $scope.closePopup();
      gameService.getGames().then(function(games){
        if(games === null || games.length === 0){
          $scope.game.id = 1
        }else{
          var id = games[games.length-1].id
          id++;
          $scope.game.id += id
        }
        gameService.addGame($scope.game).then(function(games){
          $rootScope.game = $scope.game
          gameService.setGame(null).then(function(n){
            $location.path('/View')
          })
        })
      })
      
    }
    $scope.formatDate = function(date){
        return moment(date).lang('fi').format('dd DD.MM.YYYY')
    }
    $scope.tempscore = {
      player: {},
      fairway: {}
    }
    $scope.changeScore = function(score){
      $scope.tempscore.player = $(this)[0].$parent.p
      $scope.tempscore.fairway = $(this)[0].fairway
      $('#modifyscore_playertag').html($scope.tempscore.player.name)
      $('#modifyscore_fairwaytag').html('Fairway '+$scope.tempscore.fairway.index)
      $('#modifyscore_tempscore').val($scope.tempscore.fairway[$scope.tempscore.player.name])
      $scope.generatePopup('modify-score-popup')
    }
    $scope.modifyScore = function(){
      var tempscore = $('#modifyscore_tempscore').val()
      var i = $.inArray($scope.tempscore.fairway,$scope.game.fairways)
      $scope.game.fairways[i][$scope.tempscore.player.name] = tempscore
    }
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
    $scope.deletePlayer = function(name){
      for(var i = 0 ; i < $scope.game.players.length ; i++){
        if(name === $scope.game.players[i].name){
          $scope.game.players.splice(i,1)
          break;
        }
      }
      $('#'+name+'-icon').remove()
    }
    $scope.initLastGame();


  });
