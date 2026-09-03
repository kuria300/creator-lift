# The only file that imports google-generativeai. 
# It handles configuring the API key, picking the model, sending the message, and returning the text. 
# If you ever swap Gemini for GPT-4 or Claude, you only change this one file nothing else breaks.

from google import genai
from django.conf import settings
import httpx

class GeminiLLM:

    def __init__(self):
        api_key = settings.GEMINI_API_KEY


        self.client = genai.Client(api_key=api_key)
        self.async_client = self.client.aio
        self.model= getattr(settings, 'GEMINI_MODEL', 'gemini-3-flash-preview')

    async def generate(self, message):
        """
        send a message and get a response from gemini
        """
        try:
           response = await self.async_client.models.generate_content(
            model=self.model,
            contents=message,
           )

           return response.text
        except httpx.HTTPStatusError as e:
            # Log specific API errors (e.g., 429 Too Many Requests, 401 Unauthorized)
            print(f"API Error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            print(f"General Error: {str(e)}")
            raise

    async def close(self):
        await self.async_client.aclose()


       