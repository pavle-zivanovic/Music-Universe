using System;
using System.Collections.Generic;

namespace Models
{
    public class Song
    {
       public int id { get; set; }

       public string title { get; set; }

       public string lyrics { get; set; }

       public int year { get; set; }

       public string genre { get; set; }

       public string song { get; set; }

       public string image { get; set; }

       public int streams { get; set; }  

       //public List<Singer> singers { get; set; }

       //public Songwriter songWriter { get; set; }

       //public Album album { get; set; }

       //public List<Rating> ratings { get; set; }
    }
}