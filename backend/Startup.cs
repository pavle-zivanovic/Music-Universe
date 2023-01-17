using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Neo4jClient;
using StackExchange.Redis;
using Models;
using Services;

namespace Music_Universe
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddScoped<JwtService>();
            services.AddCors(options => 
            {
               options.AddPolicy("CORS", builder => 
               {
                   builder.WithOrigins(new string[]
                   {
                       "http://localhost:8080",
                       "https://localhost:8080",
                       "http://127.0.0.1:8080",
                       "https://127.0.0.1:8080",
                       "http://127.0.0.1:5501",
                       "http://localhost:5501",
                       "https://127.0.0.1:5501",
                       "https://localhost:5501",
                       "http://localhost:3000",
                       "https://localhost:3000",
                       "http://127.0.0.1:3000",
                       "https://127.0.0.1:3000",
                   })
                   .AllowAnyHeader()
                   .AllowAnyMethod();
               });

            });

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Music_Universe", Version = "v1" });
            });

            var client = new BoltGraphClient(new Uri("bolt://localhost:7687"),"neo4j","stump");
            client.ConnectAsync();
            services.AddSingleton<IGraphClient>(client);

            services.AddSingleton<IConnectionMultiplexer>(x =>
                ConnectionMultiplexer.Connect(Configuration.GetValue<string>("RedisConnection")));
            services.AddSingleton<ICacheService, RedisCacheService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Music_Universe v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
