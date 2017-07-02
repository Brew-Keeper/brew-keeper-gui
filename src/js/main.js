;(function(){ //IIFE for angular

  angular.module('brewKeeper', ['ngRoute', 'timer', 'ngCookies', 'validation.match'], function($httpProvider, $routeProvider){
      $routeProvider
        .when('/',{
          templateUrl: 'partials/recipe-list.html',
          controller: 'WhoAmIController'
        })
        .when('/info', {
          templateUrl: 'partials/more-info.html',
          controller: 'LoginController',
        })
        .when('/login', {
          templateUrl: 'partials/login.html'
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
        .when('/reset-pw', {
          templateUrl: 'partials/reset-pw.html',
          controller: 'changePassword'
        })
        .when('/:username', {
          templateUrl: 'partials/recipe-list.html',
          controller: 'recipeList',
          controllerAs: 'vm'
        })
        .when('/:username/clone/:id', {
          templateUrl: 'app/recipes/clone.html',
          controller:  'CloneController',
          controllerAs: 'cloneVm'
        })
        .when('/:username/new', {
          templateUrl: 'app/recipes/recipe-create.html',
          controller: 'CreateNewRecipeController',
          controllerAs: 'vm'
        })
        .when('/:username/:id', {
          templateUrl: 'partials/recipe-detail.html',
          controller: 'recipeDetail'
        })
        .when('/:username/:id/brewit', {
          templateUrl: 'app/brew/brew-it.html',
          controller: 'BrewItController',
          controllerAs: 'vm'
        });

        // .otherwise({
        //   redirectTo: '/404.html',
        //   templateUrl: 'partials/404.html'
        // })
    })

    .controller('MainController', function($http, $scope, $route, $routeParams, $location, $cookies, $rootScope) {
      var vm = this;
      vm.changePassword = false;
      vm.logout = logout;

      activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

      /**
       * Prepare the page.
       */
      function activate() {
        // Definition of baseUrl (will eventually move to dataService)
        // $rootScope.baseUrl = 'https://brew-keeper-api.herokuapp.com';
        $rootScope.baseUrl = 'http://dev.brewkeeper.com:8000';
        var cookie = $cookies.get("Authorization");
        $http.defaults.headers.common = {"Authorization": cookie};

        $http.get($rootScope.baseUrl + '/api/whoami/')
          .then(function(response) {
            // If the user still has valid credentials, ensure rootScope has
            // their username
            $rootScope.username = response.data.username;
          })
          .catch(function(error) {
            // TODO: Make sure that the error was not a timeout
            $rootScope.username = null;
            $cookies.remove("Authorization");
            $http.defaults.headers.common = {};
            if($location.path() == "/reset-pw" || "/login" || "/info"){
              return;
            }
            $location.path('/public');
          }); //.error

        // Show/hide hamburger
        $(".menu").on('click', function() {
          $('.menu').toggleClass("active");
        });

        // Hide the menu if the user clicks somewhere not on the menu
        $(document).on('click', function(e) {
          if (!$(e.target).is('.menu.active')) {
            $('.menu').removeClass("active");
          }
        });
      }

      /**
       * Log the user out, updating what is visible in the UI.
       */
      function logout() {
        var logoutHeader = {"Authorization": $cookies.get("Authorization")};
        vm.changePassword = false;

        // Log the user out of the back-end API
        $http.post($rootScope.baseUrl + '/api/logout/', logoutHeader)
          .then(function() {
            $rootScope.username = null;
            $cookies.remove("Authorization");
            $http.defaults.headers.common = {};
          });
      }
    }) //END MainController

    .controller('WhoAmIController', function($location, $http, $scope, $rootScope, $cookies) {
      $http.get($rootScope.baseUrl + '/api/whoami/')
        .then(function(response){
          $rootScope.username = response.data.username;
          $location.path('/' + $rootScope.username);
        })//.success
        .catch(function(error) {
          // TODO: Don't clear data if the error is a timeout
          $rootScope.username = null;
          $cookies.remove("Authorization");
          $http.defaults.headers.common = {};
          $location.path('/public');
        }); //.error
    }); //END WhoAmIController
})(); //end IIFE
