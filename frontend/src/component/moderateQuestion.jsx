import axios from "axios";
const moderateQuestion = async (question) => {
    try {
        console.log("Moderating question:", question);

        const response = await axios.post(
            "https://models.aixplain.com/api/v1/chat/completions",
            {
                model: "6646261c6eb563165658bbb1",
                messages: [
                    { 
                        role: "system", 
                        content: `Analyze the question and classify it into one of these:
                        1. 'valid' - A properly structured academic question, even if it's simple.
                        2. 'valid-simple' - A short or easy academic question, but still valid.
                        3. 'unclear' - The question lacks clarity or makes no sense.
                        4. 'off-topic' - Not related to academic topics.
                        5. 'spam' - Contains inappropriate content or nonsense.
                        
                        Only reject the question if it is unclear, off-topic, or spam. Simple questions should be allowed!`
                    },
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

        console.log("API Response:", response.data);

        if (!response.data || !response.data.choices || response.data.choices.length === 0) {
            console.error("Invalid API response format:", response.data);
            return { status: "error", message: "Invalid API response" };
        }

        const result = response.data.choices[0].message.content.trim().toLowerCase();
        console.log("Moderation result:", result);

        return { status: result };
    } catch (error) {
        console.error("Moderation API Error:", error.response ? error.response.data : error.message);
        return { status: "error", message: "Moderation service failed" };
    }
};

export default moderateQuestion;
