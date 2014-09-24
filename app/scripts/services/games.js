'use strict';

angular.module('webFrisbApp')
	.factory('gameService',['$q','$rootScope',function($q,$rootScope){
		return{
			getGames: function(){
				var deferred = $q.defer();
				localforage.getItem('games').then(function(games){
					$rootScope.$apply(function(){deferred.resolve(games)})
				})
				return deferred.promise
			},
			addGame: function(game){
				var deferred = $q.defer();
				this.getGames().then(function(games){
					if(games === null){
						games = []
					}
					games.push(game)
					localforage.setItem('games',games).then(function(games){
						$rootScope.$apply(function(){deferred.resolve(games)})
					})
				})
				return deferred.promise
			},
			setGame: function(game){
				var deferred = $q.defer();
				localforage.setItem('game',game).then(function(game){
					$rootScope.$apply(function(){deferred.resolve(game)})
				})
				return deferred.promise
			},
			getGame: function(){
				var deferred = $q.defer();
				localforage.getItem('game').then(function(game){
					if(game === null){
						$rootScope.$apply(function(){deferred.reject("There's no active game")})
					}else{
						$rootScope.$apply(function(){deferred.resolve(game)})
					}
				})
				return deferred.promise
			},
			setGames: function(games){
				var deferred = $q.defer();
				localforage.setItem('games',games).then(function(games){
					$rootScope.$apply(function(){deferred.resolve(games)})
				})
				return deferred.promise
			},
			deleteGame: function(game){
				var deferred = $q.defer();
				this.getGames().then(function(games){
					games.splice($.inArray(game,games),1)
					this.setGames(games).then(function(newgames){
						$rootScope.$apply(function(){deferred.resolve(newgames)})
					})
				})
				return deferred.promise
			}
		}
	}]);