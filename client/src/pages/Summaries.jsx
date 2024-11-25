import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import Markdown from 'react-markdown'
// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'node_modules/pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

export default function Summaries() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error) {
    setError('Error loading PDF: ' + error.message);
  }

  const nextPage = () => {
    setPageNumber(pageNumber + 1);
  }
  
  const previousPage = () => {
    setPageNumber(pageNumber - 1);
  }

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setLoading(true);
      // Simulated API call - replace with actual backend call
      try {
        const formData = new FormData();
        formData.append('data', selectedFile);
        const res = await axios.post(`${backendURL}/gemini/summary`,formData)
        console.log(res.data.data.data)
        // const response = await fetch('/api/summarize', {
        //   method: 'POST',
        //   body: formData
        // });
        // const data = await response.json();
        setSummary(res.data.data.data);

        // Simulated response
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    }
  };


  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">PDF Summary Generator</h2>

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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {file && !loading && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Original Document</h3>
                  <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    className="w-full"
                  >
                  <Page pageNumber={pageNumber} width={500} renderTextLayer={false}/>
                  </Document>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="flex justify-between mt-4">
                  <button
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                    className="bg-primary text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <button
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                    className="bg-primary text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Summary</h3>
                  <div className="prose max-w-none">
                    <Markdown>
                    {summary}
                    </Markdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}