;(function() {
  'use strict';

  angular
    .module('brewKeeper')
    .factory('dataService', dataService);

  dataService.$inject = ['$http'];

  function dataService($http) {
    // var baseUrl = 'https://brew-keeper-api.herokuapp.com';
    var baseUrl = 'http://dev.brewkeeper.com:8000';

    var service = {
      deleteItem: deleteItem,
      get: get,
      patch: patch,
      post: post,
      put: put
    };

    return service;

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Return a DELETE promise on the specified URI.
     *
     * @param {string} uri The uri of the item to delete.
     */
    function deleteItem(uri) {
      return $http.delete(baseUrl + uri);
    }

    /**
     * Return a GET promise on the specified URI.
     *
     * @param {string} uri The uri of the item to get.
     */
    function get(uri) {
      return $http.get(baseUrl + uri);
    }

    /**
     * Return a PATCH promise on the specified URI.
     *
     * @param {string} uri The uri of the item to patch.
     * @param {Object} data The patch data.
     */
    function patch(uri, data) {
      return $http.patch(baseUrl + uri, data);
    }

    /**
     * Return a POST promise on the specified URI.
     *
     * @param {string} uri The uri of the item to post.
     * @param {Object} data The post data.
     */
    function post(uri, data) {
      return $http.post(baseUrl + uri, data);
    }

    /**
     * Return a PUT promise on the specified URI.
     *
     * @param {string} uri The uri of the item to put.
     * @param {Object} data The put data.
     */
    function put(uri, data) {
      return $http.put(baseUrl + uri, data);
    }
  }
})();
