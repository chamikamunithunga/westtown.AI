import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const cocktailsPath = join(__dirname, '..', 'cocktails.json');
const cocktailsData = JSON.parse(readFileSync(cocktailsPath, 'utf-8'));

const formatFlavors = (flavors) => {
  if (!flavors || flavors.length === 0) return '';
  if (flavors.length === 1) return flavors[0];
  if (flavors.length === 2) return `${flavors[0]} and ${flavors[1]}`;
  return `${flavors.slice(0, -1).join(', ')}, and ${flavors[flavors.length - 1]}`;
};

export const generateCocktails = async (req, res) => {
  try {
    console.log('Received request:', { mood: req.body.mood, flavors: req.body.flavors });
    const { mood, flavors } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const cocktailNames = cocktailsData.map(cocktail => cocktail.name);

    const flavorString = formatFlavors(flavors);
    const flavorDescription = flavorString ? `with ${flavorString} flavors` : '';

    const prompt = `You are an expert mixologist. A customer is feeling ${mood} and wants a cocktail ${flavorDescription}. 
    From the following list of available cocktails, which three would you recommend? 
    List: [${cocktailNames.join(', ')}]. 
    Please respond with ONLY a JSON array of the three chosen cocktail names, like ["Cocktail Name 1", "Cocktail Name 2", "Cocktail Name 3"].`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('Sending prompt to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini API response:', text);

    let recommendedNames;
    try {
      const jsonMatch = text.match(/\[.*\]/);
      if (jsonMatch) {
        recommendedNames = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in response');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      recommendedNames = cocktailNames.slice(0, 3);
    }

    const recommendedCocktails = recommendedNames
      .map(name => cocktailsData.find(cocktail => cocktail.name === name))
      .filter(Boolean);

    if (recommendedCocktails.length < 3) {
      const remainingCocktails = cocktailsData.filter(
        cocktail => !recommendedCocktails.find(rec => rec.name === cocktail.name)
      );
      while (recommendedCocktails.length < 3 && remainingCocktails.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingCocktails.length);
        recommendedCocktails.push(remainingCocktails.splice(randomIndex, 1)[0]);
      }
    }

    res.json(recommendedCocktails.slice(0, 3));
  } catch (error) {
    console.error('Error generating cocktail recommendations:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to generate cocktail recommendations',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
};



