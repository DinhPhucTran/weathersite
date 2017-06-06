using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WeatherSite.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var result = new FilePathResult("~/Views/Home.html", "text/html");
            return result;
        }
    }
}
