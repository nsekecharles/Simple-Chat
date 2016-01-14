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
		$scope.message = {};
		$scope.messages = [];

		$scope.socket = io.connect('http://192.168.0.15:4490/');
		
		$scope.clear = function() {
			 $scope.$apply(function() {
				$scope.user.userName = '';

			 });
		};

		$scope.socket.on("registerOK", function(data) {
			
			$scope.connected = true;
			$scope.user.name = $scope.user.userName;
			$scope.clear();
		});
		
		$scope.socket.on("nameUsed", function(data) {
			if(data) {
				$scope.nameUsed = true;
			} else {
				$scope.nameUsed = false;
			}
			$scope.$apply();
		});

		$scope.socket.on("newMsg", function(data) {
			
			console.log(data);
			
			$scope.messages.push(data);
			
			$scope.message.msg = '';
			
			$scope.$apply();
		});


		$scope.connect = function(userName) {
			
			$scope.socket.emit('register', userName);

		}
		
		$scope.onChangeUserName = function(text) {
		
			$scope.socket.emit('checkName', text);
		}

		$scope.sendMsg = function(msg) {
			
			$scope.socket.emit('sendMsg', {to:'all', message:msg});

		}
				
	}]);

	return simpleChat;

});

