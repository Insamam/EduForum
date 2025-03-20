import axios from "axios";

const moderateQuestion = async (question) => {
    try {
        console.log("Moderating question:", question); // Debug input

        const response = await axios.post(
            "https://models.aixplain.com/api/v1/chat/completions",
            {
                model: "6646261c6eb563165658bbb1",
                messages: [
                    { role: "system", content: "Analyze this question. Reply 'valid' if it's a properly structured academic question. Otherwise, reply 'invalid'." },
                    { role: "user", content: question }
                ],
            },
            {
                headers: {
                    "Authorization": `Bearer d65af53bd97141e65b94651689e399b21f3fbb584bf323a4225181f228d421b5`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("API Response:", response.data); // Log entire response for debugging

        if (!response.data || !response.data.choices || response.data.choices.length === 0) {
            console.error("Invalid API response format:", response.data);
            return false; // Block question if API response is invalid
        }

        const result = response.data.choices[0].message.content.trim().toLowerCase();
        console.log("Moderation result:", result); // Debug API output

        return result === "valid";
    } catch (error) {
        console.error("Moderation API Error:", error.response ? error.response.data : error.message);
        return false; // Block question if API request fails
    }
};

export default moderateQuestion;
