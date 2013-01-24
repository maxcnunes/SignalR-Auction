using SignalRAuction.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SignalRAuction.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        private string SerializeToJson(object obj)
        {
            return new System.Web.Script.Serialization
                        .JavaScriptSerializer().Serialize(obj);
        }
    }
}
