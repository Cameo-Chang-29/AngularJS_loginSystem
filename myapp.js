  var app = angular.module('myapp',['ngRoute', 'ngCookies']);//storageService is used for communicate with localStorage
  
  //routing
  app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        template:'<div>Welcome to COMMUNICATION CENTER!!!</div>'
    })
    .when('/signin', {
        templateUrl:'signin.html',
        controller: 'signinCntrl'
    })
    .when('/signup', {
        templateUrl:'signup.html',
        controller: 'signupCntrl'
    })
    .when('/profile/',{
        templateUrl:'profile.html',
        controller: 'profileCntrl'
    })
    .when('/profile/id',{
        templateUrl:'profile.html',
        controller: 'profileCntrl'
    })
    .when('/profile_detail',{
        templateUrl:'detail.html',
        controller: 'detailCntrl'
    })
    .when('message',{
        templateUrl:'message.html',
        controller: 'messageCntrl'
    })
    .when('message_detail',{
        templateUrl:'message_detail.html',
        controller: 'messageDetailCntrl'
    })
    .when('/error', {
        template:'Invalid URL, Please try again..'
    })
    .otherwise({
        redirectTo:'/error'
    });
  });
  
   /*
      $scope.user_username='';
      $scope.user_password='';
      $scope.user_firstname='';
      $scope.user_lastname='';
      $scope.user_email='';
      $scope.user_phone='';
      $scope.user_loc='';
      */
  //controllers
  //signinCntrl
  app.controller('signinCntrl',function($scope, $rootScope,$cookieStore,$location,getLocalStorage){
    var users = getLocalStorage.getUsers();
    $scope.SignIn = function(){
      var valid = false;
      if($scope.username && $scope.password){
        users.forEach(function(user, id){
          if(user.name === $scope.username && user.pw === $scope.password){
            valid = true;
          }
          if(valid === false){
            $location.path('/signin');
          }else{
            $cookieStore.put('id',id);
            $location.path('/profile/'+id);
          }
        });
      }
    };
  });

  //signupCntrl- $rootScope? not used
  app.controller('signupCntrl', function($scope, $rootScope, $location, $cookieStore, getLocalStorage){
    //$scope.alert = "";
    $scope.CreateNew = function(){
      var users = getLocalStorage.getUsers();
      var taken = false;
      if($scope.user_username && $scope.user_password && $scope.user_firstname && $scope.user_lastname
        &&$scope.user_email && $scope.user_phone && $scope.user_loc){
          //check the username
          users.forEach(function(user){
            if(user.name === $scope.user_username){
              taken = true;
              //$scope.alert("Username has been taken, use another one!!");
              //TODO: should break the loop here
            }
          });
          
          if(taken===false){
              users.push({'name':$scope.user_username, 'pw': $scope.user_password,'fname':$scope.user_firstname, 
          'lname':$scope.user_lastname, 'eml': $scope.user_email, 'phn':$scope.user_phone, 'loc': $scope.user_loc});
              getLocalStorage.updateUsers(users);
              $scope.user_username='';
              $scope.user_password='';
              $scope.user_firstname='';
              $scope.user_lastname='';
              $scope.user_email='';
              $scope.user_phone='';
              $scope.user_loc='';
              
              var id = users.length-1;
              $cookieStore.put('id', id);
              $location.path('/profile/' + id);
              
          }
      }
    };
    
  });
     
  app.controller('profileCntrl', function($scope, $rootScope, $cookieStore, $routeParams,
    Messages){
    //$scope.username=??
    var users = getLocalStorage.getUsers();
    //var messages =Messages.mess;
    var id = $cookieStore.get('id');
    
    if(typeof($routeParams.id) != "undefined"){
      id = $routeParams.id;
      $cookieStore.put('id', id);
    }
    $scope.username=users[id].name;
  });
  
  app.controller('detailCntrl', function($scope, $rootScope, $cookieStore, getLocalStorage){
      var users = getLocalStorage.getUsers();
      var messages =Messages.mess; 
      var id = $cookieStore.get('id');
      
      $scope.Edit = function(){
        if($scope.user_username && $scope.user_password && $scope.user_firstname && $scope.user_lastname
        && $scope.user_email && $scope.user_phone && $scope.user_loc){
          var user = {name: $scope.user_username, pw:$scope.user_password, fname:$scope.user_firstname, lname:$scope.user_lastname,
          eml:$scope.user_email, phn: $scope.user_phone, loc:$scope.user_loc};
          
          users[id] = user;
          getLocalStorage.updateUsers(users);
        }
        
      };
  });
  
  //$scope.alert--no messages
  app.controller('messageCntrl', function($scope, $rootScope, $cookieStore, getLocalStorage, Messages){
      var users = getLocalStorage.getUsers(); 
      var id = $cookieStore.get('id');
      $scope.messages =Messages.mess;
      
      if(!$scope.messages){
        $scope.alert = "No messages";
      }else{
        $scope.alert = '';
      }     
  });
  
  
  // app.controller('messageDetailCntrl', function($scope){
      
  // });
 
 
  //initialize the message
  app.run(function($window, $http, $cookieStore){
      if(localStorage.getItem("Messages")=== null){
        $http({
          'method':'GET',
          'url':'mess.json'
        })
        .then(function(resp){
          mess = resp.data;
          if(typeof(Storage)!=='undefined')
          localStorage.setItem('Messages', JSON.stringify(mess));
        },function(err){
          console.log(err);
        });
      }
  });
  
  
  
  
  //functions
  //users
  app.factory('getLocalStorage',function(){
    var user_list = {};//it's an object
    return{
      list: user_list,
      updateUsers:function(UsersArr){
        if(window.localStorage && UsersArr){
          localStorage.setItem("users", angular.toJson(UsersArr));
          }
        user_list = UsersArr;
      },
      getUsers:function(){
        user_list = angular.fromJson(localStorage.getItem("users"));
        return user_list ? user_list : [];
      }
    };
  });
  //messages
  app.service('Messages', function Messages(){
        this.mess = JSON.parse(localStorage.getItem(Messages));
        this.updateMessages = function(mes){
          localStorage.setItem("Messages", JSON.stringify(mes));
        }
 });
  
  
