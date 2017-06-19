;(function(){ //IIFE for angular

  angular.module('brewKeeper', ['ngRoute', 'timer', 'ngCookies', 'validation.match'], function($httpProvider, $routeProvider){
      $routeProvider
        .when('/',{
          templateUrl: 'partials/recipe-list.html',
          controller: 'WhoAmIController'
        })
        .when('/reset-pw', {
          templateUrl: 'partials/reset-pw.html',
          controller: 'changePassword'
        })
        .when('/public',{
          templateUrl: 'partials/public-list.html',
          controller: 'publicRecipe'
        })
        .when('/public/users/:username', {
          templateUrl: 'partials/public-list.html',
          controller: 'publicRecipe'
        })
        .when('/public/:id',{
          templateUrl: 'partials/public-detail.html',
          controller: 'publicDetail'
        })
        .when('/public/:id/brewit', {
          templateUrl: 'partials/public-brewit.html',
          controller: 'public-brewIt'
        })
        .when('/login', {
          templateUrl: 'partials/login.html'
        })
        .when('/info', {
          templateUrl: 'partials/more-info.html',
          controller: 'loginCtrl'
        })
        .when('/reset-pw', {
          templateUrl: 'partials/reset-pw.html',
          controller: 'changePassword'
        })
        .when('/:username/new', {
          templateUrl: 'partials/recipe-create.html',
          controller: 'createNewRecipe'
        })
        .when('/:username/clone/:id', {
          templateUrl: 'partials/clone.html',
          controller:  'cloneController'
        })
        .when('/:username/:id', {
          templateUrl: 'partials/recipe-detail.html',
          controller: 'recipeDetail'
        })
        .when('/:username', {
          templateUrl: 'partials/recipe-list.html',
          controller: 'recipeList'
        })
        .when('/:username/:id/brewit', {
          templateUrl: 'partials/brew-it.html',
          controller: 'brewIt'
        });

        // .otherwise({
        //   redirectTo: '/404.html',
        //   templateUrl: 'partials/404.html'
        // })
    })

    .controller('MainController', function($http, $scope, $route, $routeParams, $location, $cookies, $rootScope){
      // Definition of baseUrl
      $rootScope.baseUrl = 'https://brew-keeper-api.herokuapp.com';
      var cookie = $cookies.get("Authorization");
      $http.defaults.headers.common = {"Authorization": cookie};
      $scope.$route = $route;
      $scope.$location = $location;
      $scope.$routeParams = $routeParams;
      $rootScope.username = null;
      $scope.changePassword= false;

      $http.get($rootScope.baseUrl + '/api/whoami/')
        .then(function(response){
          $rootScope.username = response.data.username;
        })//This is for populating url with username
        .catch(function(){
          $rootScope.username = null; //hides login and shows logout
          $cookies.remove("Authorization");
          $http.defaults.headers.common = {};
          if($location.path() == "/reset-pw" || "/login" || "/info"){
            return;
          }
          $location.path('/public');
        }); //.error


    $scope.logout= function(){
      var logoutHeader = {"Authorization":$cookies.get("Authorization")};
      $scope.changePassword = false;

      $http.post($rootScope.baseUrl + '/api/logout/', logoutHeader)
        .then(function(){
          $rootScope.username = null;
        });
        $cookies.remove("Authorization");
        $http.defaults.headers.common = {};
      };

      //hamburer controller
      $(".menu").on('click', function() {
        $('.menu').toggleClass("active");
      });

      $(document).on('click', function(e) {
        if(!$(e.target).is('.menu.active')) {
        $('.menu').removeClass("active");
        }
        // $scope.changePassword = false;
      });

    }) //END MainController

    .controller('WhoAmIController', function($location, $http, $scope, $rootScope, $cookies) {
      $http.get($rootScope.baseUrl + '/api/whoami/')
        .then(function(response){
          var username = response.data.username;
          $rootScope.username = username;
          $location.path('/' + username);
        })//.success
        .catch(function(){
          $rootScope.username = null; //hides login and shows logout
          $cookies.remove("Authorization");
          $http.defaults.headers.common = {};
          $location.path('/public');
        }); //.error
    }); //END WhoAmIController

})(); //end IIFE
