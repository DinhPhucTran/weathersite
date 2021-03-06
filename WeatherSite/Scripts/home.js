﻿
var skycons = new Skycons({ "color": "#FFFFFF" });

$(document).ready(function () {

    $('#location').select2({
        placeholder: "Search your location",
        ajax: {
            url: '/api/PlacesAutocomplete',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    input: params.term,
                };
            },
            processResults: function (data) {
                //console.log(data);
                var json = $.parseJSON(data);
                var pres = json['predictions'];
                return {
                    results: $.map(pres, function (el) {
                        return {
                            text: el.description,
                            id: el.place_id
                        };
                    })
                }
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 2,
    });

    $("#location").on("select2:select", function (e) {
        //console.log($("#location").val());        
        addPlace(($("#location").val()));
        var place = $("#location").select2("data")[0].text;
        //console.log(place);
        $("#location-current").text(place);
    });

    navigator.geolocation.getCurrentPosition(function (location) {
        //console.log(location);
        var lat = location.coords.latitude;
        var lng = location.coords.longitude;
        addMarker(lat, lng);
        getWeather(lat, lng);
        getPlaceName(lat, lng);
    });

    //startTime();
});

var map;
var markers = [];
var preciMap;
var cloudMap;

function initMap() {
    var uit = { lat: 10.870288, lng: 106.8024038 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        scrollwheel:  false,
        center: uit
    });

    var tempMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            return "http://tile.openweathermap.org/map/temp_new/" + zoom + "/" + coord.x + "/" + coord.y + ".png?appid=d3c3dd4211e267f7ebd3b9049496f813";
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 9,
        minZoom: 0,
        name: 'tempMapType'
    });
    map.overlayMapTypes.insertAt(0, tempMapType);

    cloudMap = new google.maps.Map(document.getElementById('map-cloud'), {
        zoom: 5,
        scrollwheel: false,
        center: uit
    });

    var cloudMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            return "http://tile.openweathermap.org/map/clouds_new/" + zoom + "/" + coord.x + "/" + coord.y + ".png?appid=d3c3dd4211e267f7ebd3b9049496f813";
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 9,
        minZoom: 0,
        name: 'cloudMapType'
    });
    cloudMap.overlayMapTypes.insertAt(0, cloudMapType);

    preciMap = new google.maps.Map(document.getElementById('map-preci'), {
        zoom: 4,
        scrollwheel: false,
        center: uit
    });

    var preciMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            return "http://tile.openweathermap.org/map/precipitation_new/" + zoom + "/" + coord.x + "/" + coord.y + ".png?appid=d3c3dd4211e267f7ebd3b9049496f813";
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 9,
        minZoom: 0,
        name: 'preciMapType'
    });
    preciMap.overlayMapTypes.insertAt(0, preciMapType);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function addMarker(lat, lng) {
    setMapOnAll(null);
    var pos = { lat: lat, lng: lng };
    var marker = new google.maps.Marker({
        position: pos,
        map: map
    });
    map.setZoom(7);
    map.setCenter(marker.getPosition());
    markers.push(marker);

    var marker2 = new google.maps.Marker({
        position: pos,
        map: preciMap
    });
    preciMap.setZoom(7);
    preciMap.setCenter(marker2.getPosition());
    markers.push(marker2);

    cloudMap.setZoom(6);
    cloudMap.setCenter(marker.getPosition());
    cloudMap.setMapTypeId("satellite");
}

function isDayOrNight(hour) {
    if (hour >= 6 && hour <= 18)
        return "day";
    return "night";
}

function getIconAndBackground(code) {

    if (code == "wind") {
        return { icon: Skycons.WIND, bg: "/Content/images/background/windy.jpg" };
    }

    if (code == "clear-day") {
        return { icon: Skycons.CLEAR_DAY, bg: "/Content/images/background/clear-day.jpg" };
    }

    if (code == "clear-night") {
        return {icon: Skycons.CLEAR_NIGHT, bg: "/Content/images/background/clear-night.jpg"}
    }

    if (code == "partly-cloudy-day") {
        return { icon: Skycons.PARTLY_CLOUDY_DAY, bg: "/Content/images/background/cloudy-day2.jpg" };
    }

    if (code == "partly-cloudy-night"){
        return { icon: Skycons.PARTLY_CLOUDY_NIGHT, bg: "/Content/images/background/cloudy-night.jpg" };
    }
    
    if (code == "cloudy") {
        return { icon: Skycons.CLOUDY, bg: "/Content/images/background/cloudy-day2.jpg" };
    }

    if (code == "fog") {
        return { icon: Skycons.FOG, bg: "/Content/images/background/fog.jpg" };
    }

    if (code == "sleet") {
        return { icon: Skycons.SLEET, bg: "/Content/images/background/sleet.jpg" };
    }

    if (code == "snow") {
        return { icon: Skycons.SNOW, bg: "/Content/images/background/snow.jpg" };
    }

    if (code == "rain") {
        return { icon: Skycons.RAIN, bg: "/Content/images/background/rain2.jpg" };
    }
}

