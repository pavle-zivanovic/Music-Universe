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
    public class SingerController : ControllerBase
    {
        private readonly IGraphClient neo4j;
        private readonly RedisClient redis = 
        new("redis://default:redispw@localhost:49153");

        public SingerController(IGraphClient _neo4j)
        {
                neo4j = _neo4j;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSinger([FromBody] Singer s)
        {
            await neo4j.Cypher.Create("(s:Singer $s)")
                                .WithParam("s", s)
                                .ExecuteWithoutResultsAsync();

            return Ok();
        }

        [Route("Get singers from neo4j")]
        [HttpGet]
        public async Task<IActionResult> GetSingerNeo4j()
        {
            var singers = await neo4j.Cypher.Match("(n: Singer)")
                                             .Return(n => new 
                                             {
                                               Singer = n.As<Singer>()
                                             }).ResultsAsync;

            return Ok(singers);
        }

        
        [Route("Get singer names from neo4j")]
        [HttpGet]
        public async Task<IActionResult> GetSingerNameNeo4j()
        {
            var singers = await neo4j.Cypher.Match("(n: Singer)")
                                            .Return(n=> new {
                                                 ime = n.As<Singer>().name,
                                                 birthplace = n.As<Singer>().birthplace,                                             
                                            }).ResultsAsync;
                                      

            return Ok(singers);
        }

        [Route("Get singers from redis")]
        [HttpGet]
        public string GetSingerRedis()
        {
            var singer = redis.Get<string>("name");

            return singer;
        }
    }
}
