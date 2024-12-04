import { PlusIcon } from '@heroicons/react/24/outline';

export default function ChatSidebar({ chats, activeChat, onChatSelect, onNewChat }) {
  return (
    <div className="w-64 bg-gray-50 h-full border-r border-gray-200">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          New Chat
        </button>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-5rem)]">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className={`w-full text-left p-4 hover:bg-gray-100 transition-colors ${
              activeChat?.id === chat.id ? 'bg-gray-100' : ''
            }`}
          >
            <h3 className="font-medium text-gray-900 truncate">{chat.title}</h3>
            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
            <span className="text-xs text-gray-400">
              {new Date(chat.createdAt).toLocaleDateString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}