using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using Neo4jClient;
using ServiceStack.Redis;
using Models;

namespace Music_Universe.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IGraphClient neo4j;
        private readonly JwtService jwtService;

        private readonly RedisClient redis = 
        new("redis://default:redispw@localhost:49153");

        public UserController(IGraphClient _neo4j, JwtService JwtService)
        {
                neo4j = _neo4j;
                jwtService = JwtService;
        }


        // Create User entity
        [Route("SignUp")]
        [HttpPost]
        public async Task<IActionResult> SignUp([FromBody] User user)
        {
    
            if (user.userName == "" || user.password == "" || user.email == ""){return BadRequest("Nisu popunjena sva polja !");}

            var korisnik = await neo4j.Cypher.Match("(n: User)")
                            .Where( (User n) => n.userName == user.userName  || n.email == user.email)
                            .Return(n => n.As<User>()).ResultsAsync;

            // Vec postoji
            if (korisnik.LastOrDefault() != null){return Ok(0);}

            
            var noviKorisnik = await neo4j.Cypher.Create("(u:User $u)")
                                .WithParam("u", user)
                                .Set("u.id = id(u)")
                                .Return(u => u.As<User>().id)
                                .ResultsAsync;

            var noviKorisnikID = noviKorisnik.LastOrDefault();

            var like = false;
            Dictionary<string, object> ratingDict = new Dictionary<string, object>();
            ratingDict.Add("like", like);

            await neo4j.Cypher.Match("(u:User), (s:Song)")
                              .Where((User u) => u.id == noviKorisnikID)
                              .Create("(u)-[rel:Liked]->(rating: Rating $rating)<-[r:Has]-(s)")
                              .WithParam("rating", ratingDict)
                              .Set("rating.id = id(rating)")
                              .ExecuteWithoutResultsAsync();
            // Success
            return Ok(1);
        }

        // Login and return jwt 
        [Route("Login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] User korisnik)
        {
            var user = await neo4j.Cypher.Match("(n: User)")
                                             .Where( (User n) => n.userName == korisnik.userName && n.password == korisnik.password)
                                             .Return(n => n.As<User>()).ResultsAsync;

            
            if (user == null) 
            {
                return Ok("1"); // pogresan username ili password 
            }

          
            
            var jwt = new 
            {
                token = jwtService.Generate(user.FirstOrDefault().id)
            };

            return Ok(jwt);
        }

        [Route("Getusers")]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await neo4j.Cypher.Match("(n: User)")
                                             .Return(n => n.As<User>()).ResultsAsync;

            return Ok(users);
        }
    }
}