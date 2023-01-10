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
        [Route("AddSong/{jwt}/{pevacID}/{albumID}/{songwriterID}")]
        [HttpPost]
        public async Task<IActionResult> AddSong([FromBody] Song song , string jwt , int pevacID , int albumID , int songwriterID)
        {
            
            var token = jwtService.Verify(jwt);

            if (token == null){return BadRequest("Not authorized");}

            if (song.title == "" || song.genre == "" || song.year == 0 || song.lyrics == ""){return BadRequest("Nisu popunjena sva polja !");}

            var pesmaja = await neo4j.Cypher.Match("(n: Song)")
                                .Where( (Song n) => n.title == song.title)
                                .Return(n => n.As<Song>()).ResultsAsync;

            // Vec postoji
            if (pesmaja.LastOrDefault() != null){return Ok(0);}

            // provera Singer-a
            var pevaljka = await neo4j.Cypher.Match("(s: Singer)")
                                .Where(( Singer s) => s.id == pevacID)
                                .Return( s => s.As<Singer>()).ResultsAsync;

            if ( pevaljka.LastOrDefault() == null){return BadRequest("Nepostojeca pevaljka");}

            // provera Songwriter-a
            var pisacTexta = await neo4j.Cypher.Match("(s: Songwriter)")
                                .Where(( Songwriter s) => s.id == songwriterID)
                                .Return( s => s.As<Songwriter>()).ResultsAsync;
            
            if ( pisacTexta.LastOrDefault() == null){return BadRequest("Nepostojeci tekstopisac");}

            // provera Albuma-a
            if ( albumID != -1)
            {
                var albumce = await neo4j.Cypher.Match("(s: Album)")
                                .Where(( Album s) => s.id == albumID)
                                .Return( s => s.As<Album>()).ResultsAsync;

                if ( albumce.LastOrDefault() == null){return BadRequest("Nepostojeci album");}
            } 


            var newSong = await neo4j.Cypher.Create("(u:Song $u)")
                                .WithParam("u", song)
                                .Set("u.id = id(u)")
                                .Return(u => u.As<Song>().id)
                                .ResultsAsync;

            int songID = newSong.LastOrDefault();


            await neo4j.Cypher.Match("(a:Singer), (b:Song)")
                                .Where((Singer a, Song b) => a.id == pevacID && b.id == songID)
                                .Create("(a)-[r:sings]->(b)")
                                .ExecuteWithoutResultsAsync();


            await neo4j.Cypher.Match("(a:Songwriter), (b:Song)")
                                .Where((Songwriter a, Song b) => a.id == songwriterID && b.id == songID)
                                .Create("(a)-[r:writes]->(b)")
                                .ExecuteWithoutResultsAsync();

            var like = false;
            Dictionary<string, object> ratingDict = new Dictionary<string, object>();
            ratingDict.Add("like", like);

            await neo4j.Cypher.Match("(u:User), (s:Song)")
                              .Where((Song s) => s.id == songID)
                              .Create("(s)-[r:Has]->(rating: Rating $rating)<-[rel:Liked]-(u)")
                              .WithParam("rating", ratingDict)
                              .Set("rating.id = id(rating)")
                              .ExecuteWithoutResultsAsync();

            if(albumID != -1)
            {
                 await neo4j.Cypher.Match("(a:Album), (b:Song)")
                                .Where((Album a, Song b) => a.id == albumID && b.id == songID)
                                .Create("(a)-[r:contains]->(b)")
                                .ExecuteWithoutResultsAsync();
            }
           
            // Success
            return Ok(1);
        }

        // Create Album entity
        [Route("AddAlbum/jwt")]
        [HttpPost]
        public async Task<IActionResult> AddAlbum([FromBody] Album album, string jwt)
        {

            var token = jwtService.Verify(jwt);

            if (token == null){return BadRequest("Not authorized");}

            if (album.title == "" || album.year == 0){return BadRequest("Nisu popunjena sva polja !");}

            var albumce = await neo4j.Cypher.Match("(a: Album)")
                            .Where( (Album a) => a.title == album.title && a.year == album.year)
                            .Return(a => a.As<Album>()).ResultsAsync;

            // Vec postoji
            if (albumce.LastOrDefault() != null){return Ok(0);}

             
            var newAlbum = await neo4j.Cypher.Create("(a:Album $a)")
                                .WithParam("a", album)
                                .Set("a.id = id(a)")
                                .Return(a => a.As<Album>())
                                .ResultsAsync;

            // Success
            return Ok(1);
        }

        [Route("GetSongsFeatured/{userID}")]
        [HttpGet]
        public async Task<IActionResult> GetSongsFeatured(int userID)
        {
            var songs = await neo4j.Cypher.Match("(user: User)-[r1:Liked]->(rating: Rating)<-[r2:Has]-(song:Song)<-[r3:sings]-(singer:Singer)")
                                          .Where((User user) => user.id == userID)
                                          .Return((singer, song, rating) => new 
                                            {
                                                Song = song.As<Song>(),
                                                singerName = singer.As<Singer>().name,
                                                rating = rating.As<Rating>().like
                                            })
                                          .Limit(100)
                                          .ResultsAsync;

            return Ok(songs);
        }


        [Route("GetSongsForYou/{userID}")]
        [HttpGet]
        public async Task<IActionResult> GetSongsForYou(int userID)
        {
            if(userID < 0)
            {
                return BadRequest("Nevalidan id!");
            }

            var songs = await neo4j.Cypher.Match("(user: User)-[r1:Liked]->(rating: Rating)<-[r2:Has]-(song:Song)<-[r3:sings]-(singer:Singer)")
                                          .Where((User user, Rating rating) => user.id == userID && rating.like == true)
                                          .Return((singer, song, rating) => new 
                                            {
                                                Song = song.As<Song>(),
                                                singerName = singer.As<Singer>().name,
                                                rating = rating.As<Rating>().like
                                            })
                                          .ResultsAsync;

            return Ok(songs);
        }


        [Route("IncreasePlaysNumber/{songID}")]
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


        [Route("GetAlbum/{albumName}")]
        [HttpGet]
        public async Task<IActionResult> GetAlbum(string albumName)
        {
            if(albumName == "") {return BadRequest("Nevalidan id!");}

            var album = await neo4j.Cypher.Match("(a: Album)")
                              .Where((Album a) => a.title == albumName)
                              .Return(a => a.As<Album>().id)
                              .ResultsAsync;

            return Ok(album);
        }


        [Route("LikeTheSong/{userID}/{songID}")]
        [HttpPut]
        public async Task<IActionResult> LikeTheSong(int userID, int songID)
        {
            if(userID < 0) 
            {
                return BadRequest("Nevalidan id korisnika!");
            }

            if(songID < 0)
            {
                return BadRequest("Nevalidan id pesme!");
            }

            await neo4j.Cypher.Match("(u:User)-[rel1:Liked]->(r:Rating)<-[rel2:Has]-(s:Song)")
                              .Where((User u, Song s) => u.id == userID && s.id == songID)
                              .Set("r.like = not r.like")
                              .ExecuteWithoutResultsAsync();

            return Ok("Uspesno");
        }


        [Route("GetSongsTopCharts")]
        [HttpGet]
        public async Task<IActionResult> GetSongsTopCharts()
        {
            var songs = await neo4j.Cypher.Match("(n: Song)<-[r:sings]-(s:Singer)")
                                          .With("n, s")
                                          .OrderByDescending("n.streams")
                                          .Return((n, s) => new 
                                          {
                                            Song = n.As<Song>(),
                                            singerName = s.As<Singer>().name
                                           })
                                           .Limit(50)
                                           .ResultsAsync;

            return Ok(songs);
        }


        [Route("SearchSongs/{name}")]
        [HttpGet]
        public async Task<IActionResult> SearchSongs(string name)
        {
            if(name == "")
            {
                return Ok(2);
            }

            var song = await neo4j.Cypher.Match("(s: Song)<-[r:sings]-(singer:Singer)")
                                .Where((Song s, Singer singer) => s.title == name)
                                .Return((s, singer) => new 
                                        {
                                            Song = s.As<Song>(),
                                            singerName = singer.As<Singer>().name
                                        }).ResultsAsync;

            if(song.Count() == 0)
            {
                song = await neo4j.Cypher.Match("(n: Album)-[rel:contains]->(s:Song)<-[r:sings]-(singer:Singer)")
                                .Where((Album n, Singer singer, Song s) => n.title == name)
                                .Return((s, singer) => new 
                                        {
                                            Song = s.As<Song>(),
                                            singerName = singer.As<Singer>().name
                                        }).ResultsAsync;
                
                if(song.Count() == 0)
                {
                    song = await neo4j.Cypher.Match("(s: Song)<-[r:sings]-(singer:Singer)")
                                .Where((Song s, Singer singer) => singer.name == name)
                                .Return((s, singer) => new 
                                        {
                                            Song = s.As<Song>(),
                                            singerName = singer.As<Singer>().name
                                        }).ResultsAsync;
                }
            }

            if(song.Count() == 0)
            {
                return Ok(0);
            }
            return Ok(song);
        }


        [Route("DeleteSong/{songID}/{userName}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteSong(int songID, string userName)
        {
            var song = await neo4j.Cypher.Match("(s: Song)<-[r:sings]-(singer:Singer)")
                                .Where((Song s, Singer singer) => singer.name == userName && s.id == songID)
                                .Return((s, singer) => new 
                                        {
                                            Song = s.As<Song>(),
                                            singerName = singer.As<Singer>().name
                                        }).ResultsAsync;

            if(song.Count() == 0)
            {
                return Ok(0);// Niste u mogucnosti da brisete pesmu
            }


            await neo4j.Cypher.Match("(s:Song)-[r:Has]->(rating:Rating)")
                              .Where((Song s) => s.id == songID)
                              .DetachDelete("rating")
                              .ExecuteWithoutResultsAsync();

            
            await neo4j.Cypher.Match("(s:Song)")
                              .Where((Song s) => s.id == songID)
                              .DetachDelete("s")
                              .ExecuteWithoutResultsAsync();

            return Ok(1);//Uspesno
        }


        [Route("GetSongView/{songID}")]
        [HttpGet]
        public async Task<IActionResult> GetSongView(int songID)
        {
            var song = await neo4j.Cypher.Match("(n: Song)<-[r:sings]-(s:Singer)")
                                            .Where((Song n) => n.id == songID)  
                                            .OptionalMatch("(a:Album)-[rel:contains]->(n)") 
                                            .Return((n, s, a) => new 
                                            {
                                                Song = n.As<Song>(),
                                                singerName = s.As<Singer>().name,
                                                albumName = a.As<Album>().title
                                            })
                                            .ResultsAsync;

            return Ok(song.LastOrDefault());
        }
    }
}