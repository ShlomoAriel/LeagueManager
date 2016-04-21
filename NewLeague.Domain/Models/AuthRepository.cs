using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace NewLeague.Domain.Models
{
    public class AuthRepository : IDisposable
    {
        private AuthContext _ctx;

        private UserManager<ApplicationUser> _userManager;

        public AuthRepository()
        {
            _ctx = new AuthContext();
            _userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(_ctx));
        }

        public async Task<IdentityResult> RegisterUser(UserModel userModel)
        {
            ApplicationUser user = new ApplicationUser 
            {
                UserName = userModel.UserName,
                TeamId = userModel.TeamId
            };

            var result = await _userManager.CreateAsync(user, userModel.Password);

            return result;
        }
        public IEnumerable<ApplicationUser> GetUsers()
        {
            var users = _ctx.Users.ToList();

            return users;
        }
        public async Task<ApplicationUser> FindUser(string userName, string password)
        {
            ApplicationUser user = await _userManager.FindAsync(userName, password);

            return user;
        }
        public bool DeleteUser(string email)
        {
            var user = _ctx.Users.FirstOrDefault(x => x.Id.Equals(email));
            
            //var users = _ctx.Users.ToList();
           // var user2 = await _userManager.FindByIdAsync(email);
            if (user == null)
            {
                return false;
            }
            _ctx.Users.Remove(user);
            try
            {
                _ctx.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return false;
            }
          //  _userManager.Delete(user2);
            return true;
        }
        public void Dispose()
        {
            _ctx.Dispose();
            _userManager.Dispose();

        }
    }
}