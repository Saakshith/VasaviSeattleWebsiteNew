import React, { useEffect, useMemo, useState } from 'react';
import '../styles/DriveGallery.css';

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

function buildImageUrlsFromFileId(fileId) {
  // Return multiple URL formats to try
  return [
    `https://drive.google.com/uc?id=${fileId}&export=view`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
    `https://drive.google.com/file/d/${fileId}/preview`,
  ];
}

// Component that tries multiple URL formats
function ImageWithFallback({ fileId, alt, className }) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const urls = buildImageUrlsFromFileId(fileId);
  const currentUrl = urls[currentUrlIndex];

  const handleError = () => {
    if (currentUrlIndex < urls.length - 1) {
      // Try next URL format
      setCurrentUrlIndex(currentUrlIndex + 1);
    } else {
      // All URLs failed
      setImageError(true);
    }
  };

  if (imageError) {
    return (
      <div className={`${className} image-error`} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        Image unavailable
      </div>
    );
  }

  return (
    <img 
      src={currentUrl} 
      alt={alt} 
      className={className} 
      loading="lazy"
      onError={handleError}
    />
  );
}

export default function DriveGallery({ folderUrlOrId, maxImages = 200 }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
  const fallbackFolder = process.env.REACT_APP_GDRIVE_FOLDER_URL || process.env.REACT_APP_GDRIVE_FOLDER_ID || '';

  const folderId = useMemo(() => {
    const candidate = folderUrlOrId || fallbackFolder;
    return extractFolderIdFromInput(candidate);
  }, [folderUrlOrId, fallbackFolder]);

  useEffect(() => {
    async function fetchAllImages() {
      if (!apiKey) {
        setErrorMessage('Missing Google API key. Set REACT_APP_GOOGLE_API_KEY in .env');
        return;
      }
      if (!folderId) {
        setErrorMessage('Missing Google Drive folder ID or URL. Provide via prop or REACT_APP_GDRIVE_FOLDER_URL/ID');
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      const endpoint = 'https://www.googleapis.com/drive/v3/files';
      let pageToken = undefined;
      const collected = [];

      try {
        // First, try a simple request to test the API key and folder access
        const testParams = new URLSearchParams({
          key: apiKey,
          q: `'${folderId}' in parents`,
          fields: 'files(id,name)',
          pageSize: '1',
        });

        const testUrl = `${endpoint}?${testParams.toString()}`;
        const testResponse = await fetch(testUrl);
        
        if (!testResponse.ok) {
          const testText = await testResponse.text();
          throw new Error(`API test failed (${testResponse.status}): ${testText}`);
        }

        await testResponse.json();

        // If test passes, proceed with full image query
        do {
          const params = new URLSearchParams({
            key: apiKey,
            q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
            fields: 'nextPageToken, files(id,name,mimeType)',
            pageSize: '1000',
            orderBy: 'name',
          });
          if (pageToken) params.set('pageToken', pageToken);

          const url = `${endpoint}?${params.toString()}`;
          const response = await fetch(url);
          
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Drive API error (${response.status}). Ensure the folder and its images are shared as "Anyone with the link". Details: ${text}`);
          }
          const data = await response.json();
          
          const files = Array.isArray(data.files) ? data.files : [];

          for (const file of files) {
            if (collected.length >= maxImages) break;
            collected.push({
              id: file.id,
              name: file.name,
              mimeType: file.mimeType,
            });
          }

          pageToken = data.nextPageToken;
        } while (pageToken && collected.length < maxImages);

        setImages(collected);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error while fetching Drive images');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllImages();
  }, [apiKey, folderId, maxImages]);

  return (
    <div className="drive-gallery">
      {isLoading && <div className="drive-gallery-status">Loading images…</div>}
      {!!errorMessage && <div className="drive-gallery-error">{errorMessage}</div>}

      {!isLoading && !errorMessage && (
        images.length > 0 ? (
          <div className="drive-gallery-grid">
            {images.map((img) => (
              <div key={img.id} className="drive-gallery-item">
                <ImageWithFallback 
                  fileId={img.id}
                  alt={img.name} 
                  className="drive-gallery-img"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="drive-gallery-status">No images found in the specified folder.</div>
        )
      )}
    </div>
  );
}
