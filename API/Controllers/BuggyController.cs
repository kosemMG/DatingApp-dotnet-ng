using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly DataContext _context;

        public BuggyController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "secret text";
        }
        
        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            var notFound = _context.Users.Find(-1);
            var toReturn = notFound.ToString();
            return toReturn;
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var notFound = _context.Users.Find(-1);
            if (notFound == null) return NotFound();

            return Ok(notFound);
        }
        
        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("This was not a good request!");
        }
    }
}