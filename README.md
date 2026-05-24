# SmartFlow AI

Minimal local README for running the SmartFlow AI prototype.

Prerequisites
- Node.js 16+ installed

Setup
1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root containing your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
# optional: PORT=4000
```

Run

```bash
npm start
```

By default the app serves the site at http://localhost:3000

Files of interest
- `server.js` — Express server and API route
- `index.html` — Frontend prototype served statically

Troubleshooting
- If the server does not start, check the terminal for errors and ensure `OPENAI_API_KEY` is set.
