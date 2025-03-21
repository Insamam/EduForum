import axios from "axios";

const recommendBestAnswer = async (question, answers) => {
  try {
    console.log("Evaluating answers for:", question);

    if (!question || !answers || answers.length === 0) {
      console.error("Invalid input: question or answers missing.");
      return null;
    }

    // Access environment variables from import.meta.env, with a fallback
    const aixplainApiKey = import.meta.env.VITE_AIXPLAIN_API_KEY || "d65af53bd97141e65b94651689e399b21f3fbb584bf323a4225181f228d421b5";
    const aixplainModelId = import.meta.env.VITE_AIXPLAIN_MODEL_ID || "6646261c6eb563165658bbb1";

    if (!aixplainApiKey) {
      console.error("AIXplain API key is missing. Using fallback value.");
    }

    // AIXplain API request payload
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

    // API Request
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

    console.log("API Response:", response.data);

    // Validate API response
    if (
      !response.data ||
      !response.data.choices ||
      response.data.choices.length === 0 ||
      !response.data.choices[0].message.content
    ) {
      console.error("Invalid API response format:", response.data);
      return null;
    }

    // Parse recommended answer index
    const recommendedAnswerIndex = parseInt(response.data.choices[0].message.content.trim()) - 1;

    if (isNaN(recommendedAnswerIndex) || recommendedAnswerIndex < 0 || recommendedAnswerIndex >= answers.length) {
      console.error("Invalid recommended answer index:", recommendedAnswerIndex);
      return null;
    }

    console.log("Recommended Answer ID:", answers[recommendedAnswerIndex].id);
    return answers[recommendedAnswerIndex].id; // Return ID instead of full object

  } catch (error) {
    console.error("Recommendation API Error:", error.response ? error.response.data : error.message);
    return null; // No recommendation on failure
  }
};

export default recommendBestAnswer;