import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 API KEY STORED HERE (NOT IN FLUTTER)
const OPENAI_KEY = process.env.OPENAI_KEY;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || userMessage.trim() === "") {
      return res.json({ reply: "Information not found." });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are Memoria Assistant.

Rules:
1. Answer questions related to dementia, Alzheimer's, memory loss, caregiving.
2. You may answer general questions about medicines, food, and health.
   - Do NOT give dosages or prescriptions.
3. If the question is unrelated, reply only:
   "Information not found."
4. Use simple, kind, reassuring language.
`
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 250,
          temperature: 0.4
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Information not found.";

    res.json({ reply });
  } catch (e) {
    res.json({ reply: "Information not found." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Memoria backend running");
});