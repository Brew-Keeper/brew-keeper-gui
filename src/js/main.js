;(function(){ //IIFE for angular

  angular.module('brewKeeper', ['ngRoute', 'timer', 'ngCookies', 'validation.match'], function($httpProvider, $routeProvider){
      $routeProvider
        .when('/',{
          templateUrl: 'partials/recipe-list.html',
          controller: 'WhoAmIController'
        })
        .when('/users/:username/recipes/new', {
          templateUrl: 'partials/recipe-create.html',
          controller: 'createNewRecipe'
        })
        .when('/users/:username/clone/:id', {
          templateUrl: 'partials/clone.html',
          // controller:  'cloneController'
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

    .controller('MainController', function($http, $scope, $route, $routeParams, $location, $cookies){
      var cookie = $cookies.get("Authorization")
      $http.defaults.headers.common = {"Authorization": cookie}
      $scope.$route = $route;
      $scope.$location = $location;
      $scope.$routeParams = $routeParams;

      $http.get('https://brew-keeper-api.herokuapp.com/api/whoami/')
        .then(function(response){
          $scope.username = response.data.username;
        })//This is for populating url with username

    $scope.logout= function(){
      var logoutHeader = {"Authorization":$cookies.get("Authorization")}
      $http.post('https://brew-keeper-api.herokuapp.com/api/logout/', logoutHeader)
        .then(function(){
          $('.login').removeClass('hidden');//when logged out
          $('.logout').addClass('hidden');
        })
        $cookies.remove("Authorization")
        $http.defaults.headers.common = {}
      }
    })//END MainController

    .controller('WhoAmIController', function($location, $http, $scope) {
      $http.get('https://brew-keeper-api.herokuapp.com/api/whoami/')
        .then(function(response){
          var username = response.data.username;
          $scope.username = username
          //pseudo-code Show "logout" in nav
          //pseudo-code Show "Create New Recipe" in nav
          $('.logout').removeClass('hidden')
          //pseudo-code Hide "login/signup" in nav in index.html
          //pseudo-code Hide "form.login" in login.html
          $('.login').addClass('hidden')
          $location.path('/users/' + username)
        })//.success
        .catch(function(){
          //pseudo-code Show "login/signup" in nav in index.html
          //pseudo-code Show "form.login" in login.html
          $('.login').removeClass('hidden')
          //pseudo-code Hide "logout" in nav
          $('.logout').addClass('hidden')
          $location.path('/login')
        })//.error
    })//END WhoAmIController

})(); //end IIFE
