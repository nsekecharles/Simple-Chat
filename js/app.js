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

		$routeProvider.when('/home', {
                    templateUrl : '/home.html'
                });
	});

	

	simpleChat.controller('mainCtrl', ['$scope', '$location', function($scope, $location) {
		
		$scope.user = {};
		$scope.user.userName = '';
		$scope.nameUsed = false;
		$scope.msg = '';
		$scope.messages = [];

		var socket = io.connect('http://localhost:4490/');
		
		$scope.clear = function() {
			 $scope.$apply(function() {
				$scope.user.userName = '';

			 });
		};

		socket.on("registerOK", function(data) {
			console.log($scope)
			
			$scope.connected = true;

			$scope.clear();
		});
		
		socket.on("nameUsed", function(data) {
			if(data) {
				$scope.nameUsed = true;
			} else {
				$scope.nameUsed = false;
			}
			$scope.$apply();
		});

		
		$scope.connect = function(userName) {
			
			socket.emit('register', userName);

		}
		
		$scope.onChangeUserName = function(text) {
		
			socket.emit('checkName', text);
		}

		$scope.sendMsg = function() {
			
			console.log($scope.msg);

			socket.emit('sendMsg', {to:'all', msg:$scope.msg});

			$scope.messages.push({from:'me', msg:$scope.msg});
		}
				
	}]);

	return simpleChat;

});

