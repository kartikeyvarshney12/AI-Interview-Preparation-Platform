require("dotenv").config();

const client = require("./config/openai");

async function test() {
  try {
    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Say connection successful",
        },
      ],
    });

    console.log(
      completion.choices[0].message.content
    );
  } catch (error) {
    console.error(error);
  }
}

test();