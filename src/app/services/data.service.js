;(function() {
  'use strict';

  angular
    .module('brewKeeper')
    .factory('dataService', dataService);

  dataService.$inject = ['$cookies', '$http'];

  function dataService($cookies, $http) {
    var baseUrl = 'https://brew-keeper-api.herokuapp.com';
    // var baseUrl = 'http://dev.brewkeeper.com:8000';

    var service = {
      clearCredentials: clearCredentials,
      delete: deleteItem,
      get: get,
      getCredentials: getCredentials,
      patch: patch,
      post: post,
      put: put,
      setCredentials: setCredentials
    };

    return service;

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Clear the Authorization cookie and header.
     */
    function clearCredentials() {
      // Clear the cookie
      $cookies.remove("Authorization");
      // Remove the headers
      $http.defaults.headers.common = {};
    }

    /**
     * Return a DELETE promise on the specified URI. (Named deleteItem because
     * 'delete' is a reserved word in JavaScript.)
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
     * Get the Authorization cookie.
     *
     * @return {(string|boolean)} The cookie or false
     */
    function getCredentials() {
      var cookie = $cookies.get("Authorization");
      if (cookie) {
        return cookie;
      }

      return false;
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

    /**
     * Set the Authorization cookie and header with the supplied token (after
     * adding "Token " to it). If the prefix is already added, indicate with
     * optional flag.
     *
     * @param {string} authToken The user's auth token from the back end.
     * @param {boolean} [prefixAdded=false] Provided authToken already includes prefix.
     */
    function setCredentials(authToken, prefixAdded) {
      if (!prefixAdded) {
        authToken = "Token " + authToken;
      }

      // Define an expiration date 30 days hence
      var expirationDate = new Date();
      expirationDate.setTime(+ expirationDate + (30 * 24 * 60 * 60 * 1000));

      // Make sure we can get this again, later
      $cookies.put("Authorization", authToken, {"expires": expirationDate});
      // Allow our calls to the API to work
      $http.defaults.headers.common = {"Authorization": authToken};
    }
  }
})();
