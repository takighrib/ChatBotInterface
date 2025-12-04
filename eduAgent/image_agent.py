import os
import google.generativeai as genai
from search import find_best_image

class ImageAgent:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("Error: GOOGLE_API_KEY not found in .env file.")
            return
            
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def process_explanation(self, explanation):
        prompt = (
            f"Here is an explanation text: \"{explanation}\"\n"
            "Your task is to enhance this explanation by inserting visual aid markers where appropriate.\n"
            "Identify ALL distinct concepts, physical objects, or systems mentioned that would benefit from a visual diagram or image.\n"
            "For EACH concept, insert a marker in the format `<<IMAGE: search_query>>` immediately after the sentence introducing or describing it.\n"
            "The `search_query` should be specific to that concept (e.g., 'Transformer architecture', 'Self-attention mechanism', 'Neural network weights').\n"
            "Do not limit yourself to one image. If the text explains 3 different parts, insert 3 different markers distributed throughout the text.\n"
            "Example:\n"
            "Original: 'The CPU processes instructions. The RAM stores data temporarily.'\n"
            "Modified: 'The CPU processes instructions. <<IMAGE: CPU architecture diagram>> The RAM stores data temporarily. <<IMAGE: RAM structure diagram>>'\n"
            "Do not remove or alter any part of the original text. Just insert the markers.\n"
            "If no images are needed, return the text exactly as is."
        )
        
        try:
            response = self.model.generate_content(prompt)
            modified_text = response.text.strip()
            
            # Clean up markdown if present
            if modified_text.startswith("```"):
                lines = modified_text.split('\n')
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                modified_text = "\n".join(lines)

            # Parse the modified text into segments
            import re
            segments = []
            last_pos = 0
            # Regex to find <<IMAGE: query>>
            pattern = re.compile(r"<<IMAGE: (.*?)>>")
            
            for match in pattern.finditer(modified_text):
                # Text before the marker
                if match.start() > last_pos:
                    segments.append({"type": "text", "content": modified_text[last_pos:match.start()]})
                
                # The image query
                query = match.group(1).strip()
                
                # Perform search immediately
                print(f"[Image Agent] Searching for: {query}")
                img_result = find_best_image(query)
                
                segments.append({
                    "type": "image", 
                    "query": query,
                    "result": img_result
                })
                
                last_pos = match.end()
            
            # Remaining text
            if last_pos < len(modified_text):
                segments.append({"type": "text", "content": modified_text[last_pos:]})
                
            return segments
            
        except Exception as e:
            print(f"Image Agent Error: {e}")
            # Fallback: return the original text as one segment
            return [{"type": "text", "content": explanation}]
