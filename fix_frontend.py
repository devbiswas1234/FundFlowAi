import os

src_dir = r"c:\Users\devbi\OneDrive\Desktop\FundFlowAi\frontend\src"

for root, _, files in os.walk(src_dir):
    for filename in files:
        if filename.endswith(".js"):
            file_path = os.path.join(root, filename)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            new_content = content.replace("process.env.REACT_APP_API_URL || `${API_BASE_URL}`", "process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'")

            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Fixed {file_path}")
