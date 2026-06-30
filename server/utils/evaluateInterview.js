const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const evaluateInterview = async (questions) => {
  try {
    const formattedQA = questions
      .map(
        (q, index) =>
          `Question ${index + 1}: ${q.question}
Answer: ${q.answer || "No answer provided"}`
      )
      .join("\n\n");

    const prompt = `
You are a senior technical interviewer.

Evaluate the following interview answers.

Return ONLY valid JSON.

Required JSON format:

{
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "overallFeedback": ""
}

Evaluation Rules:

1. Score must be between 0 and 100.
2. Give exactly 3 strengths.
3. Give exactly 3 weaknesses.
4. Give exactly 3 suggestions.
5. overallFeedback should be 2-4 sentences.
6. Return ONLY JSON.
7. Do not use markdown.

Interview:

${formattedQA}
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const content =
      completion.choices?.[0]?.message?.content || "";

    const result = JSON.parse(content);

    return result;
  } catch (error) {
    console.error("Evaluation Error:", error);

    return {
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      overallFeedback:
        "Unable to generate feedback at this time.",
    };
  }
};

module.exports = evaluateInterview;