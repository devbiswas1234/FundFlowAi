import os
import re

src_dir = r"c:\Users\devbi\OneDrive\Desktop\FundFlowAi\frontend\src"

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # If it contains 127.0.0.1:8000 or localhost:8000
    if "127.0.0.1:8000" not in content and "localhost:8000" not in content:
        return

    # Replace in string literals: 'http://127.0.0.1:8000/cases' -> `${API_BASE_URL}/cases`
    # Replace in template literals: `http://127.0.0.1:8000/cases/${id}` -> `${API_BASE_URL}/cases/${id}`

    # First, let's just make sure the declaration is added at the top
    declaration = "const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';\n"
    
    if declaration not in content:
        # Find the last import statement to insert after it
        lines = content.split('\n')
        last_import = -1
        for i, line in enumerate(lines):
            if line.startswith('import '):
                last_import = i
        
        if last_import != -1:
            lines.insert(last_import + 1, declaration)
        else:
            lines.insert(0, declaration)
        content = '\n'.join(lines)
    
    # We will replace 'http://127.0.0.1:8000/...' with `${API_BASE_URL}/...` and keep the backticks correctly
    # If it was a single/double quote string like 'http://127.0.0.1:8000/cases', it needs to become `${API_BASE_URL}/cases`
    # We can just convert all such occurrences to template literals
    
    # Replace 'http://127.0.0.1:8000/...' with `${API_BASE_URL}/...`
    content = re.sub(r"['\"]http://(?:127\.0\.0\.1|localhost):8000(.*?)(?=[\"'])['\"]", r"`${API_BASE_URL}\1`", content)
    
    # Replace `http://127.0.0.1:8000/ cases${id}` with `${API_BASE_URL}/ cases${id}`
    content = re.sub(r"http://(?:127\.0\.0\.1|localhost):8000", "${API_BASE_URL}", content)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {file_path}")

for root, _, files in os.walk(src_dir):
    for filename in files:
        if filename.endswith(".js"):
            process_file(os.path.join(root, filename))

