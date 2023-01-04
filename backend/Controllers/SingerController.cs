using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using Models;
using Neo4jClient;
using ServiceStack.Redis;

namespace Music_Universe.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SingerController : ControllerBase
    {
        private readonly IGraphClient neo4j;

        private readonly JwtService jwtService;
        private readonly RedisClient redis = 
        new("redis://default:redispw@localhost:49153");

        public SingerController(IGraphClient _neo4j,JwtService JwtService)
        {
                neo4j = _neo4j;
                jwtService = JwtService;
        }

        // Create Singer entity
        [Route("AddSinger/jwt")]
        [HttpPost]
        public async Task<IActionResult> AddSinger([FromBody] Singer singer, string jwt)
        {

            var token = jwtService.Verify(jwt);

            if (token == null){return BadRequest("Not authorized");} 


            if (singer.name == "" || singer.birthday == "" || singer.birthplace == "" || singer.biography == ""){return BadRequest("Nisu popunjena sva polja !");}

            var pevac = await neo4j.Cypher.Match("(s: Singer)")
                            .Where( (Singer s) => s.name == singer.name)
                            .Return(s => s.As<Singer>()).ResultsAsync;

            // Vec postoji
            if (pevac.LastOrDefault() != null){return Ok(0);}

            
            var newSinger = await neo4j.Cypher.Create("(s:Singer $s)")
                                .WithParam("s", singer)
                                .Set("s.id = id(s)")
                                .Return(s => s.As<Singer>())
                                .ResultsAsync;

            // Success
            return Ok(1);
        }


        // Create Singer entity
        [Route("AddSongWritter/jwt")]
        [HttpPost]
        public async Task<IActionResult> AddSongWritter([FromBody] Songwriter songwriter,string jwt)
        {


            var token = jwtService.Verify(jwt);

            if (token == null){return BadRequest("Not authorized");}
            

            if (songwriter.name == ""){return BadRequest("Nisu popunjena sva polja !");}

            var songWriter = await neo4j.Cypher.Match("(s: Songwriter)")
                            .Where( (Songwriter s) => s.name == songwriter.name)
                            .Return(s => s.As<Songwriter>()).ResultsAsync;

            // Vec postoji
            if (songWriter.LastOrDefault() != null){return Ok(0);}

            
            var newSongwritter = await neo4j.Cypher.Create("(s:Songwriter $s)")
                                .WithParam("s", songwriter)
                                .Set("s.id = id(s)")
                                .Return(s => s.As<Songwriter>())
                                .ResultsAsync;

            // Success
            return Ok(1);
        }

        [Route("GetSinger/{singerName}")]
        [HttpGet]
        public async Task<IActionResult> GetSinger(string singerName)
        {
            if(singerName == "") {return BadRequest("Nevalidan id!");}

            var singer = await neo4j.Cypher.Match("(s: Singer)")
                              .Where((Singer s) => s.name == singerName)
                              .Return(s => s.As<Singer>().id)
                              .ResultsAsync;

            return Ok(singer);
        }


        [Route("GetSongwritter/{songwriterName}")]
        [HttpGet]
        public async Task<IActionResult> GetSongwritter(string songwriterName)
        {
            if(songwriterName == "") {return BadRequest("Nevalidan id!");}

            var songwriter = await neo4j.Cypher.Match("(s: Songwriter)")
                              .Where((Songwriter s) => s.name == songwriterName)
                              .Return(s => s.As<Songwriter>().id)
                              .ResultsAsync;

            return Ok(songwriter);
        }
    }
}
