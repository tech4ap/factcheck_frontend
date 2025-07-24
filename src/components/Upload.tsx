import React, { useState, useRef, useEffect } from 'react';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [waMessageId, setWaMessageId] = useState('');
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [isForwarded, setIsForwarded] = useState('false');
  const [content, setContent] = useState('This is test message');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('Starting upload...');
  const [responseData, setResponseData] = useState<any>(null);
  const [responseType, setResponseType] = useState<'success' | 'error' | 'warning'>('success');
  const [showRefreshLoading, setShowRefreshLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const getRandomString = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getRandomName = () => {
    const names = ['Ajay', 'Andy', 'Colton', 'Jacinda', 'Daniel', 'Deepak', 'Sneha', 'Vikas', 'Neha', 'Rahul'];
    return names[Math.floor(Math.random() * names.length)] + '-Test' + Math.floor(Math.random() * 100);
  };

  const autofillRandom = () => {
    setWaMessageId(getRandomString(12));
    setSender(getRandomName());
    setReceiver(getRandomName());
    setContent('This is a test message ' + getRandomString(5));
    setTimestamp(Date.now().toString());
  };

  const getContentType = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType === 'application/json') return 'Location';
    return 'Document';
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  // Initialize form with random data
  useEffect(() => {
    autofillRandom();
  }, []);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDropAreaClick = () => {
    fileInputRef.current?.click();
  };

  const resetForm = () => {
    setFile(null);
    setResponseData(null);
    autofillRandom();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const refreshStatus = async (msgId: string) => {
    setShowRefreshLoading(true);
    try {
      const response = await fetch(`https://api.factchecks.io/api/messages/${msgId}`);
      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error('Error refreshing status:', error);
    } finally {
      setShowRefreshLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('wa_message_id', waMessageId);
    formData.append('sender', sender);
    formData.append('receiver', receiver);
    formData.append('timestamp', timestamp);
    formData.append('is_forwarded', isForwarded);
    formData.append('content', content);

    setShowModal(true);
    setUploadProgress(0);
    setUploadStatus('Starting upload...');

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          setUploadProgress(percent);
          setUploadStatus(`Uploading... ${percent.toFixed(2)}%`);
        }
      };

      xhr.onload = () => {
        setShowModal(false);
        try {
          const response = JSON.parse(xhr.responseText);
          setResponseData(response.data);
          setResponseType('success');

          // Auto-refresh after 2 seconds
          setTimeout(() => {
            refreshStatus(response.data.id);
          }, 2000);
        } catch (e) {
          setResponseData({ rawResponse: xhr.responseText });
          setResponseType('warning');
        }
      };

      xhr.onerror = () => {
        setShowModal(false);
        setResponseData({ error: 'Failed to connect to the server.' });
        setResponseType('error');
      };

      xhr.open('POST', 'https://api.factchecks.io/api/messages', true);
      xhr.send(formData);
    } catch (error) {
      setShowModal(false);
      setResponseData({ error: 'Upload failed' });
      setResponseType('error');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-2 sm:p-4">
      {/* Loading overlay for refresh */}
      {showRefreshLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white px-4 py-4 sm:px-8 sm:py-6 rounded-xl shadow-lg text-base sm:text-lg font-semibold flex items-center gap-2">
            <span className="animate-spin inline-block mr-2">🔄</span> Fetching latest details...
          </div>
        </div>
      )}
      {/* Upload Card */}
      <div className="w-[95%] max-w-3xl bg-white/90 rounded-2xl shadow-2xl p-2 sm:p-8 md:p-10 flex flex-col items-center overflow-y-auto max-h-screen">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-indigo-700 mb-2 text-center">DeepFake Detection</h2>
        <p className="text-gray-600 mb-4 sm:mb-6 text-center text-xs sm:text-base">Upload with Drag & Drop</p>
        <form className="w-full space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          {/* File Upload */}
          <div
            ref={dropAreaRef}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 sm:p-8 transition-colors cursor-pointer ${isDragOver ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleDropAreaClick}
          >
            <span className="text-4xl sm:text-5xl mb-2 text-indigo-400">📁</span>
            <p className="text-xs sm:text-base text-gray-600">Drag & Drop your file here or <span className="text-indigo-600 underline">click to select</span></p>
            <input
              ref={fileInputRef}
              type="file"
              id="file"
              name="file"
              className="hidden"
              onChange={handleFileSelect}
              required
            />
          </div>
          {file && (
            <div className="w-full bg-indigo-50 rounded-lg p-2 sm:p-3 mt-2 text-xs sm:text-sm text-gray-700">
              <div><b>File Name:</b> {file.name}</div>
              <div><b>File Type:</b> {file.type}</div>
              <div><b>File Size:</b> {formatFileSize(file.size)}</div>
              <div className="mt-1"><b>Content Type:</b> {getContentType(file.type)}</div>
            </div>
          )}
          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div>
              <label htmlFor="wa_message_id" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">WA Message ID</label>
              <input
                type="text"
                id="wa_message_id"
                name="wa_message_id"
                value={waMessageId}
                onChange={(e) => setWaMessageId(e.target.value)}
                required
                className="block w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-xs sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="sender" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Sender</label>
              <input
                type="text"
                id="sender"
                name="sender"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                required
                className="block w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-xs sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="receiver" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Receiver</label>
              <input
                type="text"
                id="receiver"
                name="receiver"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                required
                className="block w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-xs sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="timestamp" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Timestamp (in ms)</label>
              <input
                type="text"
                id="timestamp"
                name="timestamp"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                required
                className="block w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-xs sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="is_forwarded" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Is Forwarded</label>
              <select
                id="is_forwarded"
                name="is_forwarded"
                value={isForwarded}
                onChange={(e) => setIsForwarded(e.target.value)}
                className="block w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-xs sm:text-base"
              >
                <option value="false">False</option>
                <option value="true">True</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="content" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                id="content"
                name="content"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="block w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-xs sm:text-base"
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
            <button
              type="submit"
              className="w-full sm:flex-1 py-2 sm:py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            >
              Upload
            </button>
            <button
              type="button"
              className="w-full sm:flex-1 py-2 sm:py-3 px-4 rounded-lg bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
              onClick={resetForm}
            >
              Clear
            </button>
          </div>
          {/* Response Box */}
          {responseData && (
            <div className={`w-full mt-4 rounded-lg p-2 sm:p-4 text-xs sm:text-sm ${responseType === 'success' ? 'bg-green-50 border-l-4 border-green-500' : responseType === 'error' ? 'bg-red-50 border-l-4 border-red-500' : 'bg-yellow-50 border-l-4 border-yellow-500'}`}>
              {responseType === 'success' && responseData.id ? (
                <>
                  <div className="font-bold text-green-700 mb-2 text-xs sm:text-base">✅ Upload successful!</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <tbody>
                        <tr><th className="pr-2 font-semibold">Message ID</th><td>{responseData.id}</td></tr>
                        <tr><th className="pr-2 font-semibold">Sender</th><td>{responseData.sender}</td></tr>
                        <tr><th className="pr-2 font-semibold">Receiver</th><td>{responseData.receiver}</td></tr>
                        <tr><th className="pr-2 font-semibold">Timestamp</th><td>{responseData.timestamp}</td></tr>
                        <tr><th className="pr-2 font-semibold">Content Type</th><td>{responseData.content_type}</td></tr>
                        <tr><th className="pr-2 font-semibold">Content</th><td>{responseData.content}</td></tr>
                        <tr><th className="pr-2 font-semibold">Is Forwarded</th><td>{responseData.is_forwarded}</td></tr>
                        <tr><th className="pr-2 font-semibold">Media Filename</th><td>{responseData.media_filename}</td></tr>
                        <tr><th className="pr-2 font-semibold">Media Size</th><td>{responseData.media_size_bytes?.toLocaleString()} bytes</td></tr>
                        <tr><th className="pr-2 font-semibold">Media MIME</th><td>{responseData.media_mime_type}</td></tr>
                        <tr><th className="pr-2 font-semibold">Media URL</th><td><a href={responseData.media_s3_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">View Media</a></td></tr>
                        <tr>
                          <th className="pr-2 font-semibold">Status</th>
                          <td>
                            {responseData.status}
                            <button
                              type="button"
                              className="ml-2 px-2 py-1 rounded bg-indigo-500 text-white text-xs hover:bg-indigo-600 transition-colors"
                              onClick={() => refreshStatus(responseData.id)}
                            >
                              🔄 Refresh
                            </button>
                          </td>
                        </tr>
                        <tr><th className="pr-2 font-semibold">Score</th><td>{responseData.deepfake_score !== undefined && responseData.deepfake_score !== null ? responseData.deepfake_score : '-'}</td></tr>
                        <tr><th className="pr-2 font-semibold">Deepfake Summary</th><td>{responseData.deepfake_summary || '-'}</td></tr>
                        <tr><th className="pr-2 font-semibold">Created At</th><td>{new Date(responseData.createdAt).toLocaleString()}</td></tr>
                        <tr><th className="pr-2 font-semibold">Updated At</th><td>{new Date(responseData.updatedAt).toLocaleString()}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </>
              ) : responseType === 'warning' ? (
                <>
                  <div className="font-bold text-yellow-700 mb-2 text-xs sm:text-base">⚠️ Upload succeeded, but response was not in expected format:</div>
                  <pre className="bg-yellow-100 rounded p-2 overflow-x-auto">{responseData.rawResponse}</pre>
                </>
              ) : (
                <div className="font-bold text-red-700 text-xs sm:text-base">❌ {responseData.error}</div>
              )}
            </div>
          )}
        </form>
      </div>
      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md flex flex-col items-center">
            <h2 className="text-base sm:text-lg font-bold mb-4 text-indigo-700">Uploading Media...</h2>
            <progress
              className="w-full h-3 sm:h-4 mb-2"
              value={uploadProgress}
              max="100"
              style={{ accentColor: '#8fce00', backgroundColor: '#f0fdf4' }}
            ></progress>
            <p className="text-gray-700 mb-4 text-xs sm:text-base">{uploadStatus}</p>
            <button
              className="mt-2 px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;