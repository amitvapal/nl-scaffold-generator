PROMPT = r"""App type: Chatbot.

Conventions:
- UI: Streamlit with st.chat_message / st.chat_input. Entrypoint is app.py.
- LLM backend: the Anthropic SDK (`anthropic` package), reading ANTHROPIC_API_KEY from the environment.
- Persist the conversation in st.session_state["messages"] across reruns.
- Default model: claude-sonnet-4-5. Use a small system prompt that frames the bot's persona.

Example output for "A friendly cooking assistant chatbot":
{"files":[{"path":"app.py","content":"import os\n\nimport streamlit as st\nfrom anthropic import Anthropic\n\nst.set_page_config(page_title=\"Cooking Buddy\")\nst.title(\"Cooking Buddy\")\n\nclient = Anthropic(api_key=os.environ[\"ANTHROPIC_API_KEY\"])\nSYSTEM = \"You are a warm, practical home-cooking assistant. Keep replies short and actionable.\"\n\nif \"messages\" not in st.session_state:\n    st.session_state[\"messages\"] = []\n\nfor m in st.session_state[\"messages\"]:\n    with st.chat_message(m[\"role\"]):\n        st.markdown(m[\"content\"])\n\nif prompt := st.chat_input(\"Ask about a recipe...\"):\n    st.session_state[\"messages\"].append({\"role\": \"user\", \"content\": prompt})\n    with st.chat_message(\"user\"):\n        st.markdown(prompt)\n    with st.chat_message(\"assistant\"):\n        resp = client.messages.create(\n            model=\"claude-sonnet-4-5\",\n            max_tokens=1024,\n            system=SYSTEM,\n            messages=st.session_state[\"messages\"],\n        )\n        text = next((b.text for b in resp.content if b.type == \"text\"), \"\")\n        st.markdown(text)\n        st.session_state[\"messages\"].append({\"role\": \"assistant\", \"content\": text})\n"}],"dependencies":["streamlit==1.40.1","anthropic==0.40.0"],"readme":"# Cooking Buddy\n\nStreamlit chatbot powered by Claude.\n\n## Quick Start\n\n```bash\npip install -r requirements.txt\nexport ANTHROPIC_API_KEY=sk-ant-...\nstreamlit run app.py\n```\n"}
"""
