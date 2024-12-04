import { useState, useEffect } from 'react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import axios from 'axios'
import { useSelector } from 'react-redux';

export default function ChatBot() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const accessToken = useSelector((state) => state?.currentUser?.accessToken);

  useEffect(() => {
    // Fetch chats from API
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${backendURL}/chat/get`,
            {
              withCredentials:true,
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            }
        )
        // Simulated API response
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
    if (activeChat) {
      // Fetch messages for active chat
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`${backendURL}/chat/message/get/${activeChat._id}`,
            {
              withCredentials:true,
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            }
        )
        console.log(res.data.data)
          // Simulated API response
        setMessages(res.data.data)
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [activeChat]);

  const handleNewChat = () => {
    // const newChat = {
    //   id: Date.now(),
    //   title: 'New Conversation',
    //   lastMessage: '',
    //   timestamp: new Date().toISOString(),
    // };
    // setChats([newChat, ...chats]);
    // setActiveChat(newChat);
    // setMessages([]);
    setActiveChat(null); 
  };

  const handleSendMessage = async (message) => {
    if(!message) return;
    const userMessage = {
      id: Date.now(),
      ...message,
      createdAt: new Date().toISOString(),
      role: "user",
    };
    setMessages([...messages, userMessage]);

    if (!activeChat){
      try {
        // console.log(accessToken)
        const res = await axios.post(`${backendURL}/chat/message/create`,{message:userMessage.message},
          {
            withCredentials:true,
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
      )
      // console.log(res.data.data)
      setChats(prev => [res.data.data.chat,...prev])
      setActiveChat(res.data.data.chat)
      setMessages(prev => [...prev, res.data.data.newBotMessage]);
  
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
    

    try {
      console.log(accessToken)
      const res = await axios.post(`${backendURL}/chat/message/create/${activeChat._id}`,{message:userMessage.message},
        {
          withCredentials:true,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
    )
    console.log(res.data.data)
    setMessages(prev => [...prev, res.data.data.newBotMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
        onNewChat={handleNewChat}
      />
      
      <div className="flex-grow flex flex-col">
        {activeChat ? (
          <>
            <div className="flex-grow overflow-y-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isUser={message.role=='user'? true:false}
                />
              ))}
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-grow flex flex-col">
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Start New Chat
          </div>
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        )}
      </div>
    </div>
  );
}