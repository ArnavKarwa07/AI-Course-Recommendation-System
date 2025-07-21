import json
import re

# Function to extract JSON block from text
def extract_json_block(text):
    matches = re.findall(r"```json(.*?)```", text, re.DOTALL)
    if matches:
        try:
            return json.loads(matches[0].strip())
        except json.JSONDecodeError:
            pass
    return None