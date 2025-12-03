import requests

url = "http://localhost:8000/summarize"
text = """
Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.
The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving". This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.
"""

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json={"text": text})
    
    if response.status_code == 200:
        print("\n✅ Success!")
        print("Summary:", response.json()["summary"])
    else:
        print(f"\n❌ Error {response.status_code}:", response.text)
except Exception as e:
    print(f"\n❌ Connection failed: {e}")
    print("Make sure the backend is running at http://localhost:8000")