function drawChart(label, dt) {
    var ctx = document.getElementById("tempChart");
    var tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: 'Temperature',
                data: dt,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            hover: {
                // Overrides the global setting
                mode: 'index'
            }
        }
    });
}

function drawChartMutiLines(label, dt1, dt2) {
    var ctx = document.getElementById("tempChart");
    var tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: 'Min. Temperature',
                data: dt1, pointHoverRadius: 5,
                borderColor: 'rgba(17, 255, 0, 1)',
                backgroundColor: 'rgba(0,0,0,0)',
                borderWidth: 2
            }, {
                label: 'Max Temperature',
                data: dt2,
                borderColor: 'rgba(255, 154, 2, 1)',
                backgroundColor: 'rgba(0,0,0,0)',
                borderWidth: 2
            }]
        },
        options: {
            hover: {
                // Overrides the global setting
                mode: 'index'
            },
            maintainAspectRatio: true
        }
    });
}

function getWeather(lat, lng) {
    $.ajax({
        url: "/api/Weather",
        dataType: "json",
        data: "lat=" + lat + "&lng=" + lng,
        success: function (data) {
            $("#icon-wrapper").html("");
            $("#icon-wrapper").html("<canvas height='150' width='150' id='icon-current'></canvas>");
            //console.log(data);
            var json = $.parseJSON(data);
            var temp = Math.ceil(json["currently"].temperature);
            var precip = Math.ceil(json["currently"]["precipProbability"] * 100);
            var humidity = Math.ceil(json["currently"]["humidity"] * 100);
            var wind = json["currently"]["windSpeed"];
            var cloud = Math.ceil(json["currently"]["cloudCover"] * 100);
            var icon = json["currently"]["icon"];
            var des = json["currently"]["summary"];
            var offset = json["offset"];
            //console.log(icon);

            var iconBg = getIconAndBackground(icon);
            skycons.add("icon-current", iconBg.icon);
            skycons.play();

            $("#des-current").text(des);
            $("#temp-current").text(temp);
            $(".intro").attr("style", "background: url(" + iconBg.bg + ") no-repeat center center scroll; background-size: cover;");//.css("background", "url(" + iconBg.bg + ") no-repeat center center scroll");
            $("#wind-current").text(wind);
            $("#humidity-current").text(humidity);
            $("#cloud-current").text(cloud);
            $("#precip-current").text(precip);
            clearTimeout(timeOut);
            startTimeByTimeZone(offset);

            var label = [];
            var dataMin = [];
            var dataMax = [];

            for (i = 0; i < 7; i++) {
                var date = new Date(json["daily"]["data"][i].time * 1000);
                var d = date.getDate();
                var m = date.getMonth() + 1;
                var y = date.getFullYear();
                label.push(d + "/" + m + "/" + y);
                dataMin.push(json["daily"]["data"][i].temperatureMin);
                dataMax.push(json["daily"]["data"][i].temperatureMax);
            }
            //console.log(label);
            drawChartMutiLines(label, dataMin, dataMax);
        },
        error: function (e) {
            console.log("ERROR: " + e);
        }
    });
}

function addPlace(placeId) {
    $.ajax({
        url: "/api/PlaceDetail",
        dataType: "json",
        data: "placeid=" + placeId,
        success: function (data) {
            var json = $.parseJSON(data);
            var lat = json['result']['geometry']['location']['lat'];
            var lng = json['result']['geometry']['location']['lng'];
            var name = json['result']['name'];
            addMarker(lat, lng);
            getWeather(lat, lng);
        }
    });
}

function getPlaceName(lat, lng) {
    $.ajax({
        url: "/api/Place",
        dataType: "json",
        data: "lat=" + lat + "&lng=" + lng,
        success: function (data) {
            //console.log(data);
            var json = $.parseJSON(data);
            var name = json["results"][1]["formatted_address"];
            //console.log(name);
            $("#location-current").text(name);
        },
        error: function (e) {
            console.log("ERROR: " + e);
        }
    });
}

var timeOut;

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    var timeStr = h + ":" + m + ":" + s;
    $("#time").text(timeStr);
    timeOut = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

function startTimeByTimeZone(offset) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000 * offset));
    //console.log(nd);
    var h = nd.getHours();
    var m = nd.getMinutes();
    var s = nd.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    var timeStr = h + ":" + m + ":" + s;
    $("#time").text(nd.toLocaleTimeString());
    timeOut = setTimeout("startTimeByTimeZone(" + offset + ")", 1000);
}