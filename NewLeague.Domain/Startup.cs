using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using NewLeague.Domain.Models;
using NewLeague.Domain.Providers;
using Owin;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
[assembly: OwinStartup(typeof(NewLeague.Domain.Startup))]
namespace NewLeague.Domain
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureOAuth(app);
            Database.SetInitializer<AuthContext>(null);
            //app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            
            //Rest of code is here;
        }

        public void ConfigureOAuth(IAppBuilder app)
        {
            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                Provider = new SimpleAuthorizationServerProvider()
            };

            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

        }
    }
}