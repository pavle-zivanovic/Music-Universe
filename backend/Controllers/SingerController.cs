using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models;
using Neo4jClient;

namespace Music_Universe.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SingerController : ControllerBase
    {
        private readonly IGraphClient _neo4j;

        public SingerController(IGraphClient neo4j)
        {
                _neo4j = neo4j;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSinger([FromBody] Singer s)
        {
            await _neo4j.Cypher.Create("(s:Singer $s)")
                                .WithParam("s", s)
                                .ExecuteWithoutResultsAsync();

            return Ok();
        }

        [Route("Get singers from neo4j")]
        [HttpGet]
        public async Task<IActionResult> GetSingerNeo4j(){
            var singers = await _neo4j.Cypher.Match("(n: Singer)")
                                             .Return(n => n.As<Singer>()).ResultsAsync;

            return Ok(singers);
        }
    }
}
