require("dotenv").config();

const model = require("./config/gemini");

async function testGemini() {
  try {
    const result = await model.generateContent(
      "Say Gemini connection successful"
    );

    console.log(result.response.text());
  } catch (error) {
    console.error(error);
  }
}

testGemini();