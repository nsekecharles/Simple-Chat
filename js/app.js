/**
	Principal module
*/

define(['angular',
    	'socketio',
		'ngResource',
		'ngRoute',
    	'velocity'], 
	function (angular, io) {
	'use strict';

	var simpleChat = angular.module('simpleChat',[
												'ngResource', 
												'ngRoute']);

	simpleChat.config(function($locationProvider, $routeProvider) {
		
		$locationProvider.html5Mode(true);

		$routeProvider.when('/SimpleChat', {
                    templateUrl : '../index.html'
                });
	});

	simpleChat.controller('mainCtrl', ['$scope', '$location', function($scope, $location) {
			
				
	}]);

	return simpleChat;

});

