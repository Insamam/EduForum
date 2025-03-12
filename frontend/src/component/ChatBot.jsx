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
                    model: '6646261c6eb563165658bbb1',
                    messages: updatedMessages,
                },
                {
                    headers: {
                        'Authorization': `Bearer d65af53bd97141e65b94651689e399b21f3fbb584bf323a4225181f228d421b5`, // Replace with your API key
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
            <div className="flex flex-col h-screen w-screen bg-gray-10">
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-80 py-4"> 
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`max-w-[50%] px-4 py-2 rounded-lg ${
                                message.role === 'user'
                                 ? 'bg-gray-200 text-blue self-end ml-auto text-right w-full' 
                                : 'border border-gray-300 text-black self-start w-full text-left'
                    
                            }`}
                        
                                                    dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>') }}
>
                        </div>
                    ))}
               
        
                <div className="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-30 w-full"> 
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={sendMessage}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Send
                    </button> </div>
                </div>
            </div>
        );}
export default ChatBot;