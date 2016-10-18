(function (ng, win, doc){
    var app = angular.module('app', ['ngAnimate', 'mgcrea.ngStrap.modal', 'ui.router', 'ajoslin.promise-tracker']),
    flowData = {},
    loading = document.getElementById('loading'),
    spinner = new Spinner(opts).spin(loading),
    content = document.getElementsByClassName("container-fluid")[0],
    hash = window.location.hash;

    loading.appendChild(spinner.el);

    window.onload = function(){
        loading.classList.add('fade');
        setInterval(function(){
            spinner.stop();
            content.classList.remove('fade');
        },400);
    };

    app.config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

         //   $urlRouterProvider.otherwise('/home');

            // States
            $stateProvider
              .state('home', {
                  url: "/home",
                  templateUrl: '',
              });
        }
    ]);

    app.controller('DataCtrl', function ($scope, $stateParams, $http, $log, promiseTracker, $timeout, $modal, $filter) {

/*        $http.get("../dataset.json").success( function( data, status, headers, config ) {
          $scope.slides = data.ds;

        }).error( function(data, status, headers, config ) {
            console.log("error getting resource");
        });*/


        $scope.slides = {
            "0" : {
                "id": 0,
                "label": "loanType",
                "next": 1,
                "title": "Pick Your Loan Type",
                "links": [
                    { "img": "http://www.harprefiquote.com/sh3/images/buttons-purchase2.png", "btn": false, "val": "purchase" },
                    { "img": "http://www.harprefiquote.com/sh3/images/buttons-refi2.png", "btn": false, "val": "refinance" }
                ]
            }
        };

        $scope.logoUrl = "http://www.harprefiquote.com/sh3/images/hrq.png";
        $scope.headline = "Qualify for HARP Refinance Program and SAVE ON YOUR MORTGAGE!*";
        $scope.subhead = "Free Program - No SSN Required* - Set to Expire in 2016";
        $scope.selected = 0;


        function formPostData(url, fields) {

            var form = ng.element('<form style="display: none;" method="get" action="' + url + '" target="_blank"></form>');
            ng.forEach(fields, function(value, name) {
              var input = ng.element('<input type="hidden" name="' +  name + '">');
              input.attr('value', value);
              form.append(input);
                sendData(value);
            });
            $('body').append(form);
            form[0].submit();
            form.remove();
        }

        $scope.update = function(k, v) {
            //flowData += k+"="+v+"&";
            flowData[k] = v;

            console.log("LOAN TYPE: "+flowData.loanType, "HOME FOUND? "+flowData.homeFound);
        //    console.log($scope.slides, $scope.slides[43]);
            console.log(flowData);


            if (flowData.loanType === "purchase") {

                $scope.slides = {
                    "0" : {
                        "id": 0,
                        "label": "loanType",
                        "next": 1,
                        "title": "Pick Your Loan Type",
                        "links": [
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-purchase2.png", "btn": false, "val": "purchase" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-refi2.png", "btn": false, "val": "refinance" }
                        ]
                    },
                    "1" : {
                        "id": 1,
                        "label": "propertyType",
                        "prev": 0,
                        "next": 2,
                        "title": "What Type of Property do you have?",
                        "links": [
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-single2.png", "btn": false, "val": "single" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-multi2.png", "btn": false, "val": "multi" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-condo2.png", "btn": false, "val": "condo" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-mobile2.png", "btn": false, "val": "mobile" }
                        ]
                    },
                    "2" : {
                        "id": 2,
                        "label": "creditRating",
                        "prev": 1,
                        "next": 3,
                        "title": "How is Your Credit?",
                        "links": [
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-excellent.png", "btn": false, "val": "excellent" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-good.png", "btn": false, "val": "good" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-fair.png", "btn": false, "val": "fair" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-poor.png", "btn": false, "val": "poor" }
                        ]
                    },
                    "3" : {
                        "id": 3,
                        "label": "homeFound",
                        "prev": 2,
                        "next": 4,
                        "title": "Have you Found a Home?",
                        "links": [
                            { "img": "", "btn": true, "val": "yes" },
                            { "img": "", "btn": true, "val": "no" }
                        ]
                    },
                    "4" : {
                        "id": 4,
                        "label": "newPrice",
                        "prev": 2,
                        "next": flowData.homeFound === "yes" ? 42 : 43,
                        "title": "What is the Price of the New Home?",
                        "rangeSlider": {
                            "cls": "curr",
                            "min": 80000,
                            "max": 1000000,
                            "def": 80000,
                            "step": 1
                        }
                    },
                    "41" : {
                        "id": 41,
                        "label": "homeAddress",
                        "prev": 4,
                        "next": 43,
                        "title": "What is your home address?"
                    },
                    "42" : {
                        "id": 42,
                        "label": "propertyInfo",
                        "prev": 4,
                        "next": 43,
                        "title": "What is your CURRENT address?",
                        "templateUrl": "forms/property_info.html"
                    },
                    "43" : {
                        "id": 43,
                        "label": "homeownerInfo",
                        "prev": flowData.homeFound === "yes" ? 42 : 43,
                        "next": 44,
                        "title": "Please verify homeowner information",
                        "templateUrl": "forms/homeowner_info.html"
                    }
                }
            }

            if (flowData.loanType === "refinance") {

                $scope.slides = {
                    "0" : {
                        "id": 0,
                        "label": "loanType",
                        "next": 1,
                        "title": "Pick Your Loan Type",
                        "links": [
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-purchase2.png", "btn": false, "val": "purchase" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-refi2.png", "btn": false, "val": "refinance" }
                        ]
                    },
                    "1" : {
                        "id": 1,
                        "label": "propertyType",
                        "prev": 0,
                        "next": 2,
                        "title": "What is your Property Type?",
                        "links": [
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-single2.png", "btn": false, "val": "single" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-multi2.png", "btn": false, "val": "multi" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-condo2.png", "btn": false, "val": "condo" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-mobile2.png", "btn": false, "val": "mobile" }
                        ]
                    },
                    "2" : {
                        "id": 2,
                        "label": "creditRating",
                        "prev": 1,
                        "next": 3,
                        "title": "How is Your Credit?",
                        "links": [
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-excellent.png", "btn": false, "val": "excellent" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-good.png", "btn": false, "val": "good" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-fair.png", "btn": false, "val": "fair" },
                            { "img": "http://www.harprefiquote.com/sh3/images/buttons-poor.png", "btn": false, "val": "poor" }
                        ]
                    },
                    "3" : {
                        "id": 3,
                        "label": "propertyValue",
                        "prev": 2,
                        "next": 4,
                        "title": "What is your Property Value?",
                        "rangeSlider": {
                            "cls": "curr",
                            "min": 80000,
                            "max": 1000000,
                            "def": flowData.propertyValue ? flowData.propertyValue : 80000,
                            "step": 1
                        }
                    },
                    "4" : {
                        "id": 4,
                        "label": "mortgageBalance",
                        "prev": 3,
                        "next": 5,
                        "title": "What is your Mortgage Balance?",
                        "rangeSlider": {
                            "cls": "curr",
                            "min": 0,
                            "max": 1000000,
                            "def": flowData.mortgageBalance ? flowData.mortgageBalance : 0,
                            "step": 1
                        }
                    },
                    "5" : {
                        "id": 5,
                        "label": "currentRate",
                        "prev": 4,
                        "next": flowData.creditRating === "excellent" || flowData.creditRating === "good" ? 61 : 51,
                        "title": "What is your Current Interest Rate?",
                        "rangeSlider": {
                            "cls": "perc",
                            "min": 3,
                            "max": 10,
                            "def": flowData.currentRate ? flowData.currentRate : 4,
                            "step": 0.25
                        }
                    },

                    "51" : {
                        "id": 51,
                        "label": "lateMortgage",
                        "prev": 5,
                        "next": 52,
                        "title": "Are you Behind on Your Mortgage?",
                        "links": [
                            { "img": "", "btn": true, "val": "yes" },
                            { "img": "", "btn": true, "val": "no" }
                        ]
                    },
                    "52" : {
                        "id": 52,
                        "label": "lenderInfo",
                        "prev": 51,
                        "next": 61,
                        "title": "Who is Your Current Lender?",
                        "templateUrl": "forms/lender_info.html"
                    },
                    "61" : {
                        "id": 61,
                        "label": "propertyInfo",
                        "prev": flowData.creditRating === "excellent" || flowData.creditRating === "good" ? 5 : 52,
                        "next": 62,
                        "title": "What is your Property Address?",
                        "templateUrl": "forms/property_info.html"
                    },
                    "62" : {
                        "id": 62,
                        "label": "homeownerInfo",
                        "prev": 61,
                        "title": "Please verify property information",
                        "templateUrl": "forms/homeowner_info.html"
                    }
                }
            }
        }


        this.panel = 0;

        this.isSet = function(checkPanel) {
          return this.panel === checkPanel;
        };

        this.setPanel = function(setPanel) {
            if (setPanel || setPanel >= 0)
                this.panel = setPanel;
            else return false
        };

        $scope.thanksModal = function(){
            var urlString;
            var elm = document.getElementById("thanksModalBg");
            flowData = flowData.replace("undefined", "");
            urlString = "?"+flowData;
            elm.style.display = "inline-block";
            elm.className = "panel";
        }

        function removeHash () {
            history.pushState("", document.title, window.location.pathname + window.location.search);
            window.location.hash = "#/loanType";
        }

        if (hash.indexOf("info") > -1 || window.onload) {
            removeHash();
        }

    });


    app.run(
        ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    );


    app.controller( 'FormCtrl', function($scope, $stateParams, $http, $log, promiseTracker, $timeout, $modal, $filter){

        $scope.modal = {
          "title": "Confirmation",
          "content": "Thank you for completing this form. An agent will contact you shortly regarding your submission."
        };

        // Inititate the promise tracker to track form submissions.
        $scope.progress = promiseTracker();

        // Form submit handler.
        $scope.submit = function(form) {

            console.log(form);
            // Trigger validation flag.
            $scope.submitted = true;

            // If form is invalid, return and let AngularJS show validation errors.
            if (form.$invalid) {
                return;
            }

            // Default values for the request.
            var config = {
                params : {
                  'callback' : 'JSON_CALLBACK',
'loanType' : flowData.loanType,
'propertyType' : flowData.propertyType,
'creditRating' : flowData.creditRating,
'propertyValue' : flowData.propertyValue,
'lateMortgage' : flowData.lateMortgage,
'propertyAddress' : flowData.propertyAddress,
'propertyZip' : flowData.propertyZip,
                  'first' : $scope.first,
                  'last' : $scope.last,
                  'email' : $scope.email,
                  'phone' : $scope.phone
                },
            };

            // Perform JSONP request.
            var $promise = $http.jsonp('response.json', config)
                .success(function(data, status, headers, config) {
                    if (data.status == 'OK') {
                        $scope.address = null;
                        $scope.zip = null;
                        $scope.first = null;
                        $scope.last = null;
                        $scope.email = null;
                        $scope.phone = null;
                        $scope.messages = 'Your form has been sent!';
                        $scope.submitted = false;
                    } else {
                        $scope.messages = 'Oops, we received your request, but there was an error processing it.';
                        $log.error(data);
                    }
                })
                .error(function(data, status, headers, config) {
                    $scope.progress = data;
                    $scope.messages = 'There was a network error. Try again later.';
                    $log.error(data);
                })
                .finally(function() {
                    // Hide status messages after three seconds.
                    $timeout(function() {
                        $scope.messages = null;
                    }, 3000);
            });

            // Track the request and show its progress to the user.
            $scope.progress.addPromise($promise);

        };


        $scope.phoneNumberPattern = (function() {
            var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
            return {
                test: function(value) {
                    return regexp.test(value);
                }
            };
        })();


    });


    var myConstant = {},
    rootPath = "../forms/";
    myConstant.codeCampType = "svcc";
    app.constant("CONFIG", myConstant);

    app.config(['$stateProvider', '$urlRouterProvider','CONFIG', function ($stateProvider, $urlRouterProvider,CONFIG) {
        $stateProvider
        .state('propertyInfo', {
          url: '/propertyInfo',
          templateProvider: function(CONFIG, $http, $templateCache) {
           //   console.log('in templateUrl ' + CONFIG.codeCampType);

              var templateName = rootPath+'property_info.html';

              if (CONFIG.codeCampType === "svcc") {
                   templateName = rootPath+'property_info.html';
              }
              var tpl = $templateCache.get(templateName);

              if(tpl){
                return tpl;
              }

              return $http
                 .get(templateName)
                 .then(function(response){
                    tpl = response.data
                    $templateCache.put(templateName, tpl);
                    return tpl;
                });
          },
          controller: function ($state) {
          }
        })
        .state('homeownerInfo', {
          url: '/homeownerInfo',
          templateProvider: function(CONFIG, $http, $templateCache) {
           //   console.log('in templateUrl ' + CONFIG.codeCampType);

              var templateName = rootPath+'homeowner_info.html';

              if (CONFIG.codeCampType === "svcc") {
                   templateName = rootPath+'homeowner_info.html';
              }
              var tpl = $templateCache.get(templateName);

              if(tpl){
                return tpl;
              }

              return $http
                 .get(templateName)
                 .then(function(response){
                    tpl = response.data
                    $templateCache.put(templateName, tpl);
                    return tpl;
                });
          },
          controller: function ($state) {
          }
        }).state('lenderInfo', {
          url: '/lenderInfo',
          templateProvider: function(CONFIG, $http, $templateCache) {
           //   console.log('in templateUrl ' + CONFIG.codeCampType);

              var templateName = rootPath+'lender_info.html';

              if (CONFIG.codeCampType === "svcc") {
                   templateName = rootPath+'lender_info.html';
              }
              var tpl = $templateCache.get(templateName);

              if(tpl){
                return tpl;
              }

             return $http
                 .get(templateName)
                 .then(function(response){
                    tpl = response.data
                    $templateCache.put(templateName, tpl);
                    return tpl;
                });
          },
          controller: function ($state) {
          }
        });
        ;
    }]);


    app.directive( "rangeSlider", function ( $timeout, $filter ) {
        return {
            restrict: "A",
            template: "<label class=\"amt {{ slide.rangeSlider.cls }}\" for=\"{{ slide.rangeSlider.label }}\"><span ng-bind=\"amt\" class=\"ng-binding\"></span></label><h5 ng-if=\" amt == slide.rangeSlider.min \">or under</h5><h5 ng-if=\" amt == slide.rangeSlider.max \">or over</h5><input type=\"range\" ng-model=\"amt\" min=\"{{slide.rangeSlider.min}}\" max=\"{{slide.rangeSlider.max}}\" step=\"{{slide.rangeSlider.step}}\" id=\"{{ slide.rangeSlider.label }}\" class=\"ng-valid ng-dirty\" ng-click=\"update(slide.label, amt)\" />",
            link: function ( scope, element, attr ) {
                var index = attr.rangeSlider;
             //   scope.amt = $filter('number')(scope.slides[index].rangeSlider.def);
                scope.amt = scope.slides[index].rangeSlider.def;
            }
        }
    });

    app.directive( "toggleCls", function() {
        return {
            restrict: 'A',
            link: function( scope, element, attrs ) {
                element.bind('click', function() {
                    var args = attrs.toggleCls.split(','),
                    elm = doc.getElementsByClassName(args[0])[0],
                    cls = args[1];

                    if ( elm.classList.contains(cls) ) elm.classList.remove(cls);
                    elm.classList.add(cls);
                });
            }
        };
    });

})( angular, window, document );