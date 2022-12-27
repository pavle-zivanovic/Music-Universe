using System;
using System.Collections.Generic;

namespace Models
{
    public class User
    {
       public int id { get; set; }

       public string userName { get; set; }

       public string password { get; set; }

       public List<Rating> ratings { get; set; }
    }
}