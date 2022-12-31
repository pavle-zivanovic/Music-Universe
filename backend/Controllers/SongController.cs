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
    public class SongController : ControllerBase
    {
        private readonly IGraphClient neo4j;

        private readonly JwtService jwtService;
        private readonly RedisClient redis = 
        new("redis://default:redispw@localhost:49153");

        public SongController(IGraphClient _neo4j , JwtService JwtService)
        {
                neo4j = _neo4j;
                jwtService = JwtService;
        }

        // Create Song entity
        // Radi  ali bez provera  bice zavrseno na kraju
        [Route("Add Song/jwt")]
        [HttpPost]
        public async Task<IActionResult> SignUp([FromBody] Song song , string jwt)
        {
            
            var token = jwtService.Verify(jwt);

            if (token == null){return BadRequest("Not authorized");}

            if (song.title == "" || song.genre == "" || song.year == 0 || song.lyrics == ""){return BadRequest("Nisu popunjena sva polja !");}

            var pesmaja = await neo4j.Cypher.Match("(n: Song)")
                            .Where( (Song n) => n.title == song.title)
                            .Return(n => n.As<User>()).ResultsAsync;

            // Vec postoji
            if (pesmaja.LastOrDefault() != null){return Ok(0);}

            
            var newSong = await neo4j.Cypher.Create("(u:Song $u)")
                                .WithParam("u", song)
                                .Return(u => u.As<Song>())
                                .ResultsAsync;

            // Success
            return Ok(1);
        }
        // Create Album entity
        [Route("Add Album/jwt")]
        [HttpPost]
        public async Task<IActionResult> AddAlbum([FromBody] Album album, string jwt)
        {

            var token = jwtService.Verify(jwt);

            if (token == null){return BadRequest("Not authorized");}

            if (album.title == "" || album.year == 0){return BadRequest("Nisu popunjena sva polja !");}

            var albumce = await neo4j.Cypher.Match("(a: Album)")
                            .Where( (Album a) => a.title == album.title && a.year == album.year)
                            .Return(a => a.As<User>()).ResultsAsync;

            // Vec postoji
            if (albumce.LastOrDefault() != null){return Ok(0);}

            
            var newAlbum = await neo4j.Cypher.Create("(a:Album $a)")
                                .WithParam("a", album)
                                .Return(a => a.As<Album>())
                                .ResultsAsync;

            // Success
            return Ok(1);
        }

        [Route("Get songs for Featured")]
        [HttpGet]
        public async Task<IActionResult> GetSongsFeatured()
        {
            var songs = await neo4j.Cypher.Match("(n: Song)<-[r:sing]-(s:Singer)")
                                            .Return((n, s) => new 
                                            {
                                                Song = n.As<Song>(),
                                                singerName = s.As<Singer>().name
                                            })
                                            .Limit(100)
                                            .ResultsAsync;

            return Ok(songs);
        }


        [Route("Get songs for ForYou/{userID}")]
        [HttpGet]
        public async Task<IActionResult> GetSongsForYou(int userID)
        {
            if(userID < 0)
            {
                return BadRequest("Nevalidan id!");
            }

            var songs = await neo4j.Cypher.Match("(user: User)-[r1:isLiked]->(rating: Rating)<-[r2:Has]-(song:Song)<-[r3:sing]-(singer:Singer)")
                                          .Where((User user) => user.id == userID)
                                          .Return((singer, song) => new 
                                            {
                                                Song = song.As<Song>(),
                                                singerName = singer.As<Singer>().name
                                            })
                                          .ResultsAsync;

            return Ok(songs);
        }

        [Route("Increase the number of plays/{songID}")]
        [HttpPut]
        public async Task<IActionResult> IncreasePlaysNumber(int songID)
        {
            if(songID < 0)
            {
                return BadRequest("Nevalidan id!");
            }

            var streams = await neo4j.Cypher.Match("(s: Song)")
                              .Where((Song s) => s.id == songID)
                              .Set("s.streams = s.streams+1")
                              .Return(s => s.As<Song>().streams)
                              .ResultsAsync;

            return Ok(streams);
        }
    }
}