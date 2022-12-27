using System;
using System.Collections.Generic;

namespace Models
{
    public class Song
    {
       public int id { get; set; }

       public string title { get; set; }

       public string text { get; set; }

       public int year { get; set; }

       public List<Singer> singers { get; set; }

       public Songwriter writer { get; set; }

       public Album album { get; set; }
    }
}