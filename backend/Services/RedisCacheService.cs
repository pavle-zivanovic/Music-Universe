using System.Collections.Generic;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace Services
{
    public class RedisCacheService : ICacheService
    {
        private readonly IConnectionMultiplexer redis;

        public RedisCacheService(IConnectionMultiplexer _redis)
        {
            redis = _redis;
        }

        public async Task<List<int>> GetCacheListAsync(string key)
        {
            var db = redis.GetDatabase();
            var lenlist = await db.ListLengthAsync(key);
            List<int> lista = new List<int>();

            for(int i=0; i < lenlist; i++)
            {
                int a = (int)await db.ListLeftPopAsync(key);
                lista.Add(a);
            }
           return lista;
        }

        public async Task<List<string>> GetCacheListStringAsync(string key)
        {
            var db = redis.GetDatabase();
            var lenlist = await db.ListLengthAsync(key);
            List<string> lista = new List<string>();

            for(int i=0; i < lenlist; i++)
            {
                string a = (string)await db.ListGetByIndexAsync(key, i);
                lista.Add(a);
            }
           return lista;
        }

        public async Task SetCacheListAsync(string key, List<int> values)
        {
            var db = redis.GetDatabase();
      
            for(int i=0; i<values.Count; i++)
            {
                await db.ListLeftPushAsync(key, values[i]);
            }
        }

        public async Task AddElementCacheListAsync(string key, string value)
        {
            var db = redis.GetDatabase();
            await db.ListLeftPushAsync(key, value);
        }

        public async Task<string> GetCacheStringAsync(string key)
        {
            var db = redis.GetDatabase();
            return await db.StringGetAsync(key);
        }

        public async Task SetCacheStringAsync(string key, string value)
        {
            var db = redis.GetDatabase();
            await db.StringSetAsync(key, value);
        }

        public async Task DeleteCacheListStringAsync(string key)
        {
            var db = redis.GetDatabase();
            var lenlist = await db.ListLengthAsync(key);
            db.KeyDelete(key);
        }
    }
}