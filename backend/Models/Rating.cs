using System;
using System.Collections.Generic;

namespace Models
{
    public class Rating
    {
        public User user { get; set; }

        public Song song { get; set; }

        public int stars { get; set; }
    }
}