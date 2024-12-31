# A Project to Convert Jina Embedding Service Requests to OpenAI Compatible Format

## How to Run

### Local Deployment

```bash
git clone https://github.com/RedwindA/jina-embedding-2-openai
cd jina-embedding-2-openai
pip install -r requirements.txt
python main.py
```

### Cloudflare Workers Deployment

Fork this project, then create a new Worker in the Cloudflare Workers console. In the Worker settings, connect to the Git repository, select your Fork, and **switch to the Worker branch**. Keep other settings as default.

Push once, and Cloudflare Workers will automatically deploy your Worker. Alternatively, you can manually copy the code from worker.js into the Cloudflare Workers editor and deploy it.