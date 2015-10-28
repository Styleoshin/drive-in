'use strict';

angular.module('driveIn.auth', [])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/drive-in/auth', {
    templateUrl: 'components/auth/auth.html',
    controller: 'AuthCtrl'
  });
}])

/**
 * AuthCrl is a controller related to the `auth` directive.
 */
.controller('AuthCtrl', [
  '$scope',
  '$log',
  'authenticator',
  'apiLoader',
  'events',
 function ($scope, $log, authenticator, apiLoader, events) {

    // Attempt to authenticate on initialization.
    attemptAuth();

    // If the init (auth) view is visible, and user has not
    // authorized the app already, the `autorize`
    // button should trigger a new OAuth2 authentication attempt.
    $scope.authenticate = function () {
      if (!$scope.isAuthenticated) {
        return attemptAuth();
      }
    };

    // Authentication attempt uses the `authenticator` service.
    // Upon successful authentication, set the related boolean flag to true,
    // and load Google Drive API.
    function attemptAuth() {
      authenticator(function () {
        $scope.isAuthenticated = true;
        loadApi();
      });
    }

    function loadApi() {
      apiLoader(function () {
        $log.log('[DRIVE-IN] Authenticated. Broadcasting related event.');
        $scope.$emit(events.AUTH);
      });
    }
  }]
)

.directive('initializer', function () {
  return {
    restrict: 'E',
    controller: 'AuthCtrl',
    templateUrl: 'components/auth/auth.html'
  };
})