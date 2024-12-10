import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { fadeIn, slideIn } from '../styles/animations';

const suggestions = [
  "What insurance policies do you recommend for a small family?",
  "Explain health insurance coverage options",
  "How do I file an insurance claim?",
  "What factors affect my insurance premium?",
  "Compare term life vs whole life insurance",
  "Compare term life vs whole life insurance"
];

export default function ChatBot() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const accessToken = useSelector((state) => state?.currentUser?.accessToken);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatContainer = chatContainerRef.current;
      const messageElement = messagesEndRef.current;
      const containerHeight = chatContainer.clientHeight;
      const scrollTop = messageElement.offsetTop - containerHeight + messageElement.clientHeight;
      chatContainer.scrollTop = scrollTop;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${backendURL}/chat/get`,
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        setChats(res.data.data.chats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChat?._id) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`${backendURL}/chat/message/get/${activeChat._id}`,
            {
              withCredentials: true,
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            }
          );
          setMessages(res.data.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
      setSidebarOpen(false);
    }
  }, [activeChat]);

  const handleNewChat = () => {
    setActiveChat(null);
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleSuggestion = (message) => {
    handleNewChat();
    handleSendMessage(message);
  };

  const handleSendMessage = async (message) => {
    if (!message.message.trim()) return;
    const userMessage = {
      id: Date.now(),
      ...message,
      createdAt: new Date().toISOString(),
      role: "user",
    };
    setMessages(prev => [...prev, userMessage]);
    setMessageLoading(true);

    try {
      if (!activeChat) {
        const res = await axios.post(`${backendURL}/chat/message/create`,
          { message: userMessage.message },
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        setChats(prev => [res.data.data.chat, ...prev]);
        setActiveChat(res.data.data.chat);
        setMessages(prev => [...prev, res.data.data.newBotMessage]);
      } else {
        const res = await axios.post(`${backendURL}/chat/message/create/${activeChat._id}`,
          { message: userMessage.message },
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        setMessages(prev => [...prev, res.data.data.newBotMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setMessageLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div 
      {...fadeIn}
      className="flex h-[calc(100vh-64px)] overflow-hidden relative"
    >
      {/* Mobile sidebar toggle */}
      <motion.button
        {...slideIn}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed bottom-20 left-0 z-50 p-2 bg-white rounded-md shadow-lg"
      >
        {sidebarOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        )}
      </motion.button>

      {/* Sidebar */}
      <div className={`
        absolute md:relative w-64 h-full z-40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onChatSelect={setActiveChat}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-grow flex flex-col relative">
        <div 
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto px-4 pb-20 mb-10"
        >
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
            />
          ))}
          {
            !activeChat && messages.length === 0 && (
              <EmptyState
                icon={ChatBubbleBottomCenterTextIcon}
                title="Start a New Chat"
                description="Choose a suggestion or type your own message to begin"
                action={
                  <div className="max-w-3xl mx-auto mt-8">
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSuggestion({message: suggestion})}
                          className="text-left border border-gray-200 text-sm text-gray-600 p-4 rounded-lg 
                                     shadow-sm hover:shadow-md hover:border-primary/20
                                     bg-white transition-all duration-200
                                     min-h-[80px] flex items-center"
                        >
                          <span className="line-clamp-3">{suggestion}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                }
              />
            )
            
          }
          {messageLoading && <ChatMessage isLoading={true} />}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}