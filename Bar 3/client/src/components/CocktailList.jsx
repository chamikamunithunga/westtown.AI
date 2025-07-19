import CocktailCard from './CocktailCard';

const CocktailList = ({ cocktails }) => {
  return (
    <div className="cocktail-list">
      <h2>Your Perfect Cocktails</h2>
      <div className="cocktails-grid">
        {cocktails.map((cocktail, index) => (
          <CocktailCard key={index} cocktail={cocktail} />
        ))}
      </div>
    </div>
  );
};

export default CocktailList;