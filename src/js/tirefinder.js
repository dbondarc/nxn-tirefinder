// Tire Tables
var tireJson = "src/data/nexen_tire.json",
    tireSizeJson = "src/data/nexen_tiresize.json",
    vehicleJson = "src/data/nexen_vehicle.json",
    tireImgJson = "src/data/nexen_tireimage.json",
    tireMediaJson = "src/data/nexen_tiremedia.json";

var make, year, model, style, tirewidth, tireratio, rimsize;
var subsetData = [];
var app = angular.module( "NexenTireFinder", [] );

function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

app.controller( "DataCtrl", function( $scope, $http ) {

    $scope.active = false;
    
 
    
/*    function getData() {
        $http.get(tireJson).
        success( function( data, status, headers, config ) {
            console.log(data);
        }).
        error( function(data, status, headers, config ) {
            console.log("error getting resource");
        });

    }        
    */
    
    function getVehicleData() {
        $http.get(vehicleJson).
        success( function( data, status, headers, config ) {

            $scope.vehicleData = [];
            $scope.tireSizeData = [];
            $scope.years = [];
            $scope.makes = [];
            $scope.sizes = [];
            $scope.tireIds = [];
            $scope.widths = [];
            $scope.ratios = [];
            $scope.rims = [];
            $scope.position = [];
            $scope.selectedYear = 0; 
            $scope.selectedMake = 0;
            $scope.selectedModel = 0;
            $scope.selectedStyle = 0;
            $scope.selectedWidth = 0;
            $scope.selectedRatio = 0;
            $scope.selectedRim = 0;
            $scope.selectedSize = 0;
            $scope.results = [];
            $scope.sbvValid = false;
            $scope.sbsValid = false;
            $scope.done = false;
            $scope.changed = false;
            
            for (key in data) {
                if (data[key] && typeof key === "string") {
                    $scope.vehicleData.push(data[key]);
                    $scope.years.push(data[key].Year);
                //    $scope.makes.push(data[key].Make);
                }
            }

            // Set options for vehicle year
            $scope.year = {
                "type": "select", 
                "label": "Select Year",
                "name": "year",
                "value": uniq($scope.years).reverse()
            };

            data = $scope.vehicleData;
            
            for (key in data) {
                console.log(data[key].Make);
                if ( data[key].Make ) {
                    $scope.makes.push(data[key].Make) 
                }
            }
            
            // Set options for vehicle make
            $scope.make = {
                "type": "select", 
                "label": "Select Make",
                "name": "make", 
                "value": uniq($scope.makes)
            };            

            // Set defaults for vehicle model
            $scope.model = {
                "type": "select", 
                "label": "Select Model",
                "name": "model", 
                "value": ""
            };   

            // Set defaults for vehicle style
            $scope.style = {
                "type": "select", 
                "label": "Select Style",
                "name": "style", 
                "value": ""
            };
            
            getTireData();
            
        }).
        error( function(data, status, headers, config ) {
            console.log("error getting resource");
        });

    }

    function getTireData() {
        $http.get(tireSizeJson).
        success( function( data, status, headers, config ) {
            for (key in data) {
                if (data[key] && typeof key === "string") {
                    $scope.tireSizeData.push(data[key]);
                    $scope.widths.push(data[key].tireWidth);
                }
            }
            
            // Set options for tire width
            $scope.tirewidth = {
                "type": "select", 
                "label": "Tire Width",
                "name": "tirewidth",
                "value": uniq($scope.widths)
            };
            
            // Set options for tire ratio
            $scope.tireratio = {
                "type": "select", 
                "label": "Tire Ratio",
                "name": "tireratio", 
                "value": ""
            };            

            // Set defaults for rim size
            $scope.rimsize = {
                "type": "select", 
                "label": "Rim Size",
                "name": "rimsize", 
                "value": ""
            };            
            
        }).
        error( function(data, status, headers, config ) {
            console.log("error getting resource");
        });

    }    
    
    $scope.update = function() {
        var data;
        var allData = [];
        var models = [];
        var styles = [];
        subsetData = [];
        $scope.noMatches = false;
        $scope.done = false;
        $scope.changed = true;

        if ($scope.active === "SBV") {  // Search By Vehicle only

            data = $scope.vehicleData;
            make = $scope.selectedMake;
            year = $scope.selectedYear;
            model = $scope.selectedModel;
            style = $scope.selectedStyle;

            if ($scope.years.length > 0) {
                $scope.makes = []; 
                $scope.models = [];
                $scope.styles = [];
                $scope.sizes = [];
            
                for (i in data) {
                    if ( make && make == data[i].Make ) {

                        if ( year && year == data[i].Year ) {
                            models.push(data[i].Model);

                            if ( model && model == data[i].Model ) {
                                styles.push(data[i].Style);
                                
                                if ( style && style == data[i].Style ) {
                                    
                                    $scope.sizes.push(data[i].Size);
                                    subsetData.push(data[i]);

                                }
                            }
                        }
                    }
                }

                $scope.model.value = uniq(models);
                if (models) $scope.style.value = uniq(styles);
                
                

                console.log(subsetData, subsetData.length);
            
            }
        
        }
            
        if ($scope.active === "SBS") {  // Search By Size only
            
            data = $scope.tireSizeData;
            tirewidth = $scope.selectedWidth;
            tireratio = $scope.selectedRatio;
            rimsize = $scope.selectedRim;
            
            if ($scope.widths.length > 0) {
                $scope.ratios = []; 
                $scope.rims = [];
                $scope.sizes = [];
                
                for (n in data) {
                    if ( tirewidth && tirewidth == data[n].tireWidth ) {
                        $scope.ratios.push(data[n].tireRatio);
                        if ( tireratio && tireratio == data[n].tireRatio ) {
                            $scope.rims.push(data[n].rimSize);
                        }
                    }
                }
            }
                      
            $scope.tireratio.value = uniq($scope.ratios);
            $scope.rimsize.value = uniq($scope.rims);
            $scope.sizes.push(tirewidth+"/"+tireratio+"R"+rimsize);
        }
        
    };
    
    $scope.matchTireSize = function(x) {
        
        console.log(x);
        $scope.results = [];
               
        if (subsetData.length === 1) {
            console.log( "Only one size available for this vehicle");
            
            // check if tire size has same front and back
            if (subsetData[0].Position === "Both" ) {
                $scope.sizes === subsetData[0].Size;
                $scope.tireIds.push(subsetData[0].idTire);
                $scope.selectedFront = $scope.selectedBack = subsetData[0].Size; 
                                    
                //$scope.tireIds = uniq($scope.tireIds);
                $scope.done = true;
                
                console.log($scope.sizes, $scope.tireIds);
            }
        }
        else if (subsetData.length > 1) {
            console.log( "Multiple sizes available for this vehicle");
            
            // wait for user to select size
        }
        else { 
            console.log( "No sizes are available for this vehicle");
            // show no matches found
            $scope.noMatches = true;
        }
    

/*        if ( data[i].Position === "Both" ) {
            console.log( "Both Front and Rear are same size");
            // display same Tire Size value for both Front and Rear
            $scope.tireFront = $scope.tireRear = data[i].size;
        }
        
        else {
            // store the results in sizes[]
        }*/
        
        
        // check that all fields are completed
/*        if ( $scope.sbvValid || $scope.sbsValid ) {
        
            $http.get(tireSizeJson).
            success( function( data, status, headers, config ) {
                
                for (key in data) {
                    if (data[key] && typeof key === "string") {
                        for (s in $scope.sizes) {
                            if ($scope.sizes[s] === data[key].Size) {
                                $scope.tireIds.push(data[key].idTire);
                            }
                        }
                    }
                }
            
                $scope.sizes = uniq($scope.sizes);
                if ($scope.sizes.length > 1) {
                    $scope.selectedFront = $scope.sizes[0];
                    $scope.selectedBack = $scope.sizes[1];
                } else {
                    $scope.selectedFront = $scope.selectedBack = $scope.sizes[0];
                }
                
                $scope.tireIds = uniq($scope.tireIds);
                $scope.done = true;
                
            }).
            error( function(data, status, headers, config ) {
                console.log("error getting resource");
            }); 

        }*/
    };
      
    $scope.resetAll = function() {
        $scope.tireIds = [];
        make = year = model = style = 0;
        getVehicleData();
    };
    
    $scope.resetSBV = function(index) {
        console.log(index);
    //    $scope.yearSelect = $scope.makeSelect = $scope.modelSelect = $scope.styleSelect = 0
    };
    
    $scope.resetSBS = function() {
        $scope.widthSelect = 0
    };
    
    $scope.displayResults = function() {            

        $scope.matchTireSize();
        
        $http.get(tireJson).
        success( function( data, status, headers, config ) {
            for (key in data) {
                if (data[key] && typeof key === "string") {
                    for (t in $scope.tireIds) {
                        if ($scope.tireIds[t] === data[key].id) {
                            $scope.results.push(data[key]);
                        }
                    }
                }
            }
        }).
        error( function(data, status, headers, config ) {
            console.log("error getting resource");
        });
        
        console.log($scope.results);
        
        $scope.resetAll;
        
    };
    
    getVehicleData();

    
    /*
    
{"id":"1","Year":"1997","Make":"Acura","Model":"CL","Style":"Base","Sequence":"1","Position":"Both","Size":"205\/55R16","LoadIndex":"89","SpeedRating":"V","SizeDesc":"205\/55R16 89V","Width":"205","Ratio":"55","Diameter":"16"}, {"id":"2","Year":"2001","Make":"Acura","Model":"CL","Style":"Premium","Sequence":"1","Position":"Both","Size":"205\/60R16","LoadIndex":"91","SpeedRating":"V","SizeDesc":"P205\/60R16 91V","Width":"205","Ratio":"60","Diameter":"16"},


{"id":"117","Year":"1991","Make":"Acura","Model":"NSX","Style":"Base","Sequence":"1","Position":"Front","Size":"205\/50R15","LoadIndex":"","SpeedRating":"","SizeDesc":"205\/50ZR15","Width":"205","Ratio":"50","Diameter":"15"}, {"id":"118","Year":"1991","Make":"Acura","Model":"NSX","Style":"Base","Sequence":"1","Position":"Rear","Size":"225\/50R16","LoadIndex":"","SpeedRating":"","SizeDesc":"225\/50ZR16","Width":"225","Ratio":"50","Diameter":"16"},

    */
    
    
});