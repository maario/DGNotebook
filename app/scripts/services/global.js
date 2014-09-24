'use strict';

//Global service for global variables
angular.module('webFrisbApp').factory('Global', [ 'locationService',
    function(locationService) {
        var _this = this;
        _this._data = {
            location: null,
            players: []
        };
        localforage.getItem('players').then(function(players){
          if(players !== null){
            localforage.getItem('times_played').then(function(times_played){
              for(var i = 0 ; i<players.length ; i++){
                if(players[i].times / times_played > 0.5){
                  _this._data.players.push(players[i].name)
                }
              }
            })
          }
        })
        locationService.getCityName().then(function(p){
          _this._data.location = p.long_name
        })
        return _this._data;
    }
]);
