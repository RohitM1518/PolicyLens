import { UserCircleIcon } from '@heroicons/react/24/solid';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Markdown from 'react-markdown'
import { useSelector } from 'react-redux';

export default function ChatMessage({ message, isUser }) {
  const user = useSelector(state => state?.currentUser?.user)
  console.log(user)
  return (
    <div className={`flex gap-4 p-4 ${isUser ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="flex-shrink-0">
        {isUser ? (
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-semibold">AI</span>
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="font-medium text-gray-900 mb-1">
          {isUser ? user?.name : 'PolicyLens AI'}
        </div>
        
        <div className="text-gray-700 prose max-w-none">
          <Markdown>
          {message.message}
          </Markdown>
        </div>
        
        {message.files && message.files.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 p-2 rounded"
              >
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}