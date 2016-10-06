
(function (ng, win, doc, $) {
    "use strict";

    var WZ = {
        apply: function( obj ) {
            $.extend( true, WZ, obj );
        }
    },
    content = $('.container-fluid'),
    loading = $('#loading'),
    hash = window.location.hash,
/*    p = "http://harprefiquote.com/sh1/images/",*/
    imgPath = "../img/",
    m;

    var timer = 500,               // assign slider speed
    anim = "swing",                 // assign animation style
    wrapper = $('ul'),              // slider section wrapper id
    subwrapper = $('.subWrapper'),
    max = subwrapper.length,
    lastSlide,
    activeSlide,
    cookieStr,
    paramsObj,
    mouseTimer, liW, liH, i;    
   
/*    function getCookie(name) {
        var value = document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
        if (value.length !== 0) {
            var parsedVal = value.match ( '(^|;)[\s]*' + name + '=([^;]*)' );
            console.log(parsedVal);
            return decodeURIComponent ( parsedVal ) ;
        }
    }  */  
    
    function getCookie(cname) {
        var name = cname + "=";    // "inParams="
        //console.log(name);
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
               if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }       
    
    function str_obj(str) {
        str = str.split(', ');
        var result = {};
        for (var i = 0; i < str.length; i++) {
            var cur = str[i].split('=');
            result[cur[0]] = cur[1];
        }
        return result;
    }          

    if (/(^|;)\s*inParams=/.test(document.cookie)) {
        cookieStr = decodeURIComponent ( getCookie('inParams') );
    }
    if (cookieStr) paramsObj = JSON.parse(cookieStr); 
    // console.log(cookieStr, paramsObj);    
    // $scope.ckParams = eval("(" + $scope.cookieObj.inParams + ")"); 
    
    // automagically resize parent container
    (function setSize() {    
        liW = $('li.active').width();
        liH = $('li.active').height();
        
        $('ul').css({
            'height': liH + 80
        });
        
        setTimeout(setSize, 200);
    })()
    
    WZ.apply({

        env: {
            isMobile: null,
            isPortrait: null
        },
        utils: {
            envDetect: function() {
                var userAgent = win.navigator.userAgent;
                
                return {
                    getUserAgent: function() {
                        return userAgent;
                    },
                    isiOS: function() {
                        return ( /(iPad|iPhone|iPod)/gi ).test( userAgent );
                    },
                    isAndroid: function() {
                        return ( /(Android)/gi ).test( userAgent );
                    },
                    isWindowsPhone: function() {
                        return ( /(IEMobile)/gi ).test( userAgent );
                    },
                    isBB10: function() {
                        return ( /(BB10)/gi ).test( userAgent );
                    },
                    isMobile: function() {
                        var s = this;
                        return ( s.isiOS() || s.isAndroid() || s.isWindowsPhone() || s.isBB10() );
                    }
                };
            },
        }
    });
    
    function getBrowserId () {
        var aKeys = ["MSIE", "Firefox", "Safari", "Chrome", "Opera", "Edge"],
            sUsrAg = navigator.userAgent, nIdx = aKeys.length - 1;

        for (nIdx; nIdx > -1 && sUsrAg.indexOf(aKeys[nIdx]) === -1; nIdx--);
        return nIdx
    } 
    
    var isIE = getBrowserId() <= 0;  // Detects IE
    var isSafari = getBrowserId() == 2; // Detects Safari
    var isEdge = getBrowserId() == 5; // Detects Edge
    
    window.onload = function() {
        setInterval(function() {
            content.animate({'opacity':1}, 1000, 'linear');
        }, 500);
        
/*        WZ.utils.envDetect;*/
        
    };
    
    // Check screen orientation
    function readDeviceOrientation() {
        if ( $(win).innerWidth() > $(win).innerHeight() ) {
            WZ.env.isPortrait = false;  // Landscape
        } else {
            WZ.env.isPortrait = true;   // Portrait
        }
    }

    window.onresize = readDeviceOrientation;
    readDeviceOrientation();

    // Set and recheck isMobile
    (function setMobile() {
        WZ.env.isMobile = WZ.utils.envDetect().isMobile();
        m = WZ.env.isMobile && WZ.env.isPortrait;
        setTimeout(setMobile,50);
    })();

    var app = ng.module('app', ['ngAnimate', 'mgcrea.ngStrap.modal', 'ui.router', 'ajoslin.promise-tracker', 'ui.utils.masks']),
    flowData = {};

    app.config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

         //   $urlRouterProvider.otherwise('/home');

            // States
            $stateProvider
              .state('home', {
                  url: "/home",
                  templateUrl: ''
              });
        }
    ]);

    app.controller('DataCtrl', function ($scope, $stateParams, $http, $log, promiseTracker, $timeout, $modal, $filter) {
        
/*        $http.get("../dataset.json").success( function( data, status, headers, config ) {
          $scope.slides = data.ds;

        }).error( function(data, status, headers, config ) {
            console.log("error getting resource");
        });*/

        $scope.logoUrl = "http://www.freeagent.com/components/images/company/branding/freeagent-logo-7c2816e6.png";
        $scope.domain = "FreeAgent_com"
        $scope.headline = "See Your Rates in Less than 60 Seconds!";
        $scope.subhead = "Free Program - No SSN Required* - Set to Expire in 2016";
        $scope.disclaimer = $scope.domain+' is not acting as a lender or a broker ("Service Provider"). The information provided by you to '+$scope.domain+' is not an application for a mortgage loan nor is it used to pre-qualify you with any lender. Leading Service Providers, who participate in our matching engine, may have loan products available matching the criteria you submit via our forms. If you are contacted by Service Providers, advertising within our partner network, your quoted rate may be higher, depending on your property location, credit score, debt-to-income ratio, loan-to-value ratio, and other factors. '+$scope.domain+' does not guarantee that the rates or terms offered and made available by participating Service Providers are the lowest rates available in the market or the best terms available; not all Service Providers in our network offer the products that we advertise. Completing our forms does not obligate you to purchase a service or product from the providers, nor does it obligate a provider to offer to you any particular service about which you may have inquired. Available rates and terms are subject to change daily without notice.';
        $scope.selected = 0;
        $scope.slides = {
            "0" : {
                "id": 0,
                "label": "loanType",
                "next": 1,
                "title": "Pick Your Loan Type",
                "links": [
                    {
                        "mob": imgPath+"buttons-refi-m.png",
                        "img": imgPath+"buttons-refi2.png",
                        "btn": false,
                        "val": "refinance"
                    },
                    {
                        "mob": imgPath+"buttons-purchase-m.png",
                        "img": imgPath+"buttons-purchase2.png",
                        "btn": false,
                        "val": "purchase"
                    }
                ]
            },
            "1" : {
                "id": 1,
                "label": "propertyType",
                "prev": 0,
                "next": 2,
                "title": "What Type of Property do you have?",
                "links": [
                    {
                        "mob": imgPath+"buttons-single-m.png",
                        "img": imgPath+"buttons-single2.png",
                        "btn": false,
                        "val": "single"
                    },
                    {
                        "mob": imgPath+"buttons-multi-m.png",
                        "img": imgPath+"buttons-multi2.png",
                        "btn": false,
                        "val": "multi"
                    },
                    {
                        "mob": imgPath+"buttons-condo-m.png",
                        "img": imgPath+"buttons-condo2.png",
                        "btn": false,
                        "val": "condo"
                    },
                    {
                        "mob": imgPath+"buttons-mobile-m.png",
                        "img": imgPath+"buttons-mobile2.png",
                        "btn": false,
                        "val": "mobile"
                    }
                ]
            }          
        };

        function addOrUpdateUrlParam(name, value)
        {
          var href = window.location.href;
          var regex = new RegExp("[&\\?]" + name + "=");
          if(regex.test(href))
          {
            regex = new RegExp("([&\\?])" + name + "=\\d+");
            window.location.href = href.replace(regex, "$1" + name + "=" + value);
          }
          else
          {
            if(href.indexOf("?") > -1)
              window.location.href = href + "&" + name + "=" + value;
            else
              window.location.href = href + "?" + name + "=" + value;
          }
        }


        $scope.update = function(k, v) {

            flowData[k] = v;
/*            window.location.hash = k;
            addOrUpdateUrlParam(k, v);*/
/*            console.log(flowData);*/
            
            if (flowData.loanType === "purchase") {
                
                if (flowData.loanType === "refinance") {
                    $scope.update('loanType','purchase');
                }
                    
                $scope.slides = {
                    "0" : {
                        "id": 0,
                        "label": "loanType",
                        "next": 1,
                        "title": "Pick Your Loan Type",
                        "links": [
                             {
                                "mob": imgPath+"buttons-refi-m.png",
                                "img": imgPath+"buttons-refi2.png",
                                 "btn": false,
                                 "val": "refinance"
                             },
                            {
                                "mob": imgPath+"buttons-purchase-m.png",
                                "img": imgPath+"buttons-purchase2.png",
                                "btn": false,
                                "val": "purchase"
                            }
                        ]
                    },
                    "1" : {
                        "id": 1,
                        "label": "propertyType",
                        "prev": 0,
                        "next": 2,
                        "title": "What Type of Property do you have?",
                        "links": [
                            {
                                "mob": imgPath+"buttons-single-m.png",
                                "img": imgPath+"buttons-single2.png",
                                "btn": false,
                                "val": "single"
                            },
                            {
                                "mob": imgPath+"buttons-multi-m.png",
                                "img": imgPath+"buttons-multi2.png",
                                "btn": false,
                                "val": "multi"
                            },
                            {
                                "mob": imgPath+"buttons-condo-m.png",
                                "img": imgPath+"buttons-condo2.png",
                                "btn": false,
                                "val": "condo"
                            },
                            {
                                "mob": imgPath+"buttons-mobile-m.png",
                                "img": imgPath+"buttons-mobile2.png",
                                "btn": false,
                                "val": "mobile"
                            }
                        ]
                    },
                    "2" : {
                        "id": 2,
                        "label": "creditRating",
                        "prev": 1,
                        "next": 3,
                        "title": "How is Your Credit?",
                        "links": [
                            {
                                "mob": imgPath+"buttons-excellent-m.png",
                                "img": imgPath+"buttons-excellent.png",
                                "btn": false,
                                "val": "excellent"
                            },
                            {
                                "mob": imgPath+"buttons-good-m.png",
                                "img": imgPath+"buttons-good.png",
                                "btn": false,
                                "val": "good"
                            },
                            {
                                "mob": imgPath+"buttons-fair-m.png",
                                "img": imgPath+"buttons-fair.png",
                                "btn": false,
                                "val": "fair"
                            },
                            {
                                "mob": imgPath+"buttons-poor-m.png",
                                "img": imgPath+"buttons-poor.png",
                                "btn": false,
                                "val": "poor"
                            }
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
                        "label": "gotRealtor",
                        "prev": 3,
                        "next": flowData.homeFound === "yes" ? 5 : 42,
                        "title": "Are You Working with a Realtor?",
                        "links": [
                            { "img": "", "btn": true, "val": "yes" },
                            { "img": "", "btn": true, "val": "no" }
                        ]
                    },                    
                    "40" : {
                        "id": 40,
                        "label": "newPrice",
                        "prev": 4,
                        "next": 6,
                        "title": "What is the Price of the New Home?",
                        "rangeSlider": {
                            "unit": "currency",
                            "min": 80000,
                            "max": 1000000,
                            "def": flowData.newPrice ? flowData.newPrice : 200000,
                            "step": 5000
                        }
                    },
                    "6" : {
                        "id": 6,
                        "label": "borrowAmt",
                        "prev": 4,
                        "next": flowData.homeFound === "yes" ? 42 : 41,
                        "title": "How much cash do you need to borrow?",
                        "rangeSlider": {
                            "unit": "currency",
                            "min": 0,
                            "max": flowData.newPrice,
                            "def": flowData.newPrice ? flowData.newPrice : 0,
                            "step": 5000
                        }
                    },                    
                    "41" : {
                        "id": 41,
                        "label": "propertyAddress",
                        "prev": 4,
                        "next": 43,
                        "title": "What is your home address?",
                        "templateUrl": "forms/property_info.html"
                    },
                    "42" : {
                        "id": 42,
                        "label": "propertyAddress",
                        "prev": 4,
                        "next": 43,
                        "title": "What is your CURRENT address?",
                        "templateUrl": "forms/property_info.html"
                    },
                    "43" : {
                        "id": 43,
                        "label": "homeownerInfo",
                        "prev": flowData.homeFound === "yes" ? 41 : 42,
                        "next": 44,
                        "title": "Please verify homeowner information",
                        "templateUrl": "forms/homeowner_info.html"
                    }
                }
            }

            if (flowData.loanType === "refinance") {
                
                if (flowData.loanType === "purchase") {
                    $scope.update('loanType','refinance');
                };

                $scope.slides = {
                    "0" : {
                        "id": 0,
                        "label": "loanType",
                        "next": 1,
                        "title": "Pick Your Loan Type",
                        "links": [
                             {
                                "mob": imgPath+"buttons-refi-m.png",
                                "img": imgPath+"buttons-refi2.png",
                                 "btn": false,
                                 "val": "refinance"
                             },
                            {
                                "mob": imgPath+"buttons-purchase-m.png",
                                "img": imgPath+"buttons-purchase2.png",
                                "btn": false,
                                "val": "purchase"
                            }
                        ]
                    },
                    "1" : {
                        "id": 1,
                        "label": "propertyType",
                        "prev": 0,
                        "next": 2,
                        "title": "What is your Property Type?",
                        "links": [
                            {
                                "mob": imgPath+"buttons-single-m.png",
                                "img": imgPath+"buttons-single2.png",
                                "btn": false,
                                "val": "single"
                            },
                            {
                                "mob": imgPath+"buttons-multi-m.png",
                                "img": imgPath+"buttons-multi2.png",
                                "btn": false,
                                "val": "multi"
                            },
                            {
                                "mob": imgPath+"buttons-condo-m.png",
                                "img": imgPath+"buttons-condo2.png",
                                "btn": false,
                                "val": "condo"
                            },
                            {
                                "mob": imgPath+"buttons-mobile-m.png",
                                "img": imgPath+"buttons-mobile2.png",
                                "btn": false,
                                "val": "mobile"
                            }
                        ]
                    },
                    "2" : {
                        "id": 2,
                        "label": "creditRating",
                        "prev": 1,
                        "next": 3,
                        "title": "How is Your Credit?",
                        "links": [
                            {
                                "mob": imgPath+"buttons-excellent-m.png",
                                "img": imgPath+"buttons-excellent.png",
                                "btn": false,
                                "val": "excellent"
                            },
                            {
                                "mob": imgPath+"buttons-good-m.png",
                                "img": imgPath+"buttons-good.png",
                                "btn": false,
                                "val": "good"
                            },
                            {
                                "mob": imgPath+"buttons-fair-m.png",
                                "img": imgPath+"buttons-fair.png",
                                "btn": false,
                                "val": "fair"
                            },
                            {
                                "mob": imgPath+"buttons-poor-m.png",
                                "img": imgPath+"buttons-poor.png",
                                "btn": false,
                                "val": "poor"
                            }
                        ]
                    },
                    "3" : {
                        "id": 3,
                        "label": "propertyValue",
                        "prev": 2,
                        "next": 4,
                        "title": "What is your Property Value?",
                        "rangeSlider": {
                            "unit": "currency",
                            "min": 80000,
                            "max": 1000000,
                            "def": flowData.propertyValue ? flowData.propertyValue : 250000,
                            "step": 5000
                        }
                    },
                    "4" : {
                        "id": 4,
                        "label": "mortgageBalance",
                        "prev": 3,
                        "next": 5,
                        "title": "What is your Mortgage Balance?",
                        "rangeSlider": {
                            "unit": "currency",
                            "min": 50000,
                            "max": 1000000,
                            "def": flowData.mortgageBalance ? flowData.mortgageBalance : 200000,
                            "step": 5000
                        }
                    },
                    "5" : {
                        "id": 5,
                        "label": "currentRate",
                        "prev": 4,
                        "next": flowData.creditRating === "excellent" || flowData.creditRating === "good" ? 61 : 51,
                        "title": "What is your Current Interest Rate?",
                        "rangeSlider": {
                            "unit": "percentage",
                            "min": 3,
                            "max": 10,
                            "def": flowData.currentRate ? flowData.currentRate : 4.5,
                            "step": 0.125
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
                        "label": "propertyAddress",
                        "prev": flowData.creditRating === "excellent" || flowData.creditRating === "good" ? 5 : 52,
                        "next": 62,
                        "title": "What is your Property Address?",
                        "templateUrl": "forms/property_info.html"
                    },
                    "62" : {
                        "id": 62,
                        "label": "homeownerInfo",
                        "prev": 61,
                        "title": "Please verify you are the homeowner",
                        "templateUrl": "forms/homeowner_info.html"
                    }
                }
            }
        
        }

        $scope.selected = $scope.setNum;
        $scope.selected = 0;
        $scope.select= function(index) {
           $scope.selected = index; 
        };
        
        $scope.setNum = function(index) {
            return this.index;
        };        
        
        $scope.setActive = function (index) {
           return $scope.selected === index;
        }        
        
        this.panel = 0;
        this.isSet = function(checkPanel) {
          return this.panel === checkPanel;
        };
        this.setPanel = function(setPanel) {
            var $this = $('li').eq(this.panel),
            $next = $('li').eq(setPanel),
            $prev = $('li').eq(setPanel);
            
            // scroll to top after every panel
            $('html,body').scrollTop(0);
            
            if (setPanel || setPanel >= 0) {
                
                if ( this.panel < setPanel ) {
                  
                    $this.css( 'top',0 ).stop().animate({
                        'top':-liH
                    }, timer, anim).removeClass('active');
                    
                    $next.css('top',liH).stop().animate({
                        'top':'40px'
                    }, timer, anim).addClass('active');
                          
                    
                    if( setPanel == 40 || setPanel == 6 || setPanel == 61 || setPanel == 51 || setPanel == 52 || setPanel == 41 || setPanel == 42 ) {
                        $('li').removeClass('active');
                        $('#slide'+setPanel).css('top','500px').stop().animate({
                            'top':'40px'
                        }, timer, anim).addClass('active');
                    }                             
                    
                    if( setPanel == 43 || setPanel == 62 ) {
                        $('li').removeClass('active');
                        $('#slide'+setPanel).css('top',liH).stop().animate({
                            'top':'40px'
                        }, timer, anim).addClass('active');
                    }                     
                                    
                    
                } else {                
                    
                    $this.css( 'top',0 ).stop().animate({ 
                        'top': liH
                    },timer, anim).removeClass('active');
 
                    $prev.css( 'top',-liH ).stop().animate({
                        'top': '40px'
                    },timer, anim).addClass('active');

                    if( setPanel == 40 || setPanel == 6 || setPanel == 61 || setPanel == 51 || setPanel == 52 || setPanel == 41 || setPanel == 42 ) {
                        $('#slide'+this.panel).css( 'top',0 ).stop().animate({ 
                            'top': liH
                        },timer, anim).removeClass('active');
                        
                        $('#slide'+setPanel).css('top', -liH).stop().animate({
                            'top':'40px'
                        }, timer, anim).addClass('active');
                    }                    
                    
                    if( this.panel == 6 || this.panel == 61 || this.panel == 62 || this.panel == 41 || this.panel == 42 || this.panel == 43 ) {
                        $('#slide'+this.panel).css( 'top',0 ).stop().animate({ 
                            'top': liH
                        },timer, anim).removeClass('active');
                        
                        $prev.css('top',-liH).stop().animate({
                            'top':'40px'
                        }, timer, anim).addClass('active');
                    }    
                    
                }
                
                this.panel = setPanel;
            }
            
            else return false
        };

        function removeHash () {
            history.pushState("", document.title, window.location.pathname + window.location.search);
            window.location.hash = "loanType";
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


    app.controller( 'FormCtrl', function($scope, $stateParams, $http, $log, promiseTracker, $timeout, $modal, $filter, $q ){
        
        $scope.emailValid = false;
        $scope.phoneValid = false;
        $scope.formData = {};
        $scope.testEmail = function(value) {
            $.ajax({
                url:"http://harprefiquote.com/validate.php",
                data: {
                    action: 'email',
                    email: value
                },
                async: true,
                success: function(data) {
                    if(data == 'bad') $scope.emailValid = false;
                    else if(data == 'OK') $scope.emailValid = true;
                    else $scope.emailValid = false;
                }
            });
            return $scope.emailValid;
        };

        $scope.testPhone = function(value) {
            $.ajax({
                url:"http://harprefiquote.com/validate.php",
                data: {
                    action: 'phone',
                    homephone: value
                },
                async: true,
                success: function(data) {
                    if(data == 'bad') $scope.phoneValid = false;
                    else if(data == 'OK') $scope.phoneValid = true;
                    else $scope.phoneValid = false;
                }
            });
            return $scope.phoneValid;
        };        
        
        
        var modal = $modal({
            title: "Confirmation",
            content: "Thank you for completing this form. An agent will contact you shortly regarding your submission.",
            templateUrl: '../modal/modal.tpl.html',
            animation: '',
            show: false
        }),
        submitDone;

        $scope.submitted = false;
        $scope.completed = false;

        // Inititate the promise tracker to track form submissions.
        $scope.progress = promiseTracker();

        // Form submit handler.
        $scope.submit = function(form, valid, next) {            

            $scope.update = function(k, v) {
                flowData[k] = v;
            }
            
            // This stores the values in the fields on Next
            if (flowData.propertyAddress) {
                $scope.address = flowData.propertyAddress.split(',')[0];
                $scope.zip = flowData.propertyAddress.split(',')[1];
            }

            if (flowData.lenderInfo) {
                $scope.lender = flowData.lenderInfo;
            }            
            
            // If form is invalid, return and let AngularJS show validation errors.
            if (form.$invalid || form.$required) {
                // Trigger validation flag.
                $scope.submitted = true;
                $scope.completed = false;
                submitDone = $('input.ng-invalid-required').hasClass('submitted');
                submitDone || $('input.ng-invalid-required').addClass('submitted');
                
                return;
            } else {
                $scope.completed = true;

                if (!$scope.phoneValid) $scope.completed = false;
                else $scope.completed = true;
                    
                if (next) {
                } else {                 

                    if (flowData.homeownerInfo) {
                        $scope.first = flowData.homeownerInfo.split(',')[0];
                        $scope.last = flowData.homeownerInfo.split(',')[1];
                        $scope.email = flowData.homeownerInfo.split(',')[2];
                        $scope.phoneNumber = flowData.homeownerInfo.split(',')[3];
                        $scope.GUID = $('#leadid_token').val();
                    }
                    
                    // Default values for the request.
                    var config = {
                        params : {
                            'callback' : 'JSON_CALLBACK',
                            'cookieObj' : $scope.cookie,
                            'deviceEnv' : WZ.utils.envDetect().getUserAgent(),
                            'loanType' : flowData.loanType,
                            'propertyType' : flowData.propertyType,
                            'creditRating' : flowData.creditRating,
                            'propertyValue' : flowData.propertyValue,
                            'lateMortgage' : flowData.lateMortgage,
                            'address' : $scope.address,
                            'zip' : $scope.zip,
                            'first' : $scope.first,
                            'last' : $scope.last,
                            'email' : $scope.email,
                            'phone' : $scope.phoneNumber
                        },
                    };

/*                    var req = {
                        method: 'POST',
                        url: '/submit/',
                        data: paramsObj && {
                            // 'cookieValue': JSON.stringify($scope.cookie),
                            //  'cookieValue': paramsStr,
                            'mediatag' : paramsObj.mediatag || null,
                            'sub_id' : paramsObj.sub_id || null,
                            'click_id' : paramsObj.click_id || null,
                            's1' : paramsObj.s1 || null,
                            's2' : paramsObj.s2 || null,
                            's3' : paramsObj.s3 || null,
                            'GUID' : $scope.GUID || null,
                            'deviceEnv' : WZ.utils.envDetect().getUserAgent(),
                            'loanType': flowData.loanType,
                            'propertyType': flowData.propertyType,
                            'creditRating': flowData.creditRating,
                            'currentRate': flowData.currentRate,
                            'propertyValue': flowData.propertyValue,
                            'mortgageBalance': flowData.mortgageBalance,
                            'lateMortgage': flowData.lateMortgage,
                            'lenderInfo': flowData.lender,
                            'homeFound':  flowData.homeFound,
                            'gotRealtor': flowData.gotRealtor,
                            'newPrice': flowData.newPrice,
                            'borrowAmt': flowData.borrowAmt,
                            'address' : $scope.address,
                            'zip' : $scope.zip.replace(" ",""),
                            'first' : $scope.first.replace(" ",""),
                            'last' : $scope.last.replace(" ",""),
                            'email' : $scope.email.replace(" ",""),
                            'phone' : $scope.phoneNumber.replace(" ","")
                        }
                    };*/

                    // Perform JSONP request
                    var $promise = $http.jsonp('response.json', config)
                    // Perform POST server request
                    // var $promise = $http(req)
                    .success(function(data, status, headers, config) {
                        if (data.status == 'OK') {
//                        if (data && paramsObj) {
                            if ( form.$valid && flowData.homeownerInfo ) {

                                if (WZ.env.isMobile) {
                                    $scope.showModal = function() {
                                        modal.$promise.then(modal.show);
                                    };

                                    $scope.showModal('thanksModal');
                                    setInterval(function() {
                                        window.location.href = "https://www.helpscout.net/images/blog/2014/jan/all-set.png";
                                    }, 4000);
                                }
                                else {
                                    setInterval(function() {
                                        window.location.href = "https://www.helpscout.net/images/blog/2014/jan/all-set.png";
                                    }, 1000);
                                }
                            }

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
                      //  $scope.messages = 'There was a network error. Try again later.';
                        $scope.messages = 'Sorry. There was an error completing your form.';
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
                }

            }
        };

        $scope.testPhonePattern = (function() {
            var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
            return {
                test: function(value) {
                    return regexp.test(value);
                }
            };
        })();

    });


    var myConstant = {},
    rootPath = "../../forms/";
    myConstant.codeCampType = "svcc";
    app.constant("CONFIG", myConstant);

    app.config(['$stateProvider', '$urlRouterProvider','CONFIG', function ($stateProvider, $urlRouterProvider,CONFIG) {
        $stateProvider
        .state('propertyAddress', {
          url: '/propertyAddress',
          templateProvider: function(CONFIG, $http, $templateCache) {

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

              if(tpl) {
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
        })
    }]);

    app.filter('percentage', ['$filter', function ($filter) {
        return function (input, decimals) {
            return $filter('number')(input, decimals) + '%';
        };
    }])
    .filter('currency', ['$filter', function ($filter) {
        return function (input) {
            return '$' + $filter('number')(input);
        };
    }])
    .filter('split', ['$filter', function ($filter) {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            if ( splitChar && splitIndex < input.split(splitChar).length )
            return input.split(splitChar)[splitIndex];
        }
    }]);

/*    app.directive("onInputChange", function() {
        return {
            restrict: "A",
            require : ['ngModel'],
            compile: function($element, $attr) {
                return function linkDateTimeSelect(scope, element, attrs, controllers) {
                    var ngModelController = controllers[0];
                    scope.$watch($attr.onInputChange, function watchOnInputChange(value) {
//                        console.log( element.attr('class', onInputChange.$attr) );
                        console.log(1);
                        ngModelController.$render();
                    })
                }
            }
        }
    });*/

    app.directive( "rangeSlider", function ( $timeout, $filter ) {
        return {
            restrict: "A",
            template: "<div style=\"height:60px;\"><input class=\"amt\" type=\"text\" ng-bind=\"amt | {{slide.rangeSlider.unit}} \" ng-value=\"amt | {{slide.rangeSlider.unit}} \" /><div><h5 ng-if=\" amt <= slide.rangeSlider.min \">or under</h5><h5 ng-if=\" amt == slide.rangeSlider.max \">or over</h5></div></div><input id=\"range-slider-{{slide.id}}\" type=\"range\" ng-model=\"amt\" ng-min=\"slide.rangeSlider.min\" ng-max=\"slide.rangeSlider.max\" step=\"{{slide.rangeSlider.step}}\" class=\"ng-valid ng-dirty range\" ng-click=\"update(slide.label, amt)\"  style=\"max-width:300px; margin:0 auto;\" />",
            link: function ( scope, element, attr ) {                
                var index = attr.rangeSlider,
                ratio, amt, $this, $parent,
                dragging = false,
                isClicked = false,
                isDragging = false, 
                xPos, yPos;
                scope.amt = scope.amt || scope.slides[index].rangeSlider.def;
                // scope.amt = scope.slides[index].rangeSlider.def;
                scope.max = scope.slides[index].rangeSlider.max;
                scope.unit = scope.slides[index].rangeSlider.unit;
                scope.step = scope.slides[index].rangeSlider.step;
                
                // hacks for crappy IE & Safari
                if ( isIE || isEdge ) {
                    $('input[type="range"]').css('height', 'auto');
                    element.on('change',function() {
                        if (scope.unit === 'currency')
                            element.find('.amt').val('$'+$filter('number')(scope.amt));
                        else 
                            element.find('.amt').val($filter('number')(scope.amt)+'%');
                    }); 
                    
                    
 /*                   element.on('mousedown',function(e) {
                        isClicked = true;
                        isDragging = false;
                                                
                    //    console.log("MOUSEDOWN - CLICKED: "+isClicked, "DRAGGING: "+isDragging);
                    })
                    .on('mouseup',function(e) {  
                        isClicked = false;
                        var wasDragging = isDragging;
                        isDragging = false;
                   //     console.log("MOUSEUP - CLICKED: "+isClicked, "DRAGGING: "+isDragging);
                        
                     //   if (!wasDragging) {
                            var clicked = e.originalEvent && e.originalEvent.clicked && e.originalEvent.clicked[0];
                            e = clicked || e;
                            var offset = ng.element(e.target).offset(),
                            x = e.pageX - offset.left;
                            if ( x <= 0 ) xPos = 80000;
                            else if ( x >= element.width() ) xPos = 1000000;
                            else xPos = x/element.width() * scope.max;
                            
                        
                            element.val(xPos);

                     //   } 
                    })
                    .on("mousemove", function(e){
                        isDragging = true;
                  //      console.log("MOUSEMOVE - CLICKED: "+isClicked, "DRAGGING: "+isDragging);                        

                        
                        var clicked = e.originalEvent && e.originalEvent.clicked && e.originalEvent.clicked[0];
                        e = clicked || e;
                        var offset = ng.element(e.target).offset(),
                        x = e.pageX - offset.left;
                        if ( x <= 0 ) xPos = 80000;
                        else if ( x >= element.width() ) xPos = 1000000;
                        else xPos = x/element.width() * scope.max;                
                        
                        console.log(x, "ELEMENT WIDTH: "+element.width(), ", MAX SCOPE: "+scope.max );
                        
                        if ( isClicked && isDragging ) {
                            if (scope.unit === 'currency')
                                element.find('.amt').val( '$'+$filter('number')(Math.rand(xPos * 1000)/1000 ) );
                            else 
                                element.find('.amt').val( Math.round( Math.round( ((xPos)*1000 )/1000) / scope.step)*scope.steimgPath+'%');             
                            
                            element.val(xPos);
                        
                       //     console.log( "X-POSITION: "+xPos, "THIS WIDTH: "+element.width(), "SCOPE MAX: "+scope.max );
                        }                                               
                    });                     
                    */
                    
                }                
                       
                
                if ( isSafari ) {
                    element.find('input[type="range"]').on('touchstart',function(e) {
                        $this = $(this);
                        $parent = $(this).parent();
                        dragging = false;    
                        var touch = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
                        e = touch || e;
                        var offset = $(e.target).offset(),
                        x = e.pageX - offset.left;
                        ratio = x / $this.width();
                        amt = Math.round( (ratio * scope.max) / scope.step ) * scope.step;
                        
                        if (!dragging) {
                            xPos = x;                      
                            $parent.find('.amt').val( scope.unit === 'currency' ? '$'+$filter('number')(amt) : $filter('number')(amt)+'%' );
                            $this.val(amt);
                        }
                    })
                    .on('touchend',function(event) {
                        dragging = false;
                    })
                    .on("touchmove", function(e){
                        dragging = true; 
                        if (scope.unit === 'currency')
                            element.find('.amt').val('$'+$filter('number')(scope.amt));
                        else 
                            element.find('.amt').val($filter('number')(scope.amt)+'%');
                        
                        element.val(xPos/element.width() * scope.max);
                    });                      
                }
                
                
/*                if ( isEdge ) {
                    
                    element.bind('mousedown',function(e) {
                        isClicked = true;
                        isDragging = false;
                                                
                        console.log("MOUSEDOWN - CLICKED: "+isClicked, "DRAGGING: "+isDragging);
                    });
                    element.bind('mouseup',function(e) {  
                        isClicked = false;
                        var wasDragging = isDragging;
                        isDragging = false;
                        console.log("MOUSEUP - CLICKED: "+isClicked, "DRAGGING: "+isDragging);
                        
                     //   if (!wasDragging) {
                            var clicked = e.originalEvent && e.originalEvent.clicked && e.originalEvent.clicked[0];
                            e = clicked || e;
                            var offset = $(e.target).offset(),
                            x = e.pageX - offset.left + 14;
                            xPos = x;

                            $(this).val(xPos/$(this).width() * scope.max);

                     //   } 
                    });
                    element.bind("mousemove", function(e){
                        isDragging = true;
                        console.log("MOUSEMOVE - CLICKED: "+isClicked, "DRAGGING: "+isDragging);                        

                        
                        var clicked = e.originalEvent && e.originalEvent.clicked && e.originalEvent.clicked[0];
                        e = clicked || e;
                        var offset = $(e.target).offset(),
                        x = e.pageX - offset.left + 14;
                        xPos = x;                        
                        
                        if ( isClicked && isDragging ) {
                            if (scope.unit === 'currency')
                                element.find('.amt').val( '$'+$filter('number')( Math.round( (xPos/element.width() * scope.max)/scope.step) * scope.step ) );
                            else 
                                element.find('.amt').val( Math.round( Math.round( ((xPos/element.width() * scope.max)*1000 )/1000) / scope.step)*scope.steimgPath+'%');             
                            
                            element.val(xPos/$element.width() * scope.max);
                        
                            console.log( "X-POSITION: "+xPos, "THIS WIDTH: "+$(this).width(), "SCOPE MAX: "+scope.max );
                        }                                               
                    });   
                                     
                }     */                  
                    
                
            }
        }
    })
    .directive( "toggleCls", function() {
        return {
            restrict: 'A',
            link: function( scope, element, attrs ) {
                element.bind('click', function() {
                    var args = attrs.toggleCls.split(','),
                    elm = doc.getElementsByClassName(args[0])[0],
                    cls = args[1];
//                    console.log(cls);
                    if ( elm.classList.contains(cls) )
                        elm.classList.remove(cls);
                    else
                        elm.classList.add(cls);
                });
            }
        };
    })
    .directive( "slideAnim", function() {
        return {
            restrict: 'A',
            link: function( scope, element, attrs ) {
                $('.next').on('click', function() {
                    $('ul').css('height','auto').stop().animate({'height':$('.subWrapper').innerHeight()+120+'px'},100, 'linear');
                    $('li').css('top',$(win).innerHeight()).stop().animate({'top':0},500, 'swing');        
                

/*var args = attrs.slideAnim;
var max = $('li').length;                    

console.log(args, max);
                    
function goToSlide(slideIdx) {


    var i = args;
    var $this = $('li');   
    
    console.log( $(this).attr('data-slide'), $this, $next);

    $this.css( 'top',0 ).stop(true, true).animate({
        'top':-liH
    }, timer, anim).removeClass('active');
    $next.css( 'top',liH ).stop(true, true).animate({
        'top':0
    }, timer, anim).addClass('active');

}            


$('.next').on('click', function() {
    console.log(1);
 //   resizeAll();
    var slideNum = $(this).attr('data-slide');
    lastSlide = $(this).attr('data-origin');

        slideNum = args;
        goToSlide(slideNum + 1);
  //  }

});

$('.prev').on('click', function() {
    resizeAll();
    var slideNum = $(this).attr('data-slide');

    if (slideNum) {
        goToSlide(slideNum);
    } else {
        slideNum = $('li').index($('.active'));
        goToSlide(Math.abs(i-1));
    }
});      */               
                    
                })
            }
        };
    })
    .directive('launchModal', function($modal) {
        return {
            restrict: 'A',
            scope: false,
            link: function( scope, element, attrs, parentScope ) {
                var modal = $modal({
                    title: "Confirmation",
                    content: "Thank you for completing this form. An agent will contact you shortly regarding your submission.",
                    templateUrl: '../modal/modal.tpl.html',
                    animation: 'am-fade-and-scale',
                    show: false
                });
            }
        }
    })
    .directive('ngMin', function() {
        return {
            restrict : 'A',
            require : ['ngModel'],
            compile: function($element, $attr) {
                return function linkDateTimeSelect(scope, element, attrs, controllers) {
                    var ngModelController = controllers[0];
                    scope.$watch($attr.ngMin, function watchNgMin(value) {
                        element.attr('min', value);
                        ngModelController.$render();
                    })
                }
            }
        }
    })
    .directive('ngMax', function() {
        return {
            restrict : 'A',
            require : ['ngModel'],
            compile: function($element, $attr) {
                return function linkDateTimeSelect(scope, element, attrs, controllers) {
                    var ngModelController = controllers[0];
                    scope.$watch($attr.ngMax, function watchNgMax(value) {
                        element.attr('max', value);
                        ngModelController.$render();
                    })
                }
            }
        }
    })
    .directive('ngEnter', function () {
        return {
            controller: function ($scope) {
                return function (scope, element, attrs) {
                    element.bind("keydown keypress", function (event) {
                        if(event.which === 13) {
                            scope.$apply(function (){
                                scope.$eval(attrs.ngEnter);
                                $scope.setPanel($scope.slide.next);
                            });

                            event.preventDefault();
                        }
                    })
                }
            }
        }

    });
    
})( angular, window, document, jQuery );