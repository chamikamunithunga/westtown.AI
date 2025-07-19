const CocktailCard = ({ cocktail }) => {
  return (
    <div className="cocktail-card">
      <h3>{cocktail.name}</h3>
      <p className="cocktail-description">{cocktail.description}</p>
      
      <div className="cocktail-details">
        <div className="ingredients">
          <h4>Ingredients:</h4>
          <ul>
            {cocktail.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div className="price">
          <h4>Price:</h4>
          <span className="price-tag">${cocktail.price}</span>
        </div>
      </div>
    </div>
  );
};

export default CocktailCard;