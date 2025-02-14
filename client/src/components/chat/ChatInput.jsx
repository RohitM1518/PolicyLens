import { useState, useRef } from 'react';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';

export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || file) {
      onSendMessage({ message: message, file });
      setMessage('');
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white">
      {file && (
        <div className="mb-2 flex items-center gap-2">
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center gap-1">
            <PaperClipIcon className="h-4 w-4" />
            {file.name}
            <button
              type="button"
              onClick={() => setFile(null)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {/* <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 text-gray-500 hover:text-gray-700"
        >
          <PaperClipIcon className="h-6 w-6" />
        </button> */}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-0 outline-none p-3"
        />

        <button
          type="submit"
          disabled={!message.trim() && !file}
          className="flex-shrink-0 bg-primary text-white p-2 rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
