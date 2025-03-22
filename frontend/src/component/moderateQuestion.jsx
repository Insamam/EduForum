import axios from "axios";


const API_KEY = import.meta.env.VITE_API_KEY;
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
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.data || !response.data.choices || response.data.choices.length === 0) {
            
            return { status: "error", message: "Invalid API response" };
        }

        const result = response.data.choices[0].message.content.trim().toLowerCase();
     
        return { status: result };
    } catch (error) {
        return { status: "error", message: "Moderation service failed" };
    }
};

export default moderateQuestion;
