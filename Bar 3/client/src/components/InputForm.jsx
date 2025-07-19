import { useState } from 'react';

const InputForm = ({ onSubmit }) => {
  const [mood, setMood] = useState('');
  const [flavors, setFlavors] = useState([]);

  const availableFlavors = ['Sweet', 'Sour', 'Spicy', 'Fruity', 'Bitter', 'Refreshing', 'Creamy', 'Herbal'];

  const handleFlavorToggle = (flavor) => {
    setFlavors(prev => 
      prev.includes(flavor) 
        ? prev.filter(f => f !== flavor)
        : [...prev, flavor]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mood.trim()) {
      onSubmit({ mood, flavors });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <h2>Find Your Perfect Cocktail</h2>
      
      <div className="form-group">
        <label htmlFor="mood">How are you feeling?</label>
        <input
          type="text"
          id="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="e.g., happy, relaxed, adventurous..."
          className="mood-input"
          required
        />
      </div>

      <div className="form-group">
        <label>What flavors do you enjoy?</label>
        <div className="flavor-grid">
          {availableFlavors.map(flavor => (
            <label key={flavor} className="flavor-checkbox">
              <input
                type="checkbox"
                checked={flavors.includes(flavor)}
                onChange={() => handleFlavorToggle(flavor)}
              />
              <span>{flavor}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="submit-button">
        Find My Drink
      </button>
    </form>
  );
};

export default InputForm;