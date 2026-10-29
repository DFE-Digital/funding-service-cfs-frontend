using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace CalculateFunding.Frontend.Controllers
{
    public class ClarityKeyController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        public ClarityKeyController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("api/clarity/get-clarity-key")]
        public async Task<IActionResult> GetClarityKey()
        {
            string clarityKey = _configuration["clarityKey"];

            if (string.IsNullOrEmpty(clarityKey))
            {
                return NotFound("ClarityKey is not properly set.");
            }

            return Ok(new { clarityKey = clarityKey });
        }
    }
}
