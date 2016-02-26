// public/scripts/authController.js

(function () {
	angular.module('authApp')
		.controller('AuthController', AuthController);
	
	
	function AuthController($auth, $state) {
		
		var vm = this;
		
		vm.login = function () {
			
			var credentials = {
				name: vm.name,
				password: vm.password
			}
			
			// Use Satellizer's $auth service to login
			$auth.login(credentials)
			.then(function (data) {
				
				// If login is successful, redirect to the users state
				$state.go('users', {});
			})
			.catch(function (response) {
				// Handle errors here, such as displaying a notification
				// for invalid email and/or password.
				vm.error = response.data;
			});;
		}

	}

})();
