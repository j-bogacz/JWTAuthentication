// public/scripts/app.js

(function () {
	angular.module('authApp', ['ui.router', 'satellizer'])
	  .constant('apiUrl', 'http://localhost:8081/api')
	  .config(function ($stateProvider, $urlRouterProvider, $authProvider, apiUrl) {
		// Satellizer configuration that specifies which API
		// route the JWT should be retrieved from
		$authProvider.baseUrl = apiUrl;
		$authProvider.loginUrl = '/authenticate';
		
		// Redirect to the auth state if any other states
		// are requested other than users
		$urlRouterProvider.otherwise('/auth');
		
		$stateProvider
				.state('auth', {
			url: '/auth',
			templateUrl: '../views/authView.html',
			controller: 'AuthController as auth'
		})
				.state('users', {
			url: '/users',
			templateUrl: '../views/userView.html',
			controller: 'UserController as user'
		});
	});
})();
