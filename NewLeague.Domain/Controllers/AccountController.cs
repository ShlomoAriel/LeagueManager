using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using NewLeague.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace NewLeague.Domain.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private AuthRepository _repo = null;
 
        public AccountController()
        {
            _repo = new AuthRepository();
        }
        
        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
 
            IdentityResult result = await _repo.RegisterUser(userModel);
 
            IHttpActionResult errorResult = GetErrorResult(result);
 
            if (errorResult != null)
            {
                return errorResult;
            }
 
            return Ok();
        }
        [Route("Register")]
        public async Task<IHttpActionResult> AddTeamManager(UserModel userModel)
        {
            if(IsAdmin())
            {
                var password = userModel.UserName.Substring(0, userModel.UserName.IndexOf("@"));
                password = password + "@123456";
                userModel.Password = password;
                userModel.ConfirmPassword = password;

                IdentityResult result = await _repo.RegisterUser(userModel);

                IHttpActionResult errorResult = GetErrorResult(result);

                if (errorResult != null)
                {
                    return errorResult;
                }
            }
            

            return Ok();
        }
        //public void AddUserRole()
        //{
        //    var roleresult = UserManager.AddToRole(currentUser.Id, "Superusers");
        //}
        public void AddRole(string roleName)
        {
            var roleManager = new RoleManager<Microsoft.AspNet.Identity.EntityFramework.IdentityRole>(new RoleStore<IdentityRole>(new AuthContext()));


            if (!roleManager.RoleExists(roleName))
            {
                var role = new Microsoft.AspNet.Identity.EntityFramework.IdentityRole();
                role.Name = roleName;
                roleManager.Create(role);

            }
        }
        [HttpDelete]
        public bool  DeleteUser(string email)
        {
            return _repo.DeleteUser(email);
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _repo.Dispose();
            }
 
            base.Dispose(disposing);
        }
 
        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }
 
            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }
 
                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }
 
                return BadRequest(ModelState);
            }
 
            return null;
        }
        [Authorize]
        public bool IsAdmin()
        {
            var currentUser = User;
            var identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> claims = identity.Claims;
            if (!identity.IsAuthenticated)
                throw new HttpException(401, "Auth Failed");
            var teamId = claims.FirstOrDefault(x => x.Type.Equals("TeamId")).Value;
            if (teamId == null)
                return true;
            throw new HttpException(401, "Auth Failed");
        }
        [Authorize]
        public string GetCurrentUserTeamId()
        {
            var currentUser = User;
            var identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> claims = identity.Claims;
            var teamId = claims.FirstOrDefault(x => x.Type.Equals("TeamId")).Value;
            return teamId;
        }
        [Authorize]
        public IEnumerable<UserModel> GetUsers()
        {
            var users = Mapper.Map<IEnumerable<UserModel>>(_repo.GetUsers());
            return users;
        }
         [Authorize]
        public IEnumerable<int> GetDummy()
        {
            var list = new List<int>() { 1,2};
            return list;
        }
    }
}
