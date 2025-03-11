// frontend/src/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function ChatBot() {
    const [messages, setMessages] = useState([
        { role: 'system', content: 'You are a funny LLM' },
        { role: 'user', content: 'Hello! My name is Hadi.' },
        { role: 'assistant', content: 'Hello' },
        { role: 'user', content: 'What is my name?' }
    ]);
    const [input, setInput] = useState('');
    const chatContainerRef = useRef(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const updatedMessages = [...messages, { role: 'user', content: input }];
        setMessages(updatedMessages);
        setInput('');

        try {
            const response = await axios.post(
                'https://models.aixplain.com/api/v1/chat/completions',
                {
                    model: '669a63646eb56306647e1091',
                    messages: updatedMessages,
                },
                {
                    headers: {
                        'Authorization': `Bearer bf22ea220a4a0fecf75c0c91c05c83d79435831001a32650a5078decb6561e8d`, // Replace with your API key
                        'Content-Type': 'application/json',
                    },
                }
            );

            const botResponse = response.data.choices[0].message;
            setMessages([...updatedMessages, botResponse]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages([
                ...updatedMessages,
                { role: 'assistant', content: 'Sorry, an error occurred.' },
            ]);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-[80vh] max-w-md mx-auto my-5 border rounded-lg shadow-md overflow-hidden bg-gray-50">
        <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto flex flex-col">
            {messages.slice(1).map((message, index) => (
                <div
                    key={index}
                    className={`p-3 mb-2 rounded-2xl max-w-[80%] break-words ${message.role === 'user' ? 'bg-green-200 self-end' : 'bg-teal-100 self-start'}`}
                >
                    {message.content}
                </div>
            ))}
        </div>
        <div className="flex p-3 border-t">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-grow p-2 border rounded-2xl mr-2 outline-none"
            />
            <button onClick={sendMessage} className="bg-green-500 text-white p-2 rounded-2xl hover:bg-green-600 transition-colors">
                Send
            </button>
        </div>
    </div>
    );
}

export default ChatBot;