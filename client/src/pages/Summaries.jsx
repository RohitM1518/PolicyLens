import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import Markdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import PageHeader from '../components/shared/PageHeader';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ContentCopy, Download, Translate } from '@mui/icons-material';
import { generatePDF } from '../utils/pdfGenerator';
import { fadeIn, scaleIn, slideIn } from '../styles/animations';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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

export default function Summaries() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);
  const [previousSummaries, setPreviousSummaries] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [translatedSummary, setTranslatedSummary] = useState('');
  const [translating, setTranslating] = useState(false);
  const [loadingSummaries, setLoadingSummaries] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const accessToken = useSelector((state) => state?.currentUser?.accessToken);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPDFWidth = useCallback(() => {
    if (windowWidth >= 1024) return 800;
    if (windowWidth >= 768) return 600;
    return windowWidth - 64;
  }, [windowWidth]);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const response = await axios.get(`${backendURL}/summary/get/all`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setPreviousSummaries(response.data.data.summaries);
      } catch (error) {
        console.error('Error fetching summaries:', error);
      } finally {
        setLoadingSummaries(false);
      }
    };
    fetchSummaries();
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error) {
    setError('Error loading PDF: ' + error.message);
  }

  const nextPage = () => setPageNumber(pageNumber + 1);
  const previousPage = () => setPageNumber(pageNumber - 1);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setSelectedLanguage('');
    setTranslatedSummary('');

    if (selectedFile) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('PolicyPdf', selectedFile);
        const res = await axios.post(`${backendURL}/summary/create`, formData, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setSummary(res.data.data.summary);
        setPreviousSummaries(prev => [res.data.data.summary, ...prev]);
      } catch (error) {
        console.error('Error:', error);
        setError('Error generating summary');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${backendURL}/summary/delete/${id}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setPreviousSummaries(prev => prev.filter(summary => summary._id !== id));
      if (summary?._id === id) {
        setSummary(null);
        setFile(null);
        setTranslatedSummary('');
        setSelectedLanguage('');
      }
    } catch (error) {
      console.error('Error deleting summary:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary.summarizedText);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    if (!summary?.summarizedText) return;
    const doc = generatePDF(
      summary.summarizedText,
      summary.title || 'Policy Summary'
    );
    doc.save(`${summary.title || 'policy-summary'}.pdf`);
  };

  const handleClick = (item) => {
    setFile(item.PolicyPdf);
    setSummary(item);
    if (!item.translatedText) {
      setTranslatedSummary('');
      setSelectedLanguage('');
    } else {
      setTranslatedSummary(item?.translatedText.translatedText);
      setSelectedLanguage(item?.translatedText.language);
    }
  };

  const handleTranslate = async () => {
    if (!selectedLanguage) return;
    setTranslating(true);
    try {
      const response = await axios.post(`${backendURL}/summary/translate/${summary?._id}`, {
        language: selectedLanguage
      }, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setTranslatedSummary(response.data.data.summary.translatedText.translatedText);
    } catch (error) {
      console.error('Error translating:', error);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <motion.div {...fadeIn} className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="md:col-span-1">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Previous Summaries</h3>
              {loadingSummaries ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              ) : previousSummaries.length > 0 ? (
                <div className="space-y-2">
                  {previousSummaries.map((item) => (
                    <motion.div
                    key={item._id}
                    {...slideIn}
                    className="relative group"
                  >
                    <Button
                      onClick={() => handleClick(item)}
                      variant={summary?._id === item._id ? 'primary' : 'secondary'}
                      className="w-full text-left"
                    >
                      <div className="flex flex-col">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm opacity-75">
                          {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </Button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => handleDelete(item._id, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-full transition-opacity"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </motion.button>
                  </motion.div>
                  
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={DocumentTextIcon}
                  title="No summaries"
                  description="Your summaries will appear here"
                />
              )}
            </div>
          </Card>

          {/* Main content */}
          <Card className="md:col-span-3">
            <div className="p-6">
              <PageHeader
                title="Policy Summary Generator"
                subtitle="Generate and translate policy summaries"
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF Document
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-secondary"
                />
              </div>

              {loading && (
                <div className="flex items-center justify-center py-4">
                  <LoadingSpinner />
                </div>
              )}

              {file && !loading && (
                <motion.div {...scaleIn} className="space-y-6">
                  <Card>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-3">Original Document</h3>
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-[800px] mx-auto">
                          <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                          >
                            <Page
                              pageNumber={pageNumber}
                              width={getPDFWidth()}
                              renderTextLayer={false}
                              className="mx-auto"
                              scale={windowWidth < 768 ? 0.8 : 1}
                            />
                          </Document>
                          {error && <p className="text-red-500 mb-2">{error}</p>}
                          <div className="flex items-center justify-between w-full mt-4">
                            <Button
                              onClick={previousPage}
                              disabled={pageNumber <= 1}
                              variant="secondary"
                            >
                              Previous
                            </Button>
                            <p className="text-sm text-gray-600">
                              Page {pageNumber} of {numPages}
                            </p>
                            <Button
                              onClick={nextPage}
                              disabled={pageNumber >= numPages}
                              variant="secondary"
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Summary</h3>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleCopy}
                            variant="secondary"
                            icon={ContentCopy}
                          >
                            Copy
                          </Button>
                          <Button
                            onClick={handleDownload}
                            variant="secondary"
                            icon={Download}
                          >
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="prose max-w-none mb-4">
                        <Markdown>{summary.summarizedText}</Markdown>
                      </div>

                      <div className="flex gap-4 items-center mt-4">
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        >
                          <option value="">Select language</option>
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.name}
                            </option>
                          ))}
                        </select>
                        <Button
                          onClick={handleTranslate}
                          disabled={!selectedLanguage || translating}
                          variant="primary"
                          icon={Translate}
                        >
                          Translate
                        </Button>
                      </div>

                      {translating && (
                        <div className="mt-4 flex justify-center">
                          <LoadingSpinner />
                        </div>
                      )}

                      {translatedSummary && (
                        <motion.div {...fadeIn} className="mt-4 border-t pt-4">
                          <h4 className="font-semibold mb-2">Translated Summary</h4>
                          <Markdown>{translatedSummary}</Markdown>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}