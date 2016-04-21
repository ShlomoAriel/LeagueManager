using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using AutoMapper;
using NewLeague.Models;
using NewLeague.Domain.Models;
namespace NewLeague.Domain
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            Mapper.CreateMap<Player, PlayerViewModel>().ReverseMap();
            Mapper.CreateMap<Team, TeamViewModel>().ReverseMap();
            Mapper.CreateMap<Week, WeekViewModel>().ReverseMap();
            Mapper.CreateMap<Season, SeasonViewModel>().ReverseMap();
            Mapper.CreateMap<Season, SeasonMatchesViewModel>().ReverseMap();
            Mapper.CreateMap<SeasonViewModel, SeasonMatchesViewModel>().ReverseMap();
            Mapper.CreateMap<Match, MatchViewModel>().ReverseMap();
            Mapper.CreateMap<ApplicationUser, UserModel>().ReverseMap();
            Mapper.CreateMap<Match, MatchFormModel>().ReverseMap();
            Mapper.CreateMap<MatchFormModel, MatchViewModel>().ReverseMap();
            Mapper.CreateMap<Goal, GoalViewModel>().ReverseMap();
            Mapper.CreateMap<Position, PositionViewModel>().ReverseMap();
            Mapper.CreateMap<PlayerRegistrationModel, Player>().ReverseMap();
            
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);

            config.Routes.MapHttpRoute(
                name: "ApiWithAction",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                       name: "DefaultApi",
                       routeTemplate: "api/{controller}/{id}",
                       defaults: new { id = RouteParameter.Optional }
                   );

            
            // Uncomment the following l    ine of code to enable query support for actions with an IQueryable or IQueryable<T> return type.
            // To avoid processing unexpected or malicious queries, use the validation settings on QueryableAttribute to validate incoming queries.
            // For more information, visit http://go.microsoft.com/fwlink/?LinkId=279712.
            //config.EnableQuerySupport();

            // To disable tracing in your application, please comment out or remove the following line of code
            // For more information, refer to: http://www.asp.net/web-api
            config.EnableSystemDiagnosticsTracing();
            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(
                config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml"));

            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            GlobalConfiguration.Configuration.Formatters.Remove(GlobalConfiguration.Configuration.Formatters.XmlFormatter);
        }
    }
}
