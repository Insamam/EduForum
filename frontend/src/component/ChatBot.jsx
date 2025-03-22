import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Clipboard} from 'lucide-react';

const API_KEY = import.meta.env.VITE_API_KEY;

function ChatBot() {
    const [messages, setMessages] = useState([
        { role: 'system', content: 'Hello!!!!' },
        { role: 'assistant', content: 'What can i help with???' },
        
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
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const botResponse = response.data.choices[0].message;
            setMessages([...updatedMessages, botResponse]);
        } catch (error) {
            
            setMessages([
                ...updatedMessages,
                { role: 'assistant', content: 'Sorry, an error occurred.' },
            ]);
        }
    };
    const [copiedMessage, setCopiedMessage] = useState(null);

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedMessage(index);
            setTimeout(() => setCopiedMessage(null), 2000);
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    };
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    return (
        <div className="flex flex-col h-screen w-full bg-gray-50">
        {/* Chat Messages Container */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 md:px-16 lg:px-32 xl:px-64 py-4 space-y-4 bg-gradient-to-br from-blue-50 to-gray-100 pb-24">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`relative max-w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] px-5 py-3 rounded-2xl shadow-md text-sm break-words animate-fadeIn
                        ${message.role === 'user' 
                            ? 'bg-blue-600 text-white self-end ml-auto text-right'
                            : 'bg-blue-100 text-gray-800 self-start'}
                    `}
                >
                    <span dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>') }} />
                    {(message.role === 'bot' || message.role === 'assistant') && (

                        <button 
                            onClick={() => copyToClipboard(message.content,index)} 
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xs flex items-center"
                        >
                            <Clipboard size={16} />
                        </button>
                    )}
                     {copiedMessage === index && (
                            <span className="absolute top-2 right-10 text-xs text-green-500">Copied!</span>
                        )}
                </div>
            ))}
        </div>
            {/* Input Section */}
            <div className="fixed bottom-0 left-0 right-0 flex items-center gap-2 px-4 md:px-16 lg:px-32 xl:px-64 py-4 bg-white shadow-md border-t">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={sendMessage}
                    className="px-5 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <span className="text-sm font-semibold">Send</span>
                </button>
            </div>
        </div>
    );
};

export default ChatBot;