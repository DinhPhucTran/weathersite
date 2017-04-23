
var skycons = new Skycons({ "color": "#FFFFFF" });

$(document).ready(function () {

    $('#location').select2({
        placeholder: "Search your location",
        ajax: {
            url: '/api/Weather/GetPlaceAutocomplete',
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
    });
});

var map;
var markers = [];
//function initMap() {
//    var uit = { lat: 10.870288, lng: 106.8024038 };
//    map = new google.maps.Map(document.getElementById('map'), {
//        zoom: 4,
//        center: uit
//    });
//}

//function setMapOnAll(map) {
//    for (var i = 0; i < markers.length; i++) {
//        markers[i].setMap(map);
//    }
//}

//function addMarker(lat, lng) {
//    setMapOnAll(null);
//    var pos = { lat: lat, lng: lng };
//    var marker = new google.maps.Marker({
//        position: pos,
//        map: map
//    });
//    map.setZoom(8);
//    map.setCenter(marker.getPosition());
//    markers.push(marker);
//}

function isDayOrNight(hour) {
    if (hour >= 6 && hour <= 18)
        return "day";
    return "night";
}

function getWeatherIcon(code) {
    var isDay = true;
    if (isDayOrNight((new Date()).getHours) == "day")
        isDay = true;
    else isDay = false;

    if (code == 905) {
        return Skycons.WIND;
    }
    if (code == 800) {
        if (isDay == true)
            return Skycons.CLEAR_DAY;
        return Skycons.CLEAR_NIGHT;
    }
    if (code == 801 || code == 803) {
        if (isDay == true)
            return Skycons.PARTLY_CLOUDY_DAY;
        else
            return Skycons.PARTLY_CLOUDY_NIGHT;
    }
    if (code == 802) {
        return Skycons.CLOUDY;
    }
    if (code == 701 || code == 741) {
        return Skycons.FOG;
    }
    if (code >= 611 && code <= 622) {
        return Skycons.SLEET;
    }
    if (code >= 600 && code <= 602) {
        return Skycons.SNOW;
    }
    if (code >= 300 && code <= 531) {
        return Skycons.RAIN;
    }
}

function getIconAndBackground(code) {

    if (code == "wind") {
        return { icon: Skycons.WIND, bg: "/Content/images/background/windy.jpg" };
    }

    if (code == "clear-day") {
        return { icon: Skycons.CLEAR_DAY, bg: "/Content/images/background/clear-day.jpg" };
    }

    if (code == "clear-night") {
        return {icon: Skycons.CLEAR_NIGHT, bg: "/Contetn/images/background/clear-night.jpg"}
    }

    if (code == "partly-cloudy-day") {
        return { icon: Skycons.PARTLY_CLOUDY_DAY, bg: "/Content/images/background/cloudy-day.jpg" };
    }

    if (code == "partly-cloudy-night"){
        return { icon: Skycons.PARTLY_CLOUDY_NIGHT, bg: "/Content/images/background/cloudy-night.jpg" };
    }
    
    if (code == "cloudy") {
        return { icon: Skycons.CLOUDY, bg: "/Content/images/background/cloudy-day.jpg" };
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
        return { icon: Skycons.RAIN, bg: "/Content/images/background/rain.jpg" };
    }
}

function drawChart(label, dt) {
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
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

function getCurrentWeather(lat, lng) {
    $.ajax({
        url: "/api/Weather/GetCurrent",
        dataType: "json",
        data: "lat=" + lat + "&lng=" + lng,
        success: function (data) {
            $("#icon-wrapper").html("");
            $("#icon-wrapper").html("<canvas height='150' width='150' id='icon-current'></canvas>");

            var json = $.parseJSON(data);
            var main = json["weather"][0].main;
            var des = json["weather"][0].description;
            var icon = json["weather"][0].icon;
            var id = json["weather"][0].id;
            var temp = Math.ceil(json["main"].temp - 273.15);
            //console.log("Current weather - Main: " + main + ", Des: " + des + ", ID: " + id);

            var iconBg = getIconAndBackground(id);
            skycons.add("icon-current", iconBg.icon);
            skycons.play();
            $("#des-current").text(des);
            $("#temp-current").text(temp);
            $(".intro").css("background", "url(" + iconBg.bg + ") no-repeat bottom center scroll");
            console.log("url(" + iconBg.bg + ") no-repeat bottom center scroll");
        }
    });
}

function getForecast(lat, lng) {
    $.ajax({
        url: "/api/Weather/GetForecast",
        dataType: "json",
        data: "lat=" + lat + "&lng=" + lng,
        success: function (data) {
            //console.log(data);
            var json = $.parseJSON(data);

            var label = [];
            var data = [];

            for (i = 0; i < 9; i++) {
                data.push(Math.ceil(json["list"][i]["main"].temp - 273.15))
                label.push(json["list"][i].dt_txt);
            }

            drawChart(label, data);
        },
        error: function (e) {
            console.log("ERROR: " + e);
        }
    });
}

function getWeather(lat, lng) {
    $.ajax({
        url: "/api/Weather/GetWeather",
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
            console.log(icon);

            var iconBg = getIconAndBackground(icon);
            skycons.add("icon-current", iconBg.icon);
            skycons.play();

            $("#des-current").text(des);
            $("#temp-current").text(temp);
            $(".intro").css("background", "url(" + iconBg.bg + ") no-repeat bottom center scroll");
            $("#wind-current").text(wind);
            $("#humidity-current").text(humidity);
            $("#cloud-current").text(cloud);
            $("#precip-current").text(precip);
            console.log("url(" + iconBg.bg + ") no-repeat bottom center scroll");
        },
        error: function (e) {
            console.log("ERROR: " + e);
        }
    });
}

function addPlace(placeId) {
    $.ajax({
        url: "/api/Weather/GetPlaceDetail",
        dataType: "json",
        data: "placeid=" + placeId,
        success: function (data) {
            var json = $.parseJSON(data);
            var lat = json['result']['geometry']['location']['lat'];
            var lng = json['result']['geometry']['location']['lng'];
            //addMarker(lat, lng);
            //getCurrentWeather(lat, lng);
            //getForecast(lat, lng);
            //console.log(lat + "/" + lng);
            getWeather(lat, lng);
        }
    });
}