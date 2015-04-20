'use strict';

angular.module('exampleApp', [
  'ngRoute',
  'angular-dropdown-multiselect',
  'hljs',
  'ui.bootstrap'
]).
config(['$routeProvider', '$locationProvider', '$compileProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);


    var appPathRoute = '/';
    var pagesPath = staticPath + 'javascripts/pages/';


    $routeProvider.when('/', {
      templateUrl: pagesPath + 'home/home.html'
    });

    $routeProvider.otherwise('/');

  }
]);
