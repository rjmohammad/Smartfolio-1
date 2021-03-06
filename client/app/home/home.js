angular.module('app.home', ['ngMaterial', "ng", "ngAnimate", "ngAria", 'angularModalService', 'ngMessages', 'material.svgAssetsCache'])
  .controller('HomeCtrl', function ($scope, $mdSidenav, ModalService, Collage, Pics, $window, Auth, $mdDialog, $location) {
    $scope.toggleLeft = buildToggler('left'); 
    $scope.pageClass = 'page home'; //css style class to have background change and set to the fit the content
    $scope.images = []; // store the images data
     var data; // to access tags in the popup

    function buildToggler(componentId) { // function for the side nav
      return function () {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.openMenu = function ($mdOpenMenu, ev) { //hamburger menu to view tags or delete photos
      $mdOpenMenu(ev);
    };

    $scope.fetcher = function () { //fetches results from server an object caitaining results from database for the given user
      Pics.imageList().then(function (result) {
        data = result;
        $scope.images = result;
      });
    };

    $scope.logoff = Auth.signout; //signs off user and destroys the token
    $scope.fetcher(); //fetches the data at the time f intial load
    Collage.setFetcher($scope.fetcher); //picture view modal
   
    $scope.show = function (index) { //takes the index of the image clicked and sets an object with the images information 
      Collage.set({
        image1: $scope.images[index],
        image2: $scope.images[index]
      });
      ModalService.showModal({
        templateUrl: 'modal.html',
        controller: "ModalController"
      }).then(function (modal) {
        modal.element.modal();

      });
    };

    $scope.show2 = function () { //show the uplaod file modal
      ModalService.showModal({
        templateUrl: 'uploader.html',
        controller: "UploadCtrl"
      }).then(function (modal) {
        modal.element.modal();
      });
    };

    $scope.showTags = function (index, $event) { //template to show tags as chips
      $mdDialog.show({
        targetEvent: $event,
        scope: $scope,
        preserveScope: true,
        template: `<div class="tags">
             <md-chips ng-model="tags"></md-chips>
               <div class="modal-footer">
                 <md-button type="button" ng-click="close()" class="btn  add" data-dismiss="modal">Close</md-button>
               </div>
            </div> `,
        controller: function DialogController($scope, $mdDialog) {
          console.log();
          $scope.tags = data[index].tags;
          $scope.close = function () {
            $mdDialog.hide();
          };
        }
      });
    };
    $scope.deleteImage = function (imghash) { //function to delete the image
      console.log(imghash);
      Pics.imageDeleter(imghash)
      .then(function () {
        Collage.getFetcher()();
      });
      }

    $scope.settings = function () { //function to change the rendered view to settings route
      $location.path('/settings');
    }

   

  });


//example images

 // $scope.images = [
    //   'https://upload.wikimedia.org/wikipedia/en/thumb/1/15/Kurau_Phantom_Memory.jpg/230px-Kurau_Phantom_Memory.jpg',
    //   'https://upload.wikimedia.org/wikipedia/en/a/a6/Kanon_second_anime_Funimation_box_set.jpg',
    //   'https://upload.wikimedia.org/wikipedia/en/7/79/Please_Teacher_Vol_1_DVD.jpg',
    //   'https://upload.wikimedia.org/wikipedia/en/5/5d/AKIRA_(1988_poster).jpg',
    //   'http://vignette2.wikia.nocookie.net/doblaje/images/9/98/Love_hina.jpg/revision/latest?cb=20101128193919&path-prefix=es',
    //   'https://s-media-cache-ak0.pinimg.com/originals/c0/1f/82/c01f82029206714ff7f2aeab24254e73.jpg',
    //   'http://img1.ak.crunchyroll.com/i/spire4/30eb07003c901066a9db027399c77ad41420598162_full.jpg',
    //   'https://upload.wikimedia.org/wikipedia/en/f/fe/FLCL_image.jpg',
    //   'https://myanimelist.cdn-dena.com/images/anime/9/20134.jpg',
    //   'http://static.tvtropes.org/pmwiki/pub/images/rsz_capa.jpg'
    // ]