# Using async requests for fastest retrieval
import aiohttp
import asyncio

async def get_image(search_term):
    async with aiohttp.ClientSession() as session:
        url = f"https://searxng.example.com/search"
        params = {
            'q': search_term,
            'format': 'json',
            'categories': 'images',
            'safesearch': 0
        }
        async with session.get(url, params=params) as response:
            results = await response.json()
            return results['results'][0]['img_src']  # First image URL
print(asyncio.run(get_image("puppies")))