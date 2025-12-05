
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlantAnalysis, LocationAnalysis } from "../types";

// Initialize the client. 
// NOTE: In a production environment, this should be proxied through a backend to protect the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PLANT_ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    plantName: { type: Type.STRING, description: "Common name of the plant" },
    scientificName: { type: Type.STRING, description: "Scientific Latin name" },
    healthStatus: { 
      type: Type.STRING, 
      enum: ["Healthy", "Diseased", "Unknown"],
      description: "Overall health condition" 
    },
    diseaseName: { type: Type.STRING, description: "Name of the disease if detected, or 'None'" },
    confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100" },
    treatments: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of recommended treatments or care tips" 
    },
    description: { type: Type.STRING, description: "Brief summary of the analysis" },
    youtubeSuggestions: {
      type: Type.ARRAY,
      description: "List of 3-5 YouTube videos that explain how to fix the specific problem.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Video title (e.g. 'How to Treat Tomato Blight')" },
          channelName: { type: Type.STRING, description: "Name of a trusted agriculture YouTube channel" },
          summary: { type: Type.STRING, description: "One sentence summary of what the video teaches" },
          searchQuery: { type: Type.STRING, description: "Optimized YouTube search query to find this exact topic" }
        },
        required: ["title", "channelName", "summary", "searchQuery"]
      }
    }
  },
  required: ["plantName", "scientificName", "healthStatus", "confidence", "treatments", "description", "youtubeSuggestions"]
};

const LOCATION_ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    locationName: { type: Type.STRING, description: "The formatted address or name of the location" },
    suitabilityScore: { type: Type.NUMBER, description: "Score 0-100 indicating how good conditions are for general farming right now" },
    isSuitableForPlanting: { type: Type.BOOLEAN, description: "True if generally suitable to plant crops now" },
    climateZone: { type: Type.STRING, description: "Brief climate description (e.g. 'Tropical Wet', 'Mediterranean')" },
    soilType: { type: Type.STRING, description: "Likely soil composition for this region (e.g. 'Loamy', 'Sandy Clay')" },
    bestCrops: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 3-5 specific crops that would thrive here right now" 
    },
    reasoning: { type: Type.STRING, description: "Explanation of why this location is suitable or not (temp, humidity, season)" }
  },
  required: ["locationName", "suitabilityScore", "isSuitableForPlanting", "climateZone", "soilType", "bestCrops", "reasoning"]
};

export const analyzePlantImage = async (base64Image: string): Promise<PlantAnalysis> => {
  try {
    // Remove data URL prefix if present for the API call
    const base64Data = base64Image.split(',')[1] || base64Image;

    const model = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          },
          {
            text: `You are an expert agricultural botanist and plant disease specialist.
            
            TASK:
            1. Identify the plant species and scientific name.
            2. Detect any diseases, pests, nutrient deficiencies, or environmental stress.
            3. Explain the problem in simple steps that farmers can understand.
            4. Provide a clear, step-by-step solution to fix the problem.
            
            IMPORTANT — YOUTUBE GUIDANCE:
            5. Recommend 3-5 YouTube videos that demonstrate HOW TO FIX or TREAT the issue.
               - Only suggest videos that likely exist on trusted agriculture channels.
               - Include: Title, Channel Name, Short Summary.
               - Generate a highly specific 'searchQuery' (e.g. "how to cure powdery mildew on roses") for each.
            
            If the image is not a plant, indicate Unknown.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: PLANT_ANALYSIS_SCHEMA,
        temperature: 0.4, 
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(text) as PlantAnalysis;
    return data;

  } catch (error) {
    console.error("Plant Analysis Error:", error);
    // Return a fallback error object to UI
    return {
      plantName: "Analysis Failed",
      scientificName: "Unknown",
      healthStatus: "Unknown",
      confidence: 0,
      treatments: ["Check internet connection", "Ensure API Key is valid", "Try a clearer photo"],
      description: "Could not process image.",
      youtubeSuggestions: []
    };
  }
};

export const analyzeFarmingLocation = async (locationQuery: string): Promise<LocationAnalysis> => {
  try {
    const model = "gemini-2.5-flash";
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{
          text: `You are an expert agronomist and soil scientist. 
          Analyze the agricultural potential for the location: "${locationQuery}".
          
          Context: The current month is ${currentMonth}.
          
          TASK:
          1. Determine the likely climate zone and soil type for this specific region.
          2. Assess if it is currently a good time to plant crops based on the season/weather pattern for this location.
          3. Recommend 3-5 specific crops that would thrive in this location right now.
          4. Provide a suitability score (0-100).
          5. Explain your reasoning briefly (mention temperature, rainfall, or soil quality).`
        }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: LOCATION_ANALYSIS_SCHEMA,
        temperature: 0.5,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");

    return JSON.parse(text) as LocationAnalysis;
  } catch (error) {
    console.error("Location Analysis Error:", error);
    return {
      locationName: locationQuery,
      suitabilityScore: 0,
      isSuitableForPlanting: false,
      climateZone: "Unknown",
      soilType: "Unknown",
      bestCrops: [],
      reasoning: "Unable to analyze this location. Please check your connection and try again."
    };
  }
};
