import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/EventsPage.css';

const EventsPage = () => {
  const [pastEvents, setPastEvents] = useState([]);

  // iCal feed URL for Google Calendar (this will be the Calendar ID)
  const icalFeedUrl = process.env.REACT_APP_ICAL_FEED_URL || '';

  // Google Drive folder for past events
  const driveFolderId = process.env.REACT_APP_PAST_EVENTS_FOLDER_ID || '';
  
  // Extract folder ID from URL if needed
  const extractFolderId = (input) => {
    if (!input) return '';
    
    // If it's already just an ID, return it
    if (input.length < 50 && !input.includes('http')) {
      return input;
    }
    
    // Extract from Google Drive URL
    const urlMatch = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (urlMatch) {
      return urlMatch[1];
    }
    
    // Extract from sharing URL
    const sharingMatch = input.match(/id=([a-zA-Z0-9_-]+)/);
    if (sharingMatch) {
      return sharingMatch[1];
    }
    
    return input;
  };
  
  // Use the folder ID from environment variable
  const actualFolderId = extractFolderId(driveFolderId);

  // Sample past events for testing (fallback when API fails)
  const samplePastEvents = React.useMemo(() => [
    {
      id: 'sample-1',
      name: 'Navaratri-10-14-2024',
      imageId: null,
      imageName: null
    },
    {
      id: 'sample-2', 
      name: 'Diwali-11-12-2024',
      imageId: null,
      imageName: null
    },
    {
      id: 'sample-3',
      name: 'Fundraiser-09-28-2024',
      imageId: null,
      imageName: null
    }
  ], []);

  // Fetch past events from Google Drive
  useEffect(() => {
    async function fetchPastEvents() {
      if (!actualFolderId) {
        setPastEvents(samplePastEvents);
        return;
      }

      try {
        const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
        
        if (!apiKey) {
          setPastEvents(samplePastEvents);
          return;
        }
        
        // Get subfolders
        const foldersResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${actualFolderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${apiKey}&fields=files(id,name)&orderBy=name desc`
        );

        if (!foldersResponse.ok) {
          const errorText = await foldersResponse.text();
          console.error('❌ Drive API error:', foldersResponse.status, errorText);
          throw new Error(`Drive API error (${foldersResponse.status}): ${errorText}`);
        }

        const foldersData = await foldersResponse.json();

        if (foldersData.files && foldersData.files.length > 0) {
          // For each subfolder, get the first image to use as thumbnail
          const eventsWithImages = await Promise.all(
            foldersData.files.map(async (folder) => {
              try {
                // Get all images from the subfolder to count them
                const imagesResponse = await fetch(
                  `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name)&orderBy=name`
                );

                if (imagesResponse.ok) {
                  const imagesData = await imagesResponse.json();
                  
                  const firstImage = imagesData.files && imagesData.files.length > 0 ? imagesData.files[0] : null;
                  
                  return {
                    id: folder.id,
                    name: folder.name,
                    imageId: firstImage ? firstImage.id : null,
                    imageName: firstImage ? firstImage.name : null,
                    photoCount: imagesData.files ? imagesData.files.length : 0
                  };
                } else {
                  console.error('❌ Failed to get images for folder:', folder.name, imagesResponse.status);
                }
              } catch (error) {
                console.error(`❌ Error getting images for folder ${folder.name}:`, error);
              }
              
              return {
                id: folder.id,
                name: folder.name,
                imageId: null,
                imageName: null,
                photoCount: 0
              };
            })
          );

          setPastEvents(eventsWithImages);
        } else {
          setPastEvents(samplePastEvents);
        }
      } catch (error) {
        console.error('❌ Error fetching past events:', error);
        setPastEvents(samplePastEvents);
      }
    }

    fetchPastEvents();
  }, [actualFolderId, samplePastEvents]);

  // Parse folder name to extract event name and date (format: "Name of event-xx/xx/xx")
  const parseFolderName = (folderName) => {
    // Split by dash to separate event name and date
    const parts = folderName.split('-');
    
    if (parts.length >= 2) {
      const eventName = parts[0].trim(); // First part: "Name of event"
      const datePart = parts[1].trim(); // Second part: "xx/xx/xx"
      
      // Parse the date - handle both 2-digit and 4-digit years
      const datePattern = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/;
      const dateMatch = datePart.match(datePattern);
      
      let formattedDate = 'Date TBD';
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1; // Month is 0-indexed
        const day = parseInt(dateMatch[2]);
        let year = parseInt(dateMatch[3]);
        
        // Handle 2-digit years (assume 20xx for years 00-99)
        if (year < 100) {
          year += 2000;
        }
        
        const date = new Date(year, month, day);
        formattedDate = date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      
      return {
        eventName: eventName,
        formattedDate: formattedDate
      };
    }
    
    // Fallback if format doesn't match
    return {
      eventName: folderName,
      formattedDate: 'Date TBD'
    };
  };

  // Handle clicking on a past event folder
  const handlePastEventClick = (folderId) => {
    if (folderId.startsWith('sample-')) {
      // For sample events, just show an alert
      alert('This is a sample event. Set up your Google Drive folder to see real events!');
      return;
    }
    
    const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
    window.open(folderUrl, '_blank');
  };

  return (
    <div className="events-page">
      <Navbar />
      
      {/* Banner Section */}
      <div className="banner">
        <div className="banner-content">
          <div className="banner-text">
            <h1>Events</h1>
            <p>Celebrating culture, community, and connection</p>
          </div>
        </div>
      </div>

      {/* Google Calendar Embed Section */}
      <section className="upcoming-events">
        <h2 className='section-header'>Upcoming Events</h2>
        
        {/* Google Calendar Embed */}
        <div className="calendar-embed-section">
          
          {icalFeedUrl ? (
            <div className="calendar-embed">
              <iframe 
                src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(icalFeedUrl)}&ctz=America%2FLos_Angeles&mode=AGENDA&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&height=600`}
                style={{ border: 0 }}
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
                title="Vasavi Seattle Events Calendar"
              />
            </div>
          ) : (
            <div className="calendar-setup">
              <div className="setup-instructions">
                <h4>🚀 Set Up Google Calendar Integration</h4>
                <ol>
                  <li>Go to <a href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer">Google Calendar</a></li>
                  <li>Find your calendar in the left sidebar</li>
                  <li>Click the three dots (⋮) next to it</li>
                  <li>Select "Settings and sharing"</li>
                  <li>Scroll down to "Integrate calendar"</li>
                  <li>Copy the "Calendar ID" (looks like: <code>yourname@gmail.com</code>)</li>
                  <li>Add it to your <code>.env</code> file as <code>REACT_APP_ICAL_FEED_URL</code></li>
                </ol>
                <p><strong>Example:</strong> <code>REACT_APP_ICAL_FEED_URL=yourname@gmail.com</code></p>
                <p><em>Once you add the Calendar ID, the calendar will appear here automatically!</em></p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="past-events">
        <h2 className='section-header'>Past Events</h2>
        <p>Relive the memories from our previous events</p>
        

        
                 {actualFolderId ? (
           <div className="past-events-grid">
             {pastEvents.length > 0 ? (
               pastEvents.map((event) => {
                                 const parsedEvent = parseFolderName(event.name);
                 
                 return (
                   <div 
                     key={event.id} 
                     className="past-event-card"
                     onClick={() => handlePastEventClick(event.id)}
                   >
                     <div className="event-image">
                       <img 
                         src={event.imageId ? `https://drive.google.com/thumbnail?id=${event.imageId}&sz=w300` : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzOWMxMiIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXZlbnQ8L3RleHQ+Cjwvc3ZnPg=="}
                         alt={event.name}
                         onError={(e) => {
                           e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzOWMxMiIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXZlbnQ8L3RleHQ+Cjwvc3ZnPg==";
                         }}
                       />
                                               <div className="photo-count">{event.photoCount || 0} Photos</div>
                     </div>
                     <div className="event-details">
                                             <h4>{parsedEvent.eventName}</h4>
                      <p>{parsedEvent.formattedDate}</p>
                     </div>
                   </div>
                 );
               })
             ) : (
               <div className="no-events">
                 <p>No past events found. Check back soon!</p>
               </div>
             )}
           </div>
         ) : (
          <div className="setup-instructions">
            <h4>📁 Set Up Past Events</h4>
            <p>To display past events, add your Google Drive folder ID to your <code>.env</code> file:</p>
            <p><code>REACT_APP_PAST_EVENTS_FOLDER_ID=your_folder_id_here</code></p>
            <p><em>Note: Your folder should contain subfolders, and each subfolder should contain images.</em></p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default EventsPage;