const axios = require("axios");

class AIAppointmentService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
    this.sessions = new Map(); // Store conversation sessions
  }

  // Initialize or get conversation session
  getSession(userId) {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, {
        messages: [],
        appointmentData: {
          name: null,
          age: null,
          gender: null,
          phone: null,
          symptom: null,
          date: null,
        },
        stage: "initial", // initial, collecting_info, confirming, completed
      });
    }
    return this.sessions.get(userId);
  }

  // Clear session after booking
  clearSession(userId) {
    this.sessions.delete(userId);
  }

  // Extract appointment data from user message
  extractAppointmentData(message, currentData) {
    const data = { ...currentData };
    const lowerMessage = message.toLowerCase();

    // Extract name (if starts with "my name is" or "I am")
    const nameMatch = message.match(/(?:my name is|i am|i'm)\s+([a-zA-Z\s]+)/i);
    if (nameMatch) {
      data.name = nameMatch[1].trim();
    }

    // Extract age
    const ageMatch = message.match(/(?:i am|i'm|age is|age:?)\s*(\d{1,3})\s*(?:years?|yrs?|y\.?o\.?)?/i);
    if (ageMatch) {
      data.age = parseInt(ageMatch[1]);
    }

    // Extract gender
    if (lowerMessage.includes("male") && !lowerMessage.includes("female")) {
      data.gender = "Male";
    } else if (lowerMessage.includes("female")) {
      data.gender = "Female";
    } else if (lowerMessage.includes("other") || lowerMessage.includes("non-binary")) {
      data.gender = "Other";
    }

    // Extract phone
    const phoneMatch = message.match(/(?:phone|mobile|contact|number)[:\s]*([0-9]{10})/i);
    if (phoneMatch) {
      data.phone = phoneMatch[1];
    } else {
      const directPhone = message.match(/\b([0-9]{10})\b/);
      if (directPhone) {
        data.phone = directPhone[1];
      }
    }

    // Extract date (various formats)
    const datePatterns = [
      /\b(\d{4}-\d{2}-\d{2})\b/, // YYYY-MM-DD
      /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/, // DD/MM/YYYY or MM/DD/YYYY
    ];

    for (const pattern of datePatterns) {
      const dateMatch = message.match(pattern);
      if (dateMatch) {
        if (pattern.source.includes("\\d{4}-\\d{2}-\\d{2}")) {
          data.date = dateMatch[1];
        } else {
          // Assume DD/MM/YYYY format
          const day = dateMatch[1].padStart(2, "0");
          const month = dateMatch[2].padStart(2, "0");
          const year = dateMatch[3];
          data.date = `${year}-${month}-${day}`;
        }
        break;
      }
    }

    // Extract symptoms/reason for visit
    const symptomKeywords = [
      "fever",
      "cough",
      "cold",
      "headache",
      "pain",
      "checkup",
      "check-up",
      "consultation",
      "stomachache",
      "backache",
      "dizzy",
      "nausea",
      "vomiting",
      "rash",
      "allergy",
      "injury",
      "fracture",
      "diabetes",
      "hypertension",
      "bp",
      "blood pressure",
    ];

    for (const keyword of symptomKeywords) {
      if (lowerMessage.includes(keyword)) {
        if (!data.symptom) {
          data.symptom = keyword;
        } else if (!data.symptom.includes(keyword)) {
          data.symptom += `, ${keyword}`;
        }
      }
    }

    // If user mentions "suffering from" or "problem with"
    const symptomMatch = message.match(/(?:suffering from|problem with|having|experiencing)\s+([a-zA-Z\s]+?)(?:\.|,|and|$)/i);
    if (symptomMatch && !data.symptom) {
      data.symptom = symptomMatch[1].trim();
    }

    return data;
  }

  // Generate AI response based on conversation state
  async generateResponse(userId, userMessage) {
    const session = this.getSession(userId);
    
    // Add user message to conversation
    session.messages.push({ role: "user", content: userMessage });

    // Extract data from user message
    session.appointmentData = this.extractAppointmentData(
      userMessage,
      session.appointmentData
    );

    // Check what information is missing
    const missing = [];
    if (!session.appointmentData.name) missing.push("name");
    if (!session.appointmentData.age) missing.push("age");
    if (!session.appointmentData.gender) missing.push("gender");
    if (!session.appointmentData.phone) missing.push("phone number");
    if (!session.appointmentData.symptom) missing.push("symptoms or reason for visit");
    if (!session.appointmentData.date) missing.push("preferred appointment date");

    let response = "";
    let needsMoreInfo = missing.length > 0;

    if (session.stage === "initial") {
      if (userMessage.toLowerCase().includes("book") || userMessage.toLowerCase().includes("appointment")) {
        response = "I'd be happy to help you book an appointment! I'll need a few details from you. ";
        session.stage = "collecting_info";
      } else {
        response = "Hello! I'm your AI appointment assistant. I can help you book an appointment quickly. ";
      }

      if (needsMoreInfo) {
        response += this.askForMissingInfo(missing, session.appointmentData);
      } else {
        response = this.confirmationMessage(session.appointmentData);
        session.stage = "confirming";
      }
    } else if (session.stage === "collecting_info") {
      if (needsMoreInfo) {
        response = this.askForMissingInfo(missing, session.appointmentData);
      } else {
        response = this.confirmationMessage(session.appointmentData);
        session.stage = "confirming";
      }
    } else if (session.stage === "confirming") {
      if (userMessage.toLowerCase().includes("yes") || userMessage.toLowerCase().includes("correct") || userMessage.toLowerCase().includes("confirm")) {
        response = "Great! Please proceed with the payment of ₹500 to confirm your appointment.";
        session.stage = "completed";
        return {
          response,
          readyToBook: true,
          appointmentData: session.appointmentData,
        };
      } else if (userMessage.toLowerCase().includes("no") || userMessage.toLowerCase().includes("change")) {
        session.stage = "collecting_info";
        response = "No problem! What would you like to change? Please provide the correct information.";
      }
    }

    session.messages.push({ role: "assistant", content: response });

    return {
      response,
      readyToBook: false,
      appointmentData: needsMoreInfo ? null : session.appointmentData,
    };
  }

  askForMissingInfo(missing, currentData) {
    let message = "";
    
    if (missing.length === 6) {
      return "Let me start by getting your details. What is your full name?";
    }

    // Acknowledge what we have
    const collected = [];
    if (currentData.name) collected.push("name");
    if (currentData.age) collected.push("age");
    if (currentData.gender) collected.push("gender");
    if (currentData.phone) collected.push("phone number");
    if (currentData.symptom) collected.push("symptoms");
    if (currentData.date) collected.push("date");

    if (collected.length > 0) {
      message = "Got it! ";
    }

    // Ask for the next missing piece
    if (!currentData.name) {
      message += "What is your full name?";
    } else if (!currentData.age) {
      message += "How old are you?";
    } else if (!currentData.gender) {
      message += "What is your gender? (Male/Female/Other)";
    } else if (!currentData.phone) {
      message += "What is your phone number?";
    } else if (!currentData.symptom) {
      message += "What symptoms are you experiencing or what is the reason for your visit?";
    } else if (!currentData.date) {
      message += "When would you like to schedule your appointment? (Please provide date in YYYY-MM-DD format)";
    }

    return message;
  }

  confirmationMessage(data) {
    return `Perfect! Let me confirm your appointment details:

 **Name:** ${data.name}
 **Age:** ${data.age}
 **Gender:** ${data.gender}
 **Phone:** ${data.phone}
 **Symptoms:** ${data.symptom}
 **Preferred Date:** ${data.date}

Is this information correct? (Reply with 'yes' to proceed with payment or 'no' to make changes)`;
  }

  // Alternative: Use OpenAI API for more natural conversation
  async generateAIResponse(userId, userMessage) {
    if (!this.apiKey) {
      // Fallback to rule-based system
      return this.generateResponse(userId, userMessage);
    }

    try {
      const session = this.getSession(userId);
      session.messages.push({ role: "user", content: userMessage });

      const systemPrompt = `You are a helpful AI assistant for a hospital appointment booking system. 
Your job is to collect the following information from users in a friendly, conversational manner:
- Full name
- Age
- Gender (Male/Female/Other)
- Phone number (10 digits)
- Symptoms or reason for visit
- Preferred appointment date (YYYY-MM-DD format)

Extract information naturally from the conversation. When you have all the details, confirm them with the user.
Keep responses brief and friendly. Guide users step by step.

Current appointment data: ${JSON.stringify(session.appointmentData)}`;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            ...session.messages,
          ],
          temperature: 0.7,
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      session.messages.push({ role: "assistant", content: aiResponse });

      // Extract data from conversation
      session.appointmentData = this.extractAppointmentData(
        userMessage,
        session.appointmentData
      );

      // Check if all data is collected
      const allDataCollected = Object.values(session.appointmentData).every(
        (val) => val !== null
      );

      return {
        response: aiResponse,
        readyToBook: allDataCollected,
        appointmentData: allDataCollected ? session.appointmentData : null,
      };
    } catch (error) {
      console.error("OpenAI API error:", error.message);
      // Fallback to rule-based system
      return this.generateResponse(userId, userMessage);
    }
  }
}

module.exports = new AIAppointmentService();
