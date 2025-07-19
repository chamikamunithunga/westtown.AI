import { useState } from 'react';
import axios from 'axios';
import InputForm from './components/InputForm';
import CocktailList from './components/CocktailList';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [cocktails, setCocktails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5008';

  const handleSubmit = async ({ mood, flavors }) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/api/generate-cocktails`, {
        mood,
        flavors
      });
      
      setCocktails(response.data);
      setShowResults(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate cocktail recommendations. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setCocktails([]);
    setError('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>WestTown.AI</h1>
        <p>Discover your perfect cocktail based on your mood and flavor preferences</p>
      </header>

      <main className="app-main">
        {isLoading && <LoadingSpinner />}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleReset} className="reset-button">Try Again</button>
          </div>
        )}
        
        {!isLoading && !error && !showResults && (
          <InputForm onSubmit={handleSubmit} />
        )}
        
        {!isLoading && !error && showResults && cocktails.length > 0 && (
          <>
            <CocktailList cocktails={cocktails} />
            <button onClick={handleReset} className="reset-button">
              Find More Cocktails
            </button>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 AI WestTownSports Club. Drink responsibly.</p>
      </footer>
    </div>
  );
}

export default App
