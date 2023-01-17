using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services
{
    public interface ICacheService
    {
        Task<List<int>> GetCacheListAsync(string key);

        Task SetCacheListAsync(string key, List<int> value);

        Task<string> GetCacheStringAsync(string key);

        Task SetCacheStringAsync(string key, string value);

        Task AddElementCacheListAsync(string key, string value);

        Task<List<string>> GetCacheListStringAsync(string key);
    }
}