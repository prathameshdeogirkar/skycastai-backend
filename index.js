import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());



app.post("/chat", async (req, res) => {
    // const userinpt = await req.body?.prompt;

    const prompt = req.body?.prompt;

    const openai = new OpenAI({
        apiKey: process.env.API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
    });

    if (!prompt) {
        return res.status(400).json({ error: "Missing prompt in request body." });
    }

    try {
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: "You are a helpful planner assistant." },
        { role: "user", content: prompt },
      ],
    });

    const aiText = response.choices[0].message.content;
    return res.json({ plan: aiText }, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });


    
    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
});

app.listen(PORT, () => {
    console.log(`🟢 Server running on http://localhost:${PORT}`);
});
