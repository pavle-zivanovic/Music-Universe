using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models;
using Neo4jClient;
using ServiceStack.Redis;

namespace Music_Universe.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IGraphClient neo4j;
        private readonly RedisClient redis = 
        new("redis://default:redispw@localhost:49153");

        public UserController(IGraphClient _neo4j)
        {
                neo4j = _neo4j;
        }


        // Create User entity
        [Route("Sign Up")]
        [HttpPost]
        public async Task<IActionResult> SignUp([FromBody] User user)
        {
    
            if (user.userName == "" || user.password == "" || user.email == ""){return BadRequest("Nisu popunjena sva polja !");}

            var korisnik = await neo4j.Cypher.Match("(n: User)")
                            .Where( (User n) => n.userName == user.userName  || n.email == user.email)
                            .Return(n => n.As<User>()).ResultsAsync;

            if (korisnik.LastOrDefault() != null){return BadRequest("Korisnik vec postoji");}

            
            var noviKorisnik = await neo4j.Cypher.Create("(u:User $u)")
                                .WithParam("u", user)
                                .Return(u => u.As<User>())
                                .ResultsAsync;

            
            return Ok("Napravljen je korisnik !!!");
        }

        // Login and return jwt 
        [Route("Login/{name}/{pass}")]
        [HttpGet]
        public async Task<IActionResult> Login(string name , string pass)
        {
            var user = await neo4j.Cypher.Match("(n: User)")
                                             .Where( (User n) => n.userName == name && n.password == pass)
                                             .Return(n => n.As<User>()).ResultsAsync;

            
            if (user == null) 
            {
                return Ok("1"); // pogresan username ili password 
            }
            
            return Ok(user.FirstOrDefault());
        }

        [Route("Get users")]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await neo4j.Cypher.Match("(n: User)")
                                             .Return(n => n.As<User>()).ResultsAsync;

            return Ok(users);
        }
    }
}