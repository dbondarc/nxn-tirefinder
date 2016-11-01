// JSON Tables
var tireJson = "data/tire.json",
    tireSizeJson = "data/tiresize.json",
    vehicleJson = "data/vehicle.json",
    tireImgJson = "data/tireimage.json",
    tireMediaJson = "data/tiremedia.json";
tireUrlsJson = "data/tireurls.json";

var make, year, model, style, tirewidth, tireratio, rimsize;
var sbvData = [];
var sbsData = [];
var sizeData = [];
var widths = [];
var vehicleData = [];
var app = angular.module("NexenTireFinder", []);

function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item !== ary[pos - 1];
    })
}

app.controller("DataCtrl", function($scope, $http) {

    $scope.active = false;

    // only need this for Search By Vehicle to get the Tire Size

    function getVehicleData() {
        $http.get(vehicleJson).
        success(function(data, status, headers, config) {

            vehicleData = [];
            $scope.sizeData = [];
            $scope.years = [];
            $scope.makes = [];
            $scope.sizes = [];
            $scope.tireIds = [];
            $scope.selectedYear = 0;
            $scope.selectedMake = 0;
            $scope.selectedModel = 0;
            $scope.selectedStyle = 0;
            $scope.selectedSize = 0;

            for (key in data) {
                if (data[key] && typeof key === "string") {
                    vehicleData.push(data[key]);
                    $scope.years.push(data[key].Year);
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

            getTireSize();

        }).
        error(function(data, status, headers, config) {
            console.log("error getting resource");
        });

    }

    // only used for filter by tire size

    function getTireSize() {
        $scope.sizes = [];
        $scope.tireIds = [];
        $scope.ratios = [];
        $scope.rims = [];
        $scope.selectedWidth = 0;
        $scope.selectedRatio = 0;
        $scope.selectedRim = 0;
        $scope.selectedSize = 0;
        $scope.sbvValid = false;
        $scope.sbsValid = false;
        $scope.done = false;
        $scope.changed = false;
        widths = [];
        sizeData = [];

        $http.get(tireSizeJson).
        success(function(data, status, headers, config) {

            for (key in data) {
                if (data[key].tireWidth) {
                    sizeData.push(data[key]);
                    widths.push(data[key].tireWidth);
                }
            }

            // Set options for tire width
            $scope.tirewidth = {
                "type": "select",
                "label": "Tire Width",
                "name": "tirewidth",
                "value": uniq(widths).reverse()
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
        error(function(data, status, headers, config) {
            console.log("error getting resource");
        });

    }

    $scope.update = function(selected) {

        var data;
        var sbvData = [];
        var models = [];
        var makes = [];
        var styles = [];
        $scope.noMatches = false;
        $scope.changed = true;
        $scope.selected = 0;
        if (selected) $scope.selected = selected;

        if (!$scope.changed && $scope.done) {
            //console.log("No changes detected. Do NOTHING!!!!");
            return false
        }

        if ($scope.done && $scope.changed) {
            //console.log("Done and changed");
            $scope.results = [];
            $scope.tireIds = [];
        }

        if ($scope.active === "SBV") { // Search By Vehicle only          

            data = vehicleData;
            var size;
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
                                    sbvData.push(data[i]);

                                }
                            }
                        }
                    }
                }

                $scope.sizes = uniq($scope.sizes);
                $scope.make.value = uniq(makes);
                $scope.model.value = uniq(models);

                $scope.both = true;
                $scope.set = [];

                if (models) $scope.style.value = uniq(styles);

                if ($scope.selected) {
                    size = $scope.selected;
                    sizes = [$scope.selected];
                }

                if ($scope.sizes.length == 1 || $scope.selected) {
                    //    console.log("One size for this vehicle");

                    data = sbvData;
                    for (d in data) {

                        if (!$scope.selected) {
                            if ($scope.sizes[0] === data[d].Size) {
                                size = data[d].Size;
                            }
                        }


                        if (data[d].Position == "Front") {
                            //    console.log("FRONT & BACK ARE DIFFERENT!");
                            $scope.selectedFront = data[d].Size
                        } else if (data[d].Position == "Rear") {
                            //    console.log("FRONT & BACK ARE DIFFERENT!");
                            $scope.selectedRear = data[d].Size
                        } else {
                            //    console.log("FRONT & BACK ARE THE SAME!");
                            $scope.selectedFront = $scope.selectedRear = size;
                        }



                    }

                    data = sizeData;
                    for (n in data) {
                        if (data[n].Size == size) {
                            $scope.tireIds.push(data[n].idTire);
                        }
                    }

                    $scope.tireIds = uniq($scope.tireIds);
                    if ($scope.sbvValid) $scope.done = true;

                    //console.log("tireIds: "+$scope.tireIds, "sizes: "+$scope.sizes, "sizesLength:"+$scope.sizes.length);
                    //console.log("done? "+$scope.done, "sbvValid? "+$scope.sbvValid, "changed?"+$scope.changed);
                } else if ($scope.sizes.length > 1) {
                    //console.log("Multiple sizes for this vehicle");
                    $scope.selected = 0;
                    $scope.sequence = 0;

                    data = sbvData;
                    for (d in data) {
                        if (data[d].Position == "Front") {
                            $scope.both = false;
                            $scope.set.push([data[d]]);
                        }
                        if (data[d].Position == "Rear") {
                            $scope.set[$scope.set.length - 1].push(data[d]);
                        }

                    }

                } else {
                    //console.log("No sizes are available for this vehicle");
                    // show no matches found
                    $scope.noMatches = true;
                }

            }

        }

        if ($scope.active === "SBS") { // Search By Size only

            data = sizeData; // using tireSize table
            tirewidth = $scope.selectedWidth;
            tireratio = $scope.selectedRatio;
            rimsize = $scope.selectedRim;

            if (widths.length > 0) {
                $scope.ratios = [];
                $scope.rims = [];
                $scope.sizes = [];

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

            for (i in data) {
                for (s in $scope.sizes) {
                    if ($scope.sizes[s] === data[i].Size) {
                        $scope.tireIds.push(data[i].idTire);
                    }
                }
            }

            $scope.tireIds = uniq($scope.tireIds);
            if ($scope.sbsValid) $scope.done = true;

        }

    }

    $scope.resetSBV = function() {
        //console.log("resetting SBV...");
        $scope.yearSelect = $scope.makeSelect = $scope.modelSelect = $scope.styleSelect = 0;
        getVehicleData()
    };

    $scope.resetSBS = function() {
        //console.log("resetting SBS...");
        $scope.widthSelect = $scope.ratioSelect = $scope.rimSelect = 0;
        getTireSize()
    };

    $scope.displayResults = function() {

        $scope.results = [];
        $scope.urls = [];

        $http.get(tireJson).
        success(function(data, status, headers, config) {
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
        error(function(data, status, headers, config) {
            console.log("error getting resource");
        });

        $http.get(tireUrlsJson).
        success(function(data, status, headers, config) {
            data.sort(function(a, b) {
                return a.id - b.id });
            for (key in data) {
                if (data[key] && typeof key === "string") {
                    for (r in $scope.results) {
                        if ($scope.results[r].id == data[key].id) {
                            $scope.urls.push(data[key]);
                        }
                    }
                }
            }
        }).
        error(function(data, status, headers, config) {
            console.log("error getting resource");
        });

        //console.log('Results...', $scope.results);
        //console.log('URLS...', $scope.urls);

    }

    getVehicleData();
    getTireSize();

});
