import React, { useEffect, useMemo, useState } from 'react';
import '../styles/BoardMemberCard.css';

function extractFolderIdFromInput(input) {
  if (!input) return '';
  const trimmed = input.trim();

  // If a raw folder ID is provided (no slashes and length ~ 28-60), accept as-is
  const likelyId = /^[A-Za-z0-9_-]{10,}$/;
  if (likelyId.test(trimmed) && !trimmed.includes('/')) {
    return trimmed;
  }

  // Patterns to match typical Google Drive folder URLs
  // 1) https://drive.google.com/drive/folders/<FOLDER_ID>
  // 2) https://drive.google.com/drive/folders/<FOLDER_ID>?usp=sharing
  // 3) https://drive.google.com/drive/u/0/folders/<FOLDER_ID>
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

function extractNameAndRole(filename) {
  // Remove file extension
  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
  
  // Split by the first dash to separate name and role
  const parts = nameWithoutExtension.split('-');
  
  if (parts.length >= 2) {
    const name = parts[0].trim();
    const role = parts.slice(1).join('-').trim(); // Join remaining parts in case role contains dashes
    return { name, role };
  }
  
  // Fallback if format doesn't match
  return { name: filename, role: 'Board Member' };
}

function buildImageUrlsFromFileId(fileId) {
  return [
    `https://drive.google.com/uc?id=${fileId}&export=view`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
    `https://drive.google.com/file/d/${fileId}/preview`,
  ];
}

function ImageWithFallback({ fileId, alt, className }) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const urls = buildImageUrlsFromFileId(fileId);
  const currentUrl = urls[currentUrlIndex];

  const handleError = () => {
    if (currentUrlIndex < urls.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
    } else {
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

const BoardMemberCard = ({ folderUrlOrId, maxMembers = 50 }) => {
  const [boardMembers, setBoardMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
  const fallbackFolder = process.env.REACT_APP_BOARD_MEMBERS_FOLDER_URL || process.env.REACT_APP_BOARD_MEMBERS_FOLDER_ID || '';

  const folderId = useMemo(() => {
    const candidate = folderUrlOrId || fallbackFolder;
    return extractFolderIdFromInput(candidate);
  }, [folderUrlOrId, fallbackFolder]);

  useEffect(() => {
    async function fetchBoardMembers() {
      if (!apiKey) {
        setErrorMessage('Missing Google API key. Set REACT_APP_GOOGLE_API_KEY in .env');
        return;
      }
      if (!folderId) {
        setErrorMessage('Missing Google Drive folder ID or URL. Provide via prop or REACT_APP_BOARD_MEMBERS_FOLDER_URL/ID');
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      const endpoint = 'https://www.googleapis.com/drive/v3/files';
      let pageToken = undefined;
      const collected = [];

      try {
        do {
          const params = new URLSearchParams({
            key: apiKey,
            q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
            fields: 'nextPageToken, files(id,name,mimeType)',
            pageSize: '1000', // Maximum page size for better performance
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
            if (collected.length >= maxMembers) break;
            
            const { name, role } = extractNameAndRole(file.name);
            
            collected.push({
              id: file.id,
              name: name,
              role: role,
              mimeType: file.mimeType,
            });
          }

          pageToken = data.nextPageToken;
        } while (pageToken && collected.length < maxMembers);

        setBoardMembers(collected);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error while fetching board members');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBoardMembers();
  }, [apiKey, folderId, maxMembers, fallbackFolder]);

  if (isLoading) {
    return <div className="board-members-loading">Loading board members... ({boardMembers.length} loaded so far)</div>;
  }

  if (errorMessage) {
    return <div className="board-members-error">{errorMessage}</div>;
  }

  return (
    <div className="board-members-container">
      <div className="board-members-grid">
        {boardMembers.map((member) => (
          <div key={member.id} className="board-member-card">
            <div className="member-image-container">
              <ImageWithFallback 
                fileId={member.id}
                alt={member.name} 
                className="member-image"
              />
            </div>
            <h4 className="member-name">{member.name}</h4>
            <h5 className="member-role">{member.role}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardMemberCard;