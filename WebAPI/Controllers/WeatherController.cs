using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Mvc;

namespace WebAPI.Controllers
{
    public class WeatherController : ApiController
    {
        public String GetPlaceAutocomplete(String input)
        {
            string json = "";
            try
            {
                using (var webClient = new System.Net.WebClient())
                {
                    webClient.Encoding = Encoding.UTF8;
                    json = webClient.DownloadString("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + input + "&key=AIzaSyDgXEEd2QQBbpESV7DScrE_1DzObwWHhMo");
                    
                }
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e);
            }

            return json;
        }

        public string GetPlaceDetail(string placeid)
        {
            string json = "";
            try
            {
                using (var webClient = new System.Net.WebClient())
                {
                    webClient.Encoding = Encoding.UTF8;
                    json = webClient.DownloadString("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeid + "&key=AIzaSyDgXEEd2QQBbpESV7DScrE_1DzObwWHhMo");
                }
            }
            catch (Exception e)
            {
                json = "[]";
            }
            return json;
        }

        [System.Web.Mvc.Route("api/Weather/GetCurrent/lat/lng")]
        [System.Web.Mvc.HttpGet]
        public string GetCurrent(float lat, float lng)
        {
            string json = "[]";
            try
            {
                using (var webClient = new System.Net.WebClient())
                {
                    webClient.Encoding = Encoding.UTF8;
                    json = webClient.DownloadString("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid=d3c3dd4211e267f7ebd3b9049496f813");
                }
            }
            catch (Exception e)
            {

            }

            return json;
        }

        [System.Web.Mvc.Route("api/Weather/GetForecast/lat/lng")]
        [System.Web.Mvc.HttpGet]
        public string GetForecast(float lat, float lng)
        {
            string json = "[]";
            try
            {
                using (var webClient = new System.Net.WebClient())
                {
                    webClient.Encoding = Encoding.UTF8;
                    json = webClient.DownloadString("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lng + "&appid=d3c3dd4211e267f7ebd3b9049496f813");
                }
            }
            catch (Exception e)
            {

            }

            return json;
        }
    }
}