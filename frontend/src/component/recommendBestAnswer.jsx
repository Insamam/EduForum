import axios from "axios";

const recommendBestAnswer = async (question, answers) => {
  try {

    if (!question || !answers || answers.length === 0) {
      console.error("Invalid input: question or answers missing.");
      return null;
    }

    const aixplainApiKey = import.meta.env.VITE_API_KEY;
    const aixplainModelId = import.meta.env.VITE_AIXPLAIN_MODEL_ID || "6646261c6eb563165658bbb1";

    if (!aixplainApiKey) {
      console.error("AIXplain API key is missing. Using fallback value.");
    }

    const payload = {
      model: aixplainModelId,
      messages: [
        {
          role: "system",
          content:
            "Evaluate the given answers for the question. Consider clarity, completeness, upvotes, and teacher verification. Reply with the answer number that is the best.",
        },
        {
          role: "user",
          content: `Question: ${question}\n\nAnswers:\n${answers
            .map(
              (a, i) =>
                `${i + 1}. ${a.answer_text} (Likes: ${a.like_count}, Verified: ${
                  a.is_verified ? "Yes" : "No"
                })`
            )
            .join("\n")}\n\nWhich answer is the best? Reply with the number only.`,
        },
      ],
    };

    const response = await axios.post(
      "https://models.aixplain.com/api/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${aixplainApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      !response.data ||
      !response.data.choices ||
      response.data.choices.length === 0 ||
      !response.data.choices[0].message.content
    ) {
      return null;
    }

    const recommendedAnswerIndex = parseInt(response.data.choices[0].message.content.trim()) - 1;

    if (isNaN(recommendedAnswerIndex) || recommendedAnswerIndex < 0 || recommendedAnswerIndex >= answers.length) {
      console.error("Invalid recommended answer index:", recommendedAnswerIndex);
      return null;
    }

    return answers[recommendedAnswerIndex].id; 

  } catch (error) {
    return null; 
  }
};

export default recommendBestAnswer;