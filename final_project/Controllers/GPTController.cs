using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prog3_WebApi_Javascript.DTOs;
using System.Text.Json.Nodes;

namespace Prog3_WebApi_Javascript.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GPTController : ControllerBase
    {
        private readonly HttpClient _client;
        public GPTController(IConfiguration config)
        {
            // Initialize the private HttpClient instance
            _client = new HttpClient();

            // Retrieve the API key from the configuration settings
            string api_key = config.GetValue<string>("OpenAI:Key");

            // Create the authorization header using the API key
            string auth = "Bearer " + api_key;

            // Add the authorization header to the default request headers of the HttpClient instance
            _client.DefaultRequestHeaders.Add("Authorization", auth);
        }

        [HttpPost("GPTChat")]
        public async Task<IActionResult> GPTChat(Prompt promptFromUser)
        {
            // API endpoint for OpenAI GPT
            string endpoint = "https://api.openai.com/v1/chat/completions";
            // Specifies the model to use for chat completions (GPT-3.5 Turbo)
            string model = "gpt-3.5-turbo-0125";
            // Maximum number of tokens in the generated response
            int max_tokens = 300;
           
            

            double temperature = 1;

            string promptToSend = $"Please generate a question related to the subject of {promptFromUser.Subject} in the level of {promptFromUser.Level} students." +
            $"The question should be clear, concise, and designed to assess someone's knowledge " +
            $"or understanding of the topic. Keep 4 answers that only one of them is true. Return the answer only in {promptFromUser.Language} language. You must reply in the following JSON format: {{'question': string, 'answer': list, 'right_answer': string }}.";

            // Create a GPTRequest object to send to the API
            GPTRequest request = new GPTRequest()
            {
                max_tokens = max_tokens,
                model = model,
                temperature = temperature,
            response_format = new { type = "json_object" },
            messages = new List<Message>() {
                    new Message
                    {
                        role="system",
                        content = "You are a professional and creative question writer. You create questions and their answers, on various topics, in different academic levels and languages." +
                        " When you receive a topic, an academic level, and a language in the following format: <topic>, <level>, <language> - you return 5 close question together" +
                        " each question have 4 possible answer that only one of them is true." +
                        " Be creative and think out of the box. You must reply in the following JSON format: {'question': string, 'answer': list,}."
                    },
                    new Message
                    {
                        role = "user",
                        content = "Math, Elementary school, Hebrew"
                    },
                    new Message
        {
            role = "assistant",
            content = "{\"question\": 'כמה זה 1+1?', \"answers\": ['1', '2', '3', '4'], \"right_answer\": '2'}"
        },
        new Message
        {
            role = "user",
            content = "History, Elementary school, Hebrew"
        },

        new Message
        {
            role = "assistant",
            content = "{\"question\": 'מתי הוקמה מדינת ישראל?', \"answers\": ['1948', '1967', '1917', '1900'], \"right_answer\": '1948'}"
        },
            new Message
            {
                role = "user",
                content = promptToSend
            }
        }
            };

            // Send the GPTRequest object to the OpenAI API
            var res = await _client.PostAsJsonAsync(endpoint, request);

            // Check if the API response indicates an error
            if (!res.IsSuccessStatusCode)
                return BadRequest("problem: " + res.Content.ReadAsStringAsync());

            // Read the JSON response from the API
            JsonObject? jsonFromGPT = res.Content.ReadFromJsonAsync<JsonObject>().Result;
            if (jsonFromGPT == null)
                return BadRequest("empty");

            // Extract the generated content from the JSON response
            string content = jsonFromGPT["choices"][0]["message"]["content"].ToString();

            // Return the generated content
            return Ok(content);

        }

    }

}
