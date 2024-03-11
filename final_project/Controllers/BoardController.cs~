using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prog3_WebApi_Javascript.DTOs;
using System.Text.Json.Nodes;

namespace Prog3_WebApi_Javascript.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoardController : ControllerBase
    {
        private readonly HttpClient _client;
        public BoardController()
        {
            _client = new HttpClient();

        }
        [HttpGet]
        public async Task<IActionResult> GetActivity()
        {
            string endpoint = "http://www.boredapi.com/api/activity?type=recreational";

            var response = await _client.GetAsync(endpoint);

            if (response.IsSuccessStatusCode)
            {
                JsonObject responseContent = response.Content.ReadFromJsonAsync<JsonObject>().Result;

                Board bored = new Board();
                bored.activity = responseContent["activity"].ToString();
                //bored.accessibility = responseContent["accessibility"].ToString();
                //userToReturn.FirstName = responseContent["results"][0]["name"]["first"].ToString();
                //userToReturn.LastName = responseContent["results"][0]["name"]["last"].ToString();
                //userToReturn.ImageUrl = responseContent["results"][0]["picture"]["large"].ToString();

                return Ok(bored);
            }
            return BadRequest("API Call Failed");
        }
    }
}
