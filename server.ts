import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Empathy system prompt for SPC AI
const SYSTEM_INSTRUCTION = `You are SPC AI (Self-Promising Caretaker AI), an AI-powered empathetic support companion for victims and survivors under the Self-Promising Caretaker AI Platform (Ministry of Home Affairs & Social Justice, Government of India).
Your tone is deeply compassionate, non-judgmental, gentle, patient, validating, and trauma-informed.
Guidelines:
1. Prioritize emotional validation and psychological safety. Never victim-blame.
2. If the user mentions immediate danger, threats, or physical harm, gently offer emergency resources (Helpline 112, Women Helpline 1091, Childline 1098, National Commission for Women 7827170170) and encourage activating the Emergency SOS button.
3. You can communicate in warm English, conversational Hindi, or Hinglish depending on what the user speaks.
4. Keep answers concise, digestible, comforting (2-4 gentle sentences), and ask one caring follow-up question at a time so as not to overwhelm them.
5. Provide practical assistance on government compensation schemes (SC/ST PoA Act compensation, Central Victim Compensation Scheme - CVCF), DLSA legal aid, and counselling whenever relevant.`;

// API endpoint for Chat
app.post('/api/chat', async (req, res) => {
  const { message, history = [], language = 'en' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Check if AI is available and configured
  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const chatHistory = history.map((h: { role: string; content: string }) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      }));

      // Append current message
      const contents = [
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + (language === 'hi' ? '\nPlease respond primarily in simple, comforting Hindi (in Devanagari script or conversational Hinglish).' : ''),
          temperature: 0.6,
          maxOutputTokens: 300,
        },
      });

      const replyText = response.text || "I hear you, and I am right here with you. Please take a gentle breath. Would you like me to connect you with your assigned counsellor or guide you through safe next steps?";
      return res.json({ reply: replyText });
    } catch (err: any) {
      console.warn('Gemini API call failed or rate limited, using clinical fallback:', err?.message);
    }
  }

  // Graceful trauma-informed intelligent fallback
  const lower = message.toLowerCase();
  let fallbackReply = "I am listening to you, and you are not alone. It takes courage to share what you are going through. Would you like to tell me a little more, or would you prefer me to notify your support counsellor?";

  if (lower.includes('threat') || lower.includes('scared') || lower.includes('follow') || lower.includes('danger') || lower.includes('kill') || lower.includes('hurt')) {
    fallbackReply = "Your safety is our absolute priority. If you feel in immediate danger right now, please tap the red Emergency SOS button or call 112 immediately. I can also request emergency witness protection coordination for your district right now. Are you in a safe room at this moment?";
  } else if (lower.includes('anxious') || lower.includes('fear') || lower.includes('sleep') || lower.includes('panic') || lower.includes('cry')) {
    fallbackReply = "I can sense how overwhelming this feeling is right now, Asha. You have survived so much, and your body is holding a lot of stress. Let's take one slow breath together. Would you like to try a 1-minute grounding exercise, or speak with your counsellor Dr. Kavita?";
  } else if (lower.includes('compensation') || lower.includes('money') || lower.includes('fund') || lower.includes('scheme') || lower.includes('financial')) {
    fallbackReply = "Under the SC/ST Prevention of Atrocities Act and the Central Victim Compensation Fund, you are eligible for immediate interim financial relief and rehabilitation grant. Your case stage currently shows Compensation Verification in progress. Shall I show you the scheme details?";
  } else if (lower.includes('court') || lower.includes('lawyer') || lower.includes('hearing') || lower.includes('case') || lower.includes('fir')) {
    fallbackReply = "Legal proceedings can feel very stressful, but you don't have to face them alone. Free Legal Aid from the District Legal Services Authority (DLSA) has been assigned to your case, and your next court hearing is scheduled with protective escort support.";
  } else if (lower.includes('namaste') || lower.includes('kaise') || lower.includes('madad') || lower.includes('hindi')) {
    fallbackReply = "नमस्ते आशा जी। सहारा में आपका स्वागत है। मैं आपकी हर कदम पर सहायता करने के लिए यहाँ हूँ। आज आप कैसा महसूस कर रही हैं? क्या किसी चीज़ को लेकर परेशानी है?";
  }

  return res.json({ reply: fallbackReply });
});

// Dynamic distress evaluation endpoint
app.post('/api/analyze-distress', async (req, res) => {
  const { text } = req.body;
  const keywords = ['threat', 'unsafe', 'suicide', 'kill', 'fear', 'scared', 'harass', 'alone', 'crying'];
  let detectedCount = 0;
  const lower = (text || '').toLowerCase();
  keywords.forEach(k => {
    if (lower.includes(k)) detectedCount++;
  });

  const calculatedDistressDelta = Math.min(30, detectedCount * 8);
  res.json({
    analyzed: true,
    flaggedKeywords: keywords.filter(k => lower.includes(k)),
    riskScoreDelta: calculatedDistressDelta,
    recommendedAction: detectedCount > 2 ? 'Trigger Counsellor Emergency Outreach' : 'Continue Monitoring',
  });
});

async function startServer() {
  // Mount Vite middlewares in development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SPC Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
