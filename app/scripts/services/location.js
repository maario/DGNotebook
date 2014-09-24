'use strict';

angular.module('webFrisbApp')
	.factory('locationService',['$q','$rootScope','geolocation',function($q,$rootScope,geolocation){
		return{
			getCityName: function(){
				var deferred = $q.defer();
				geolocation.getLocation().then(function(pos){
					var lat = pos.coords.latitude;
					var lng = pos.coords.longitude;
					var latlng = new google.maps.LatLng(lat,lng);
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode({'latLng':latlng}, function(results,status){
						if(status === google.maps.GeocoderStatus.OK){
							if(results[2]){
								for(var i = 0; i<results[2].address_components.length; i++){
									for(var b = 0 ; b<results[2].address_components[i].types.length;b++){
										if(results[2].address_components[i].types[b] === "locality"){
											//this is the object looking for:
											$rootScope.$apply(function(){
												deferred.resolve(results[2].address_components[i])
											})
											results[2].address_components[i]
											break;
										}
									}
								}
							}else{
								//no results
								$rootScope.$apply(function(){
									deferred.reject('No results found')
								})
							}
						}else{
							//geocoder failed due to 'status'
							$rootScope.$apply(function(){
								deferred.reject('Geocoder failed due to: ' +status)
							})
						}
						
					})
				})
			return deferred.promise
			}
		}
		
	}]);