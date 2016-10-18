// Tire Tables
var tireJson = "data/tire.json",
    tireSizeJson = "data/tiresize.json",
    vehicleJson = "data/vehicle.json",
    tireImgJson = "data/tireimage.json",
    tireMediaJson = "data/tiremedia.json";

var make, year, model, style, tirewidth, tireratio, rimsize;
var subsetData = [];
var app = angular.module("NexenTireFinder", []);

function uniq(a) {
    return a.sort().filter(function (item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

app.controller("DataCtrl", function ($scope, $http) {

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
        success(function (data, status, headers, config) {

            $scope.vehicleData = [];
            $scope.sizeData = [];
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

            // Set options for vehicle make
            $scope.make = {
                "type": "select",
                "label": "Select Make",
                "name": "make",
                //    "value": uniq($scope.makes)
                "value": ""
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
        error(function (data, status, headers, config) {
            console.log("error getting resource");
        });

    }

    function getTireData() {

        $http.get(tireSizeJson).
        success(function (data, status, headers, config) {
            for (key in data) {
                if (data[key].tireWidth) {
                    $scope.sizeData.push(data[key]);
                    $scope.widths.push(data[key].tireWidth);
                }
            }

            // Set options for tire width
            $scope.tirewidth = {
                "type": "select",
                "label": "Tire Width",
                "name": "tirewidth",
                "value": uniq($scope.widths).reverse()
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
        error(function (data, status, headers, config) {
            console.log("error getting resource");
        });

    }

    $scope.update = function () {
        var data;
        var allData = [];
        var models = [];
        var makes = [];
        var styles = [];
        subsetData = [];
        $scope.results = [];
        $scope.noMatches = false;
        $scope.done = false;
        $scope.changed = true;

        if ($scope.active === "SBV") { // Search By Vehicle only

            $scope.ratios = [];
            $scope.rims = [];
            $scope.sizes = [];            
            
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

                    if (year && year == data[i].Year && data[i].Model) {
                        makes.push(data[i].Make);

                        if (make && make == data[i].Make) {
                            models.push(data[i].Model);

                            if (model && model == data[i].Model) {
                                styles.push(data[i].Style);

                                if (style && style == data[i].Style) {

                                    $scope.sizes.push(data[i].Size);
                                    subsetData.push(data[i]);

                                }
                            }
                        }
                    }
                }

                $scope.make.value = uniq(makes);
                $scope.model.value = uniq(models);
                if (models) $scope.style.value = uniq(styles);



                console.log("SubsetDataObj: "+subsetData, subsetData.length);

            }

        }

        if ($scope.active === "SBS") { // Search By Size only

            $scope.ratios = [];
            $scope.rims = [];
            $scope.sizes = [];            
            
            data = $scope.sizeData;  // using tireSize table
            tirewidth = $scope.selectedWidth;
            tireratio = $scope.selectedRatio;
            rimsize = $scope.selectedRim;

            if ($scope.widths.length > 0) {

                for (n in data) {
                    if (tirewidth && tirewidth == data[n].tireWidth) {
                        $scope.ratios.push(data[n].tireRatio);
                        if (tireratio && tireratio == data[n].tireRatio) {
                            $scope.rims.push(data[n].rimSize);
                        }
                    }
                }
            }

            $scope.tireratio.value = uniq($scope.ratios);
            $scope.rimsize.value = uniq($scope.rims);
            $scope.sizes.push(tirewidth + "/" + tireratio + "R" + rimsize);
            
            console.log($scope.sizes);
        }

    };

    $scope.matchTireSize = function (v) {

        $scope.results = [];
        $scope.selected = v;
    
        data = $scope.sizeData;
        
        console.log(data, $scope.selected);
        
        if (!$scope.changed && $scope.done) {
            console.log("No changes detected. Do NOTHING!!!!");
            return false
        }
        
        else {

            if ($scope.done && $scope.changed) {
                getVehicleData();
            }

            else {

                for (i in data) {
                    if ($scope.sizes == data[i].Size) {
                        $scope.tireIds.push(data[i].idTire);
                    }
                }

                $scope.selectedFront = $scope.selectedRear = $scope.sizes[0];
                $scope.tireIds = uniq($scope.tireIds);
            }             
            
            if ($scope.sbvValid && !$scope.sbsValid) {

                $scope.sizes = [];

                if (subsetData.length === 1) {
                    console.log("Only one size available for this vehicle");

                    // check if tire size has same front and back
                    if (subsetData[0].Position === "Both") {
                        console.log("FRONT & BACK ARE THE SAME!");
                     //   $scope.sizes = subsetData[0].Size;
                        $scope.sizes.push(subsetData[0].Width + "/" + subsetData[0].Ratio + "R" + subsetData[0].Diameter);
                     //   $scope.tireIds.push(subsetData[0].idTire);
                        $scope.selectedFront = $scope.selectedRear = subsetData[0].Size;
                    }
                //    console.log($scope.sizeData);
                //     console.log($scope.sizes);
                   // $scope.tireIds = uniq($scope.tireIds);
                    
                                    
               //    console.log(subsetData, $scope.tireIds);
                    
                    
                    
                } else if (subsetData.length > 1) {

                    
                    // reduce the subsetData to a single element

                    for (k in subsetData) {
                        $scope.sizes.push(subsetData[k].Size);
                        if (subsetData[k].Size === $scope.selected) {
                            console.log("!!!!!!!!!!!!!!");
                            $scope.sizeData = subsetData[k];
                            
                            // apply selection to tireSize
                            if ( subsetData[k].Position == "Front" ) {
                                $scope.selectedFront = subsetData[k].Size
                            }
                            if ( subsetData[k].Position == "Rear" ) {
                                $scope.selectedRear = subsetData[k].Size
                            }                           
                            else 
                                $scope.selectedFront = $scope.selectedRear = subsetData[k].Size;
                        }
                    }
                    
                    
                    console.log($scope.sizeData,"Selected Size: "+$scope.selected, "Multiple sizes available for this vehicle");                    


                    
/*                    for (n in subsetData) {
                        if ( subsetData[n].Position === "Front" ) {
                            $scope.selectedFront = subsetData[n].Size
                        }
                        if ( subsetData[n].Position === "Rear" ) {
                            $scope.selectedRear = subsetData[n].Size
                        }
                    }*/

                    
                    
                    for (i in $scope.sizeData) {
                        if ( $scope.sizeData[i].Size === $scope.selectedFront ) {
                            $scope.tireIds.push($scope.sizeData[i].idTire);
                        }
                        if ( $scope.sizeData[i].Size === $scope.selectedRear ) {
                            $scope.tireIds.push($scope.sizeData[i].idTire);
                        }
                    }

                 //   $scope.selectedFront = $scope.selectedRear = $scope.sizes[0];
                    $scope.tireIds = uniq($scope.tireIds);                    
                    

                    // wait for user to select size
                } else {
                    console.log("No sizes are available for this vehicle");
                    // show no matches found
                    $scope.noMatches = true;
                }
console.log($scope.tireIds, $scope.sizes);                

            }

            if (!$scope.sbvValid && $scope.sbsValid) {
                
                if ($scope.done) {
                    getVehicleData();
                }
                
                else {

                    for (i in $scope.sizeData) {
                        for (s in $scope.sizes) {
                            if ($scope.sizes[s] === $scope.sizeData[i].Size) {
                                $scope.tireIds.push($scope.sizeData[i].idTire);
                            }
                        }
                    }

                    $scope.sizes = uniq($scope.sizes);
                    $scope.selectedFront = $scope.selectedRear = $scope.sizes[0];
                    $scope.tireIds = uniq($scope.tireIds);
                }
                
            }

            $http.get(tireJson).
            success(function (data, status, headers, config) {
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
            error(function (data, status, headers, config) {
                console.log("error getting resource");
            });

    //        console.log($scope.results);
            
            $scope.done = true;
            
        }
    };

/*    $scope.resetAll = function () {
        data = [];
        $scope.sizeData = [];
        $scope.vehicleData = [];
        make = year = model = style = 0;
        getVehicleData();
    };*/

    $scope.resetSBV = function (index) {
        $scope.yearSelect = $scope.makeSelect = $scope.modelSelect = $scope.styleSelect = 0
    };

    $scope.resetSBS = function () {
        $scope.widthSelect = $scope.ratioSelect = $scope.rimSelect = 0
    };

/*    $scope.displayResults = function () {

        if ($scope.sizes.length > 1) {
            $scope.matchTireSize();
        } else {

            $http.get(tireJson).
            success(function (data, status, headers, config) {
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
            error(function (data, status, headers, config) {
                console.log("error getting resource");
            });

     //       console.log($scope.results);

            $scope.resetAll;
        }

    };*/

    getVehicleData();


    /*
    
{"id":"1","Year":"1997","Make":"Acura","Model":"CL","Style":"Base","Sequence":"1","Position":"Both","Size":"205\/55R16","LoadIndex":"89","SpeedRating":"V","SizeDesc":"205\/55R16 89V","Width":"205","Ratio":"55","Diameter":"16"}, {"id":"2","Year":"2001","Make":"Acura","Model":"CL","Style":"Premium","Sequence":"1","Position":"Both","Size":"205\/60R16","LoadIndex":"91","SpeedRating":"V","SizeDesc":"P205\/60R16 91V","Width":"205","Ratio":"60","Diameter":"16"},


{"id":"117","Year":"1991","Make":"Acura","Model":"NSX","Style":"Base","Sequence":"1","Position":"Front","Size":"205\/50R15","LoadIndex":"","SpeedRating":"","SizeDesc":"205\/50ZR15","Width":"205","Ratio":"50","Diameter":"15"}, {"id":"118","Year":"1991","Make":"Acura","Model":"NSX","Style":"Base","Sequence":"1","Position":"Rear","Size":"225\/50R16","LoadIndex":"","SpeedRating":"","SizeDesc":"225\/50ZR16","Width":"225","Ratio":"50","Diameter":"16"},

    */


});