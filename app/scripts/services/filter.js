'use strict';

angular.module('webFrisbApp')
	.filter('scoreFilter',[function(){
		return function(input){
			console.log(input)
			return true
		}
	}]);