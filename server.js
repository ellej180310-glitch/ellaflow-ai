const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const path = require("path");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use("/image", express.static(path.join(__dirname, "image")));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/contact.html", (req, res) => {
  res.sendFile(__dirname + "/contact.html");
});
app.get("/starter.html", (req, res) => {
  res.sendFile(__dirname + "/starter.html");
});

app.get("/professional.html", (req, res) => {
  res.sendFile(__dirname + "/professional.html");
});

app.get("/enterprise.html", (req, res) => {
  res.sendFile(__dirname + "/enterprise.html");
});

app.get("/success.html", (req, res) => {
  res.sendFile(__dirname + "/success.html");
});
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        reply: "Please type a message first.",
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are EllaFlow AI, a professional AI assistant for business automation, websites, customer support, analytics, scheduling, and workflow improvement. Keep responses short, clear, and business-focused.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("FULL AI ERROR:", error);

    res.status(500).json({
      reply: `AI Error: ${error.message}`,
    });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, solution, message } = req.body;

    if (!name || !email || !solution || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill out all required fields.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const allowedEmailPattern =
      /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|mil|info|biz|io|co|us|uk|ca|fr|me|ai|app|tech)$/i;

    if (!allowedEmailPattern.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address such as Gmail, Yahoo, Outlook, school email, business email, or another real email domain.",
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message:
          "Email is not configured. Please check EMAIL_USER and EMAIL_PASS in the .env file.",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"EllaFlow AI Website" <${process.env.EMAIL_USER}>`,
      to: "brondsisjean180310@gmail.com",
      subject: "New EllaFlow AI Consultation Request",
      replyTo: cleanEmail,
      text: `
New request from EllaFlow AI website:

Name: ${name}
Email: ${cleanEmail}
Solution Interested In: ${solution}

Message:
${message}
      `,
    });

    res.json({
      success: true,
      redirect: "/success.html",
    });
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: `Email error: ${error.message}`,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`EllaFlow AI server running at http://localhost:${PORT}`);
});