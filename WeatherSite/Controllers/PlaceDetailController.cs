using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WeatherSite.Utils;

namespace WeatherSite.Controllers
{
    public class PlaceDetailController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(string placeid)
        {
            string json = "";
            string request = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeid + "&key=" + Constants.GOOGLE_API_KEY;
            //System.Diagnostics.Debug.WriteLine("Google API request: " + request);
            try
            {
                using (var webClient = new System.Net.WebClient())
                {
                    webClient.Encoding = System.Text.Encoding.UTF8;
                    json = webClient.DownloadString(request);
                }
            }
            catch (Exception e)
            {
                json = "[]";
            }
            //System.Diagnostics.Debug.WriteLine("Google API respone: " + json);
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