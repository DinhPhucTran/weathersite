using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using WeatherSite.Utils;

namespace WeatherSite.Controllers
{
    public class PlacesAutocompleteController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(string input)
        {
            string json = "";
            try
            {
                using (var webClient = new System.Net.WebClient())
                {
                    webClient.Encoding = Encoding.UTF8;
                    json = webClient.DownloadString("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + input + "&key=" + Constants.GOOGLE_API_KEY);

                }
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e);
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