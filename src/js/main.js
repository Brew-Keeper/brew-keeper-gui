;(function(){ //IIFE for angular

  angular.module('brewKeeper', ['ngRoute', 'timer', 'ngCookies', 'validation.match'], function($httpProvider, $routeProvider){
      $routeProvider
        .when('/',{
          templateUrl: 'partials/recipe-list.html',
          controller: 'WhoAmIController'
        })
        // .when('/visitor',{
        //   templateUrl: 'partials/recipe-list.html',
        //   controller: 'publicRecipe'
        // })
        .when('/users/:username/recipes/new', {
          templateUrl: 'partials/recipe-create.html',
          controller: 'createNewRecipe'
        })
        .when('/users/:username/clone/:id', {
          templateUrl: 'partials/clone.html',
          controller:  'cloneController'
        })
        .when('/users/:username/recipes/:id', {
          templateUrl: 'partials/recipe-detail.html',
          controller: 'recipeDetail'
        })
        .when('/users/:username', {
          templateUrl: 'partials/recipe-list.html',
          controller: 'recipeList'
        })
        .when('/users/:username/recipes/:id/brewit', {
          templateUrl: 'partials/brew-it.html',
          controller: 'brewIt'
        })
        .when('/info', {
          templateUrl: 'partials/more-info.html'
        })
        .when('/login', {
          templateUrl: 'partials/login.html'
        })
        // .otherwise({
        //   redirectTo: '/404.html',
        //   templateUrl: 'partials/404.html'
        // })
    })

    .controller('MainController', function($http, $scope, $route, $routeParams, $location, $cookies, $rootScope){
      var cookie = $cookies.get("Authorization")
      $http.defaults.headers.common = {"Authorization": cookie}
      $scope.$route = $route;
      $scope.$location = $location;
      $scope.$routeParams = $routeParams;
      $rootScope.username = null;
      $scope.changePassword= false;

      $http.get('https://brew-keeper-api.herokuapp.com/api/whoami/')
        .then(function(response){
          $rootScope.username = response.data.username;
        })//This is for populating url with username

    $scope.logout= function(){
      var logoutHeader = {"Authorization":$cookies.get("Authorization")}
      $scope.changePassword = false;
      $http.post('https://brew-keeper-api.herokuapp.com/api/logout/', logoutHeader)
        .then(function(){
          // $('.login').removeClass('hidden');//when logged out
          // $('.logout').addClass('hidden');
          $rootScope.username = null;
        })
        $cookies.remove("Authorization")
        $http.defaults.headers.common = {}
      }

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

    })//END MainController

    .controller('WhoAmIController', function($location, $http, $scope, $rootScope) {
      console.log("whoami 1")
      $http.get('https://brew-keeper-api.herokuapp.com/api/whoami/')
        .then(function(response){
          var username = response.data.username;
          $rootScope.username = username;
          $location.path('/users/' + username);
        })//.success
        .catch(function(){
          $rootScope.username = null; //hides login and shows logout
          // $location.path('/login');
          $location.path('/users/public');
        })//.error
    })//END WhoAmIController

})(); //end IIFE
