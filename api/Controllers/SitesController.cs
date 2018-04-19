using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    class SitesController :Controller
    {
        // GET api/server
        [HttpGet]
        public IActionResult Get(string farm)
        {
            var result = new[] {
                new { FirstName = "John", LastName = "Doe" },
                new { FirstName = "Mike", LastName = "Smith" }
            };

            return Ok(result);
        }
    }
}
