import { useState, useEffect } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

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
  const [previousTranslations, setPreviousTranslations] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [loadingTranslations, setLoadingTranslations] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const accessToken = useSelector((state) => state?.currentUser?.accessToken);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await axios.get(`${backendURL}/regional/language/get/all`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        setPreviousTranslations(response.data.data.data);
      } catch (error) {
        console.error('Error fetching translations:', error);
      } finally {
        setLoadingTranslations(false);
      }
    };
    fetchTranslations();
  }, []);

  const handleTranslate = async () => {
    if (!inputText || !selectedLanguage) return;
    setLoading(true);
    try {
      const response = await axios.post(`${backendURL}/regional/language/convert`, {
        originalText: inputText,
        language: selectedLanguage
      }, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      setTranslatedText(response.data.data.data.translatedText);
      setPreviousTranslations(prev => [response.data.data.data, ...prev]);
      setSelectedTranslation(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${backendURL}/regional/language/delete/${id}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      setPreviousTranslations(prev => prev.filter(translation => translation._id !== id));
      if (selectedTranslation?._id === id) {
        setSelectedTranslation(null);
        setInputText('');
        setTranslatedText('');
        setSelectedLanguage('');
      }
    } catch (error) {
      console.error('Error deleting translation:', error);
    }
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-white rounded-lg shadow p-4 max-h-fit overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Previous Translations</h3>
            {loadingTranslations ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {previousTranslations.map((translation) => (
                  <div key={translation._id} className="relative group">
                    <button
                      onClick={() => {
                        setSelectedTranslation(translation);
                        setInputText(translation.originalText);
                        setSelectedLanguage(translation.language);
                        setTranslatedText(translation.translatedText);
                      }}
                      className={`w-full text-left p-2 rounded ${
                        selectedTranslation?._id === translation._id
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100'
                      } border border-slate-200`}
                    >
                      <p className="font-bold truncate">{translation.title || 'Untitled'}</p>
                      <p className="text-sm opacity-75">{translation.language}</p>
                      <p className="text-xs opacity-75">
                        {format(new Date(translation.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </button>
                    <button
                      onClick={(e) => handleDelete(translation._id, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-full transition-opacity"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ))}
                {previousTranslations.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No previous translations</p>
                )}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Regional Language Translator</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Input section */}
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
                      rows={8}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      placeholder="Enter text to translate..."
                    />
                  </div>

                  <button
                    onClick={handleTranslate}
                    disabled={!inputText || !selectedLanguage || loading}
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Translating...' : 'Translate'}
                  </button>
                </div>

                {/* Output section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Translated Text</h3>
                  <div className="border rounded-lg p-4 min-h-[300px] bg-gray-50">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <div className="prose max-w-none">
                        <Markdown>{translatedText}</Markdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}