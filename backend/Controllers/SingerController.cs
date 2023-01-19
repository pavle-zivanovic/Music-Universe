using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using Models;
using Neo4jClient;
using StackExchange.Redis;
using Services;

namespace Music_Universe.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SingerController : ControllerBase
    {
        private readonly IGraphClient neo4j;

        private readonly JwtService jwtService;

        private readonly IConnectionMultiplexer redis;

        private readonly ICacheService cacheService;

        public SingerController(IGraphClient _neo4j,JwtService JwtService,IConnectionMultiplexer _redis, ICacheService _cacheService)
        {
                neo4j = _neo4j;
                jwtService = JwtService;
                redis = _redis;
                cacheService = _cacheService;
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

        [Route("GetSingerStats/{singerName}")]
        [HttpGet]
        public async Task<IActionResult> GetSingerStats(string singerName)
        {
            var singerStats = await neo4j.Cypher.Match("(s: Singer)")
                              .Where((Singer s) => s.name == singerName)
                              .Return((s) => new 
                                            {
                                                id = s.As<Singer>().id,
                                                singerName = s.As<Singer>().name,
                                                birthday = s.As<Singer>().birthday,
                                                birthplace = s.As<Singer>().birthplace,
                                                biography = s.As<Singer>().biography,
                                            })
                              .ResultsAsync;

            return Ok(singerStats);
        }

        [Route("GetSingerSongs/{singerName}")]
        [HttpGet]
        public async Task<IActionResult> GetSingerSongs(string singerName)
        {

            var allSongs = await neo4j.Cypher.Match("(s: Singer)-[r:sings]->(song:Song)")
                              .Where((Singer s) => s.name == singerName)
                              .Return((s, song) => new 
                                            {
                                                Song = song.As<Song>(),
                                                singerName = s.As<Singer>().name
                                            })
                              .ResultsAsync;                                      

            return Ok(allSongs);
        }

        [Route("GetSingerPopularSongs/{singerName}")]
        [HttpGet]
        public async Task<IActionResult> GetSingerPopularSongs(string singerName)
        {                              
            var songs = await neo4j.Cypher.Match("(n: Song)<-[r:sings]-(s:Singer)")
                                          .Where((Singer s) => s.name == singerName)
                                          .With("n, s")
                                          .OrderByDescending("n.streams")
                                          .Return((n, s) => new 
                                          {
                                            Song = n.As<Song>(),
                                            singerName = s.As<Singer>().name
                                           })
                                           .Limit(10)
                                           .ResultsAsync;                                                  

            return Ok(songs);
                             
        }


        [Route("GetSongwriter/{songwriterName}")]
        [HttpGet]
        public async Task<IActionResult> GetSongwriter(string songwriterName)
        {
            if(songwriterName == "") {return BadRequest("Nevalidan id!");}

            var songwriter = await neo4j.Cypher.Match("(s: Songwriter)")
                              .Where((Songwriter s) => s.name == songwriterName)
                              .Return(s => s.As<Songwriter>().id)
                              .ResultsAsync;

            return Ok(songwriter);
        }

        [Route("GetCacheSongList/{jwt}")]
        [HttpGet]
        public async Task<IActionResult> GetCacheSongList(string jwt)
        {
            var token = jwtService.Verify(jwt);
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            var value = await cacheService.GetCacheListAsync("music:SongList:"+userID);
            return Ok(value);
        }
        
        [Route("SetCacheSongList/{jwt}")]
        [HttpPost]
        public async Task<IActionResult> SetCacheSongList(string jwt, List<int> values)
        {
            var token = jwtService.Verify(jwt);
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            await cacheService.SetCacheListAsync("music:SongList:"+userID, values);
            return Ok();
        }

        [Route("GetCacheSong/{jwt}")]
        [HttpGet]
        public async Task<IActionResult> GetCacheSong(string jwt)
        {
            var token = jwtService.Verify(jwt);
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            var value = await cacheService.GetCacheStringAsync("music:Song:"+userID);
            return Ok(value);
        }

        [Route("SetCacheSong/{jwt}/{value}")]
        [HttpPost]
        public async Task<IActionResult> SetCacheSong(string jwt, string value)
        {
            var token = jwtService.Verify(jwt);
            int userID = int.Parse(token.Claims.First(x => x.Type == "id").Value);

            await cacheService.SetCacheStringAsync("music:Song:"+userID, value);
            return Ok();
        }

        [Route("PublishSong/{singerID}/{songName}/{singerName}")]
        [HttpPost]
        public async Task<IActionResult> PublishSong(int singerID, string songName, string singerName)
        {
            var pub = redis.GetSubscriber();

            await pub.PublishAsync("channel"+singerID, 
            singerName + " je izbacio pesmu pod nazivom " + songName);
            
            return Ok("Sve ok");
        }
    }
}
