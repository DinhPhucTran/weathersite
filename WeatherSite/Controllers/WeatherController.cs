using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using WeatherSite.Utils;

namespace WeatherSite.Controllers
{
    public class WeatherController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string GetWeather(double lat, double lng)
        {
            NumberFormatInfo nfi = new NumberFormatInfo();
            nfi.NumberDecimalSeparator = ".";

            string json = "[]";
            string request = "https://api.darksky.net/forecast/" + Constants.DARK_SKY_API_KEY + "/" + lat.ToString(nfi) + "," + lng.ToString(nfi) + "?units=ca&exclude=[minutely]";
            System.Diagnostics.Debug.WriteLine("Request: " + request);
            try
            {
                using (var webClient = new System.Net.WebClient())
                {
                    webClient.Encoding = Encoding.UTF8;
                    json = webClient.DownloadString(request);
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.Write("ERRORRRR: " + e.ToString());
            }

            return json;
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}