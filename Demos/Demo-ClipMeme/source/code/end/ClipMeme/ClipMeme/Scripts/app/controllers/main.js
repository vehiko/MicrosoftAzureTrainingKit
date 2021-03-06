﻿(function () {
    'use strict';

    var controllerId = 'maincontroller';

    angular.module('app').controller(controllerId, ['$scope', 'gifservice', '$modal', 'signalrservice', '$rootScope', 'username', main]);

    function main($scope, gifservice, $modal, signalrservice, $rootScope, username) {
        $scope.username = username;
        $scope.loading = true;
        $scope.uploadingImages = [];
        
        gifservice.data.query().$promise.then(function (data) {
            $scope.loading = false;
            $scope.images = data;
        });

        signalrservice.init().done(function() {
            $rootScope.hubid = signalrservice.connection.id;
            console.log("Connected with client id : " + $rootScope.hubid);
        });

        $scope.openModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'createModal.html',
                controller: 'modalInstanceCtrl'
            });
            
            modalInstance.result.then(function (name) {
                $scope.uploadingImages.push(name);
            });
        };

        
        signalrservice.on('gifGenerationCompleted', gifGenerated);
        
        function gifGenerated(url) {
            if ($scope.uploadingImages.length > 0) {
                $scope.uploadingImages.pop();
            }
            $scope.images.unshift(
                {
                    'Username': username,
                    'URL': url
                });
        }
    }
})();
