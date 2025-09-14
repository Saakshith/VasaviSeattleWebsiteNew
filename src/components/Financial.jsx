import React, { useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Financial.css';

const Financial = ({ folderUrlOrId, maxFiles = 3 }) => {
  const [financialFiles, setFinancialFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
  const fallbackFolder = process.env.REACT_APP_FINANCIALS_FOLDER_URL || process.env.REACT_APP_FINANCIALS_FOLDER_ID || '';

  function extractFolderIdFromInput(input) {
    if (!input) return '';
    const trimmed = input.trim();

    const likelyId = /^[A-Za-z0-9_-]{10,}$/;
    if (likelyId.test(trimmed) && !trimmed.includes('/')) {
      return trimmed;
    }

    const foldersMatch = trimmed.match(/drive\.google\.com\/(?:drive\/(?:u\/\d+\/)?folders|folder)\/([A-Za-z0-9_-]+)/);
    if (foldersMatch && foldersMatch[1]) {
      return foldersMatch[1];
    }

    const openIdMatch = trimmed.match(/[?&]id=([A-Za-z0-9_-]+)/);
    if (openIdMatch && openIdMatch[1]) {
      return openIdMatch[1];
    }

    return '';
  }

  const folderId = useMemo(() => {
    const candidate = folderUrlOrId || fallbackFolder;
    return extractFolderIdFromInput(candidate);
  }, [folderUrlOrId, fallbackFolder]);

  function getFileViewUrl(fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }

  useEffect(() => {
    async function fetchFinancialFiles() {
      if (!apiKey) {
        setErrorMessage('Missing Google API key. Set REACT_APP_GOOGLE_API_KEY in .env');
        return;
      }
      if (!folderId) {
        setErrorMessage('Missing Google Drive folder ID or URL. Provide via prop or REACT_APP_FINANCIALS_FOLDER_URL/ID');
        return;
      }

      console.log('Financials - API Key:', apiKey.substring(0, 10) + '...');
      console.log('Financials - Folder ID:', folderId);
      console.log('Financials - Original URL:', fallbackFolder);

      setIsLoading(true);
      setErrorMessage('');

      const endpoint = 'https://www.googleapis.com/drive/v3/files';
      let pageToken = undefined;
      const collected = [];

      try {
        do {
          const params = new URLSearchParams({
            key: apiKey,
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'nextPageToken, files(id,name,mimeType)',
            pageSize: '1000',
            orderBy: 'name',
          });
          if (pageToken) params.set('pageToken', pageToken);

          const url = `${endpoint}?${params.toString()}`;
          console.log('Financials - API URL:', url);
          
          const response = await fetch(url);
          console.log('Financials - Response status:', response.status);
          
          if (!response.ok) {
            const text = await response.text();
            console.log('Financials - Error response:', text);
            throw new Error(`Drive API error (${response.status}). Ensure the folder and its files are shared as "Anyone with the link". Details: ${text}`);
          }
          const data = await response.json();
          console.log('Financials - Files found:', data.files?.length || 0);
          
          const files = Array.isArray(data.files) ? data.files : [];

          for (const file of files) {
            // If maxFiles is set and we've reached the limit, break
            if (maxFiles && collected.length >= maxFiles) break;
            
            // Remove file extension for display title
            const title = file.name.replace(/\.[^/.]+$/, "");
            
            collected.push({
              id: file.id,
              name: title,
              originalName: file.name,
              mimeType: file.mimeType,
              viewUrl: getFileViewUrl(file.id),
            });
          }

          pageToken = data.nextPageToken;
        } while (pageToken && (!maxFiles || collected.length < maxFiles));

        setFinancialFiles(collected);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error while fetching financial files');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFinancialFiles();
  }, [apiKey, folderId, maxFiles, fallbackFolder]);

  const handleFileClick = (viewUrl) => {
    window.open(viewUrl, '_blank');
  };

  if (isLoading) {
    return <div className="financials-loading">Loading financial documents...</div>;
  }

  if (errorMessage) {
    return <div className="financials-error">{errorMessage}</div>;
  }

  return (
    <div className="financials-grid">
      {financialFiles.map((file) => (
        <div key={file.id} className="financial-item">
          <div className="financial-bar"></div>
          <h4 className="financial-title">{file.name}</h4>
          <button 
            className="financial-info"
            onClick={() => handleFileClick(file.viewUrl)}
          >
            Read More <FontAwesomeIcon icon={faArrowRight}/>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Financial;