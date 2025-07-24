import React, { useState, useEffect } from 'react';

const MessagesList: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [popupLoading, setPopupLoading] = useState(false);

  const apiUrl = "https://api.factchecks.io/api/messages";

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    setError('');
    setMessages([]);

    try {
      const url = new URL(apiUrl);
      url.searchParams.set("page", page.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "omit"
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setMessages(data.messages || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);

    } catch (error: any) {
      setError("Failed to load messages: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (delta: number) => {
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
      fetchMessages(newPage);
    }
  };

  const formatSummary = (text: string | null) => {
    if (!text) return '-';
    return text
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/\u2022|\u2022/g, '<span style="display:inline-block;width:1em;">&bull;</span>')
      .replace(/(Technical Analysis:)/g, '<b>$1</b>')
      .replace(/(Model Details:)/g, '<b>$1</b>');
  };

  const handleRowClick = async (msg: any) => {
    setSelectedMessage(msg);
    setShowStatusPopup(true);
    setPopupLoading(true);

    try {
      const response = await fetch(`https://api.factchecks.io/api/messages/${msg.id}`);
      const latest = await response.json();
      setSelectedMessage(latest);
    } catch (error) {
      console.error('Error fetching latest details:', error);
    } finally {
      setPopupLoading(false);
    }
  };

  const closeStatusPopup = () => {
    setShowStatusPopup(false);
    setSelectedMessage(null);
    setPopupLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-2 sm:p-4">
      <div className="w-full p-2 sm:p-6 md:p-10 flex flex-col overflow-y-auto max-h-screen relative">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-indigo-700 mb-4 sm:mb-6 text-center">DeepFake Messages</h1>
        {/* Loader overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-indigo-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span className="text-indigo-700 font-semibold text-lg">Loading...</span>
            </div>
          </div>
        )}
        {loading && <div className="text-center text-base sm:text-lg text-gray-600 font-semibold mb-4">Loading...</div>}
        {error && <div className="text-center text-red-600 font-semibold mb-4 text-xs sm:text-base">{error}</div>}
        <div className="overflow-x-auto rounded-lg shadow relative">
          <table className="min-w-full bg-white text-xs sm:text-sm">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="bg-indigo-100 text-indigo-800">
                <th className="px-3 py-2 font-semibold">Id</th>
                <th className="px-3 py-2 font-semibold">Sender</th>
                <th className="px-3 py-2 font-semibold">Receiver</th>
                <th className="px-3 py-2 font-semibold">Message</th>
                <th className="px-3 py-2 font-semibold">Media</th>
                <th className="px-3 py-2 font-semibold">Media Type</th>
                <th className="px-3 py-2 font-semibold">Media Size</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Deepfake Result</th>
                <th className="px-3 py-2 font-semibold">Deepfake Summary</th>
                <th className="px-3 py-2 font-semibold">Score</th>
                <th className="px-3 py-2 font-semibold">Error</th>
                <th className="px-3 py-2 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="relative">
              {loading && (
                <tr>
                  <td colSpan={13} className="p-0 relative" style={{ height: '200px' }}>
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
                      <div className="flex flex-col items-center">
                        <svg className="animate-spin h-10 w-10 text-indigo-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span className="text-indigo-700 font-semibold text-lg">Loading...</span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && messages.length === 0 && (
                <tr>
                  <td colSpan={13} className="text-center py-8 text-gray-500">No messages found.</td>
                </tr>
              )}
              {!loading && messages.map((msg, idx) => (
                <tr
                  key={msg.id}
                  className={`cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-indigo-50 hover:bg-indigo-100' : 'bg-white hover:bg-indigo-50'}`}
                  onClick={() => handleRowClick(msg)}
                >
                  <td className="px-3 py-2 font-bold">{msg.id || "—"}</td>
                  <td className="px-3 py-2">{msg.sender || "—"}</td>
                  <td className="px-3 py-2">{msg.receiver || "—"}</td>
                  <td className="px-3 py-2">{msg.content || "—"}</td>
                  <td className="px-3 py-2">
                    {msg.media_filename ? (
                      <a href={msg.media_s3_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
                        {msg.media_filename}
                      </a>
                    ) : (
                      "None"
                    )}
                  </td>
                  <td className="px-3 py-2">{msg.media_file_type || "-"}</td>
                  <td className="px-3 py-2">
                    {msg.media_size_bytes
                      ? (msg.media_size_bytes / 1024).toFixed(1) + " KB"
                      : "-"
                    }
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold 
                      ${msg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        msg.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          msg.status === 'completed' ? 'bg-green-100 text-green-800' :
                            msg.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'}`}
                    >
                      {msg.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-3 py-2">{msg.deepfake_result ?? "-"}</td>
                  <td className="px-3 py-2" dangerouslySetInnerHTML={{ __html: formatSummary(msg.deepfake_summary) }} />
                  <td className="px-3 py-2">
                    {msg.deepfake_score !== null && msg.deepfake_score !== undefined
                      ? msg.deepfake_score.toFixed(2)
                      : "-"
                    }
                  </td>
                  <td className="px-3 py-2">{msg.error_message || "-"}</td>
                  <td className="px-3 py-2">{new Date(msg.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <button
            onClick={() => changePage(-1)}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 rounded bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors text-xs sm:text-base"
          >
            Previous
          </button>
          <span className="text-xs sm:text-base font-medium text-gray-700">Page {currentPage}</span>
          <button
            onClick={() => changePage(1)}
            disabled={currentPage === totalPages}
            className="px-3 sm:px-4 py-2 rounded bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors text-xs sm:text-base"
          >
            Next
          </button>
        </div>
      </div>
      {/* Status Popup */}
      {showStatusPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50" onClick={closeStatusPopup}>
          <div className="bg-white rounded-xl shadow-lg p-2 sm:p-8 w-full max-w-xs sm:max-w-lg flex flex-col relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <span className="text-base sm:text-lg font-bold text-indigo-700">Message Status</span>
              <button className="text-xl sm:text-2xl text-gray-500 hover:text-red-500 transition-colors" onClick={closeStatusPopup}>&times;</button>
            </div>
            <hr className="mb-2 sm:mb-4" />
            {popupLoading ? (
              <div className="text-center text-base sm:text-lg text-gray-600 font-semibold py-4 sm:py-8">🔄 Fetching latest details...</div>
            ) : selectedMessage ? (
              <>
                {selectedMessage.media_s3_url && (
                  <div className="flex justify-center mb-2 sm:mb-4">
                    <img
                      src={selectedMessage.media_s3_url}
                      alt="media"
                      className="max-w-[120px] sm:max-w-xs max-h-24 sm:max-h-40 rounded shadow"
                    />
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <tbody>
                      <tr><th className="pr-2 text-left font-semibold">ID</th><td>{selectedMessage.id}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Sender</th><td>{selectedMessage.sender}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Receiver</th><td>{selectedMessage.receiver}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Status</th><td><span className="px-2 py-1 rounded text-xs font-bold bg-indigo-100 text-indigo-800">{selectedMessage.status}</span></td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Score</th><td>{selectedMessage.deepfake_score !== null && selectedMessage.deepfake_score !== undefined ? selectedMessage.deepfake_score : '-'}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Deepfake Summary</th><td dangerouslySetInnerHTML={{ __html: formatSummary(selectedMessage.deepfake_summary) || '-' }} /></tr>
                      <tr><th className="pr-2 text-left font-semibold">Content</th><td>{selectedMessage.content || '-'}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Content Type</th><td>{selectedMessage.content_type || '-'}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Media Filename</th><td>{selectedMessage.media_filename || '-'}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Media File Type</th><td>{selectedMessage.media_file_type || '-'}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Media Size</th><td>{selectedMessage.media_size_bytes ? selectedMessage.media_size_bytes.toLocaleString() + ' bytes' : '-'}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Media MIME</th><td>{selectedMessage.media_mime_type || '-'}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Error Message</th><td>{selectedMessage.error_message || '-'}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Updated At</th><td>{new Date(selectedMessage.updatedAt).toLocaleString()}</td></tr>
                      <tr><th className="pr-2 text-left font-semibold">Created At</th><td>{new Date(selectedMessage.createdAt).toLocaleString()}</td></tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesList;