import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useResponseContext } from '../../contexts/ResponseContext';
import { useErrorContext } from '../../contexts/ErrorContext';

export default function ChatSidebar({ chats, activeChat, onChatSelect, onNewChat }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const accessToken = useSelector((state) => state?.currentUser?.accessToken);
  const navigate = useNavigate();
  const {setResponse}=useResponseContext()
  const {setError}=useErrorContext()

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      const res = await axios.delete(`${backendURL}/chat/delete/${chatId}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      // Update local state after successful deletion
      onChatSelect(null);
      navigate(0)
      console.log(res)
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-50 h-full border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          New Chat
        </button>
      </div>
      
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`relative group cursor-pointer hover:bg-gray-100 transition-colors ${
              activeChat?._id === chat._id ? 'bg-gray-100' : ''
            }`}
          >
            <button
              onClick={() => onChatSelect(chat)}
              className="w-full text-left p-4"
            >
              <h3 className="font-medium text-gray-900 truncate">{chat.title || 'New Chat'}</h3>
              <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              <span className="text-xs text-gray-400">
                {new Date(chat.createdAt).toLocaleDateString()}
              </span>
            </button>
            <button
              onClick={(e) => handleDeleteChat(chat._id, e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 max-lg:opacity-100 group-hover:opacity-100 p-2 hover:bg-red-200 rounded-full transition-opacity"
            >
              <TrashIcon className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      
    </div>
  );
}