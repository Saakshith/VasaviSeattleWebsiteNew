import './App.css';
import './styles/PageTransition.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import FinancialsPage from './pages/FinancialsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import PageTransition from './components/PageTransition';

function App() {
  return (
    <Router>
      <div className="App">
        <main className="App-main">
          <Routes>
            <Route path="/" element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            } />
            <Route path="/events" element={
              <PageTransition>
                <EventsPage />
              </PageTransition>
            } />
            <Route path="/financials" element={
              <PageTransition>
                <FinancialsPage />
              </PageTransition>
            } />
            <Route path="/contact" element={
              <PageTransition>
                <ContactPage />
              </PageTransition>
            } />
            <Route path="/login" element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
