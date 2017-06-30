;(function() {
  'use strict';

  angular
    .module('brewKeeper')
    .factory('userService', userService);

  function userService() {
    var username = '';
    var service = {
      setUsername: setUsername,
      username: getUsername
    };

    return service;

    /**
     * Set the username.
     */
    function setUsername(newUsername) {
      username = newUsername;
    }

    /**
     * Get the stored username.
     */
    function getUsername() {
      return username;
    }
  }
})();
