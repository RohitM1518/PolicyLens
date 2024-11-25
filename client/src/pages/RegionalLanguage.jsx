import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Markdown from 'react-markdown'


const languages = [
  { code: 'Hindi', name: 'Hindi' },
  { code: 'Bengali', name: 'Bengali' },
  { code: 'Telugu', name: 'Telugu' },
  { code: 'Tamil', name: 'Tamil' },
  { code: 'Marathi', name: 'Marathi' },
  { code: 'Gujarati', name: 'Gujarati' },
  { code: 'Kannada', name: 'Kannada' },
  { code: 'Malayalam', name: 'Malayalam' },
  { code: 'Punjabi', name: 'Punjabi' },
  { code: 'Urdu', name: 'Urdu' },
];

export default function RegionalLanguage() {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  // const accessToken = useSelector(state => state?.currentUser)
  const handleTranslate = async () => {
    if (!inputText || !selectedLanguage) return;
    console.log(inputText + " " + selectedLanguage)
    setLoading(true);
    // Simulated API call - replace with actual backend call
    try {
      const res = await axios.post(`${backendURL}/gemini/regional/language`, { prompt: inputText, language: selectedLanguage })
      console.log(res.data.data.data)
      setTranslatedText(res.data.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Regional Language Translator</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Target Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="">Select language</option>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Text
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder="Enter text to translate..."
                  />
                </div>

                <button
                  onClick={handleTranslate}
                  disabled={!inputText || !selectedLanguage || loading}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Translating...' : 'Translate'}
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Translated Text</h3>
                <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">
                      <Markdown>
                        {translatedText}
                      </Markdown>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}