// public/scripts/userController.js

(function () {
	angular.module('authApp')
        .controller('UserController', UserController);
	
	function UserController($http) {
		
		var vm = this;
		
		vm.users;
		vm.error;
		
		vm.getUsers = function () {
			$http.get('http://localhost:8080/api/users').success(function (users) {
				vm.users = users;
			}).error(function (error) {
				vm.error = error;
			});
		}
	}
})();
