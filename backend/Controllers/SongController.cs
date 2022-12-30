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
    public class SongController : ControllerBase
    {
        private readonly IGraphClient neo4j;
        private readonly RedisClient redis = 
        new("redis://default:redispw@localhost:49153");

        public SongController(IGraphClient _neo4j)
        {
                neo4j = _neo4j;
        }


        [Route("Vrati pesme")]
        [HttpGet]
        public async Task<IActionResult> GetSongs()
        {
            var songs = await neo4j.Cypher.Match("(n: Song)")
                                             .Return(n => n.As<Song>())
                                             .Limit(100)
                                             .ResultsAsync;

            return Ok(songs);
        }
    }
}