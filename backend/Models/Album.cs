using System;
using System.Collections.Generic;

namespace Models
{
    public class Album
    {
       public int id { get; set; }

       public string title { get; set; }

       public int year { get; set; }

       public List<Song> songs { get; set; }
    }
}