using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace WeatherSite.Controllers
{
    public class PlaceController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string GetPlaceName(double lat, double lng)
        {
            NumberFormatInfo nfi = new NumberFormatInfo();
            nfi.NumberDecimalSeparator = ".";
            string json = "[]";
            try
            {
                using (var webClient = new System.Net.WebClient())
                {
                    webClient.Encoding = Encoding.UTF8;
                    json = webClient.DownloadString("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat.ToString(nfi) + "," + lng.ToString(nfi));
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.Write("Failed to request: http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat.ToString(nfi) + "," + lng.ToString(nfi) + "\n");
                System.Diagnostics.Debug.Write("ERROR: Get place failed - " + e.ToString());
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