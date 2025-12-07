import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // only needed if using old Node <18

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMsg = req.body.message;

  try {
    const apiKey = process.env.OPENAI_API_KEY;   // ← Your API Key here

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`      // ← Use API Key securely
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: userMsg }
        ]
      })
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || "No reply";

    res.json({ reply: botReply });

  } catch (error) {
    res.json({ reply: "Error: " + error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Chatbot backend running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

