/**
 * LangGraph Client & Integration Layer
 * 
 * This service manages communication with a LangGraph AI workflow backend.
 * It provides both:
 * 1. A simulated streaming engine (for frontend-only demo & testing)
 * 2. A production-ready Fetch/SSE streaming handler for LangGraph REST/WebSocket API.
 */

// Configuration: connects to FastAPI/LangGraph backend on port 8000, with graceful fallback to local engine
const LANGGRAPH_API_URL = import.meta.env?.VITE_LANGGRAPH_API_URL !== undefined 
  ? import.meta.env.VITE_LANGGRAPH_API_URL 
  : 'http://localhost:8000';

/**
 * Sends a conversation turn to the LangGraph backend and handles streaming response tokens.
 * 
 * @param {Object} options
 * @param {string} options.message - The latest user message text
 * @param {Array} options.history - Array of past messages [{ id, role, content }]
 * @param {Object} options.filters - Current property filters / context
 * @param {Function} options.onChunk - Callback invoked for each streamed token (chunk: string)
 * @param {Function} options.onToolCall - Callback when LangGraph invokes a tool (toolName: string, args: object)
 * @param {Function} options.onComplete - Callback when the stream finishes (fullResponse: string, recommendedProps?: Array)
 * @param {Function} options.onError - Callback if an error occurs
 * @returns {Function} Abort controller function to cancel stream
 */
export async function streamLangGraphResponse({
  message,
  history = [],
  filters = {},
  onChunk,
  onToolCall,
  onComplete,
  onError
}) {
  const controller = new AbortController();

  // If LangGraph API endpoint is provided, try real SSE streaming first:
  if (LANGGRAPH_API_URL) {
    try {
      const response = await fetch(`${LANGGRAPH_API_URL}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          input: {
            messages: [
              ...history.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: message }
            ],
            filters,
          },
          config: {
            configurable: {
              thread_id: 'proppilot-session-1'
            }
          }
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`LangGraph API Error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let retrievedProps = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const rawChunk = decoder.decode(value, { stream: true });
        const lines = rawChunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          try {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                accumulatedText += data.token;
                onChunk?.(data.token);
              }
              if (data.tool_call) {
                onToolCall?.(data.tool_call.name, data.tool_call.args);
              }
              if (data.properties) {
                retrievedProps = data.properties;
              }
            } else {
              accumulatedText += line;
              onChunk?.(line);
            }
          } catch {
            accumulatedText += line;
            onChunk?.(line);
          }
        }
      }

      onComplete?.(accumulatedText, retrievedProps);
      return () => controller.abort();
    } catch (err) {
      if (err.name === 'AbortError') {
        return () => {};
      }
      console.warn(`[PropPilot] Backend connection to ${LANGGRAPH_API_URL} not available. Falling back to local engine:`, err.message);
      // Fall through to local simulated engine below
    }
  }

  // --- LOCAL SIMULATED LANGGRAPH STREAMING ENGINE ---
  // Generates intelligent, context-aware responses with streaming tokens and property updates
  const simulatedResponses = generateContextualResponse(message);
  let currentIndex = 0;
  const fullText = simulatedResponses.text;
  const tokens = fullText.split(/(\s+|\n+)/); // split by words & spaces for natural streaming

  let isAborted = false;

  const intervalId = setInterval(() => {
    if (isAborted) {
      clearInterval(intervalId);
      return;
    }

    if (currentIndex < tokens.length) {
      const token = tokens[currentIndex];
      onChunk?.(token);
      currentIndex++;
    } else {
      clearInterval(intervalId);
      onComplete?.(fullText, simulatedResponses.recommendations);
    }
  }, 25);

  return () => {
    isAborted = true;
    clearInterval(intervalId);
  };
}

/**
 * Intelligent helper for local testing and realistic demonstrations
 */
function generateContextualResponse(userPrompt) {
  const promptLower = userPrompt.toLowerCase();

  if (promptLower.includes('lake') || promptLower.includes('water')) {
    return {
      text: "Here are prime waterfront and lake-view recommendations curated for you:\n\n✨ **Featured Match: Villa Royale (London)**\nOffers panoramic water views with floor-to-ceiling glass and private waterside deck.\n\nKey highlights:\n- Direct water-facing expansive terraces\n- Contemporary architectural lines with integrated infinity pool\n- Private mooring & secluded grounds\n\nWould you like me to schedule a virtual tour or filter by specific bedroom count?",
      recommendations: ['prop-1', 'prop-2']
    };
  }

  if (promptLower.includes('wellness') || promptLower.includes('spa') || promptLower.includes('garden')) {
    return {
      text: "I've matched properties with dedicated wellness amenities:\n\n🌿 **Casa Prestige (Manchester) & Green Haven**\nBoth estates feature private biophilic garden spaces, heated thermal pools, and indoor yoga/gym studios.\n\nWould you like me to prioritize properties with private sauna/steam suites or eco-certified construction?",
      recommendations: ['prop-2', 'prop-9']
    };
  }

  if (promptLower.includes('escape') || promptLower.includes('weekend') || promptLower.includes('countryside')) {
    return {
      text: "For a tranquil weekend retreat, here are exceptional options:\n\n🏰 **Crystal Manor (Edinburgh)**\nPrivate woodland borders, historic stonework paired with ultra-sleek minimalist glass wings, under 45 minutes from airport connections.\n\nShall we look into countryside villas with helipad or equestrian facilities?",
      recommendations: ['prop-4', 'prop-5']
    };
  }

  if (promptLower.includes('apartment') || promptLower.includes('flat') || promptLower.includes('city')) {
    return {
      text: "Here are top-tier metropolitan apartments across the UK:\n\n🏙️ **Royal Crest (Bristol)** and **Solace Suites (Newcastle)**\nFeaturing 24/7 concierge, private panoramic terraces, high-speed fiber, and underground parking.\n\nWhat is your preferred monthly budget or purchase ceiling?",
      recommendations: ['prop-7', 'prop-8']
    };
  }

  return {
    text: `I've analyzed your search for "${userPrompt}".\n\nBased on current UK prime market data:\n- **Average price range:** £520,000 – £3,250,000\n- **High-demand features:** Solar arrays, EV charging, floor-to-ceiling glass\n\nI have highlighted the most relevant properties in your dynamic feed on the right. Would you like to refine by price, bedrooms, or location?`,
    recommendations: ['prop-1', 'prop-2', 'prop-3']
  };
}
