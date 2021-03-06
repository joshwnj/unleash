/**
 * @ngdoc function
 * @name unleashApp.controller:EditPathController
 * @todo Implement thee-way data binding to fully remove flickering
 * @description
 * # EditPathController
 * Controls data for the /account page
 */

'use strict';
angular.module('unleashApp')
  .controller('EditPathController', function ($window, $scope, $firebase, FBURL, fbutil, $routeParams, growl, templatesService, cardsService, userService) {
    $scope.params = $routeParams;
    $scope.cards = null;
    $scope.templates = {};

    var setupPath = function(uid) {
      // List cards that user has been assigned with
      cardsService.listCards(uid).then(function(cards) {
        $scope.cards = cards;

        getTemplates();

        cards.$watch(function() {
          getTemplates();
        });
      }).catch(function(error) {
        console.error(error);
      });
    };

    // List templates that are still available to use for the current user
    var getTemplates = function() {
      templatesService.getAvailableTemplates($scope.currentUser).then(function(templates) {
        $scope.templates.available = templates;
        $scope.$apply();
      }).catch(function(error) {
        console.error(error);
      });
    };

    // Setup the page after we get the UID of the username in the URL
    userService.getUserUid($routeParams.userId).then(function(uid) {
      $scope.currentUser = uid;

      // Pull user data
      $scope.currentPathOwner = fbutil.syncObject('users/' + uid);

      // Initialize the path
      setupPath(uid);
    });

    // Get initial templates
    templatesService.list.then(function(templates) {
      $scope.templates.initial = templates;
    }).catch(function(error) {
      growl.error(error);
    });

    // Handle drag and drop interface
    $scope.onDropComplete = function(data) {
      cardsService.add(data);
    };

    // @todo Temporary fix to remove available cards flickering
    $scope.removeAvailable = function(index) {
      $scope.templates.available.splice(index, 1);
    };

    // Remove specific card from user cards
    $scope.remove = function(data) {
      cardsService.remove(data);
    };
  });
