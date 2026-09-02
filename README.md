# PropPilot - AI Real Estate Recommendation & Intelligence System 🏡✨

A LangGraph-based Real Estate Recommendation system with a responsive, modern, lightweight React + Tailwind CSS web interface.

![PropPilot Preview](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 1. Modern 3-Column Architecture
- **Left Navigation Sidebar (`Sidebar.jsx`)**:
  - PropPilot brand logo with AI indicator badge.
  - Navigation tabs: **Chats**, **Properties**, **Saved** (with live count badge), and **Market Insights**.
  - Prominent **`+ New Chat`** button to reset conversational state.
  - User profile snippet (**John**) and footer links.
- **Middle Conversational AI Stage (`ChatInterface.jsx`)**:
  - Greeting hero: *"How can I help you today?"* with sparkle badge.
  - **2x2 Prompt Suggestion Grid**: *Dream Lake View*, *Wellness Living*, *Weekend Escape Home*, *Live Anywhere Life*.
  - Conversational message bubbles with markdown formatting and real-time streaming cursor animation.
  - **Fixed-Bottom Chat Input**: `+` attachment popover (floor plans, photos, budget docs), speech-to-text button, and send button.
- **Right Recommendations Feed (`RecommendationFeed.jsx`)**:
  - Header: *"For you in 📍 United kingdom"*, Map explorer drawer, and View mode switcher.
  - Categorized horizontal feeds:
    - **For you in United Kingdom**: *Villa Royale* (London), *Casa Prestige* (Manchester), *The Grand Haven* (Birmingham).
    - **House**: *Crystal Manor* (Edinburgh), *Grand Haven* (Glasgow), *Maple Nest* (Liverpool).
    - **Apartments**: *Royal Crest* (Bristol), *Solace Suites* (Newcastle), *Green Haven* (Scotland).
  - **Property Detail Modal (`PropertyModal.jsx`)**: Complete specs (price, beds, baths, sqft), AI match percentage, amenities checklist, and *"Ask AI"* button.

### 2. Market Intelligence & Analytics Dashboard (`AnalyticsDashboard.jsx`)
- Alternative CRM / market intelligence view toggled via header or sidebar.
- Lightweight pure SVG & CSS visual widgets:
  - **Activity Gauges**: *% with Activity* (35%) and *% Subscribed* (50%) semi-circular gauges with 0–100 tick markings.
  - **Pipeline Status Funnel**: 5-stage colored inverted funnel (*Not Contacted: 142* down to *Closed YTD: 13*).
  - **Lead Sources**: SVG donut chart (*Zillow 312*, *Website Direct*, *Social/Ads*, *Referrals*).
  - **Action Center**: Weekly metrics & today's priority actions.
  - **Tasks this Week**: Interactive checklist with tag pills and status toggles.

### 3. LangGraph Streaming Integration
- Modular service [`src/services/langgraphClient.js`](./src/services/langgraphClient.js) provides:
  - A realistic local token streaming simulator for frontend demos.
  - Production-ready Server-Sent Events (SSE) reader for LangGraph API endpoints (`POST /stream`).
- State management hook [`src/hooks/useLangGraphChat.js`](./src/hooks/useLangGraphChat.js) cleanly manages messages, streaming chunks, dynamic recommendation filtering, and property bookmarking.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Frontend Setup
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐍 Python LangGraph Backend Setup

The RAG pipeline connects to the FAISS vector database (`index.faiss` & `index.pkl`) and uses OpenRouter's free models for intelligent conversational real estate recommendations.

### 1. Activate Virtual Environment
```bash
# On Linux/macOS:
source venv/bin/activate

# Or install dependencies into your environment:
pip install -r requirements.txt
```

### 2. Configure Environment (`.env`)
```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

FAISS_INDEX_PATH=.
FAISS_INDEX_NAME=index
EMBEDDING_MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
```

### 3. Run the Agent

- **Interactive Terminal Chat Session**:
  ```bash
  python agent.py
  ```

- **One-shot Query**:
  ```bash
  python agent.py --query "Show me available 3 BHK apartments in Metroville"
  ```

- **Start FastAPI REST & SSE Streaming Backend Server**:
  ```bash
  python agent.py --serve --port 8000
  ```
  Endpoints:
  - `GET  /health` - Service health status
  - `POST /api/chat` - JSON request/response
  - `POST /api/chat/stream` - Server-Sent Events (SSE) streaming directly connected to the React UI

---

## 🔗 Connecting React Frontend to LangGraph Backend

The React client automatically connects to `http://localhost:8000`. You can configure custom endpoints in `.env`:
```env
VITE_LANGGRAPH_API_URL=http://localhost:8000
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatInput.jsx
│   │   ├── ChatInterface.jsx
│   │   ├── ChatMessage.jsx
│   │   └── PromptCard.jsx
│   ├── dashboard/
│   │   ├── ActionCenter.jsx
│   │   ├── AnalyticsDashboard.jsx
│   │   ├── DonutChart.jsx
│   │   ├── FunnelChart.jsx
│   │   ├── GaugeChart.jsx
│   │   └── TaskChecklist.jsx
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   └── Sidebar.jsx
│   └── recommendations/
│       ├── PropertyCard.jsx
│       ├── PropertyModal.jsx
│       └── RecommendationFeed.jsx
├── data/
│   ├── mockAnalytics.js
│   ├── mockProperties.js
│   └── promptSuggestions.js
├── hooks/
│   └── useLangGraphChat.js
├── services/
│   └── langgraphClient.js
├── App.jsx
├── index.css
└── main.jsx
```

---

## 📄 License
MIT © 2025 PropPilot, Inc.
