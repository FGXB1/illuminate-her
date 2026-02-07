'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

interface CompanyData {
  capital: string;
  ceo: string;
  stockPrice: string;
  headquarters: string;
  description: string;
}

const mockData: Record<string, CompanyData> = {
  "JPMorgan Chase": {
    capital: "$3.9 Trillion (Assets)",
    ceo: "Jamie Dimon",
    stockPrice: "$175.24",
    headquarters: "270 Park Avenue, New York, NY",
    description: "JPMorgan Chase & Co. is an American multinational finance corporation and is the largest bank in the United States."
  },
  "Goldman Sachs": {
    capital: "$1.6 Trillion (Assets)",
    ceo: "David Solomon",
    stockPrice: "$385.12",
    headquarters: "200 West Street, New York, NY",
    description: "The Goldman Sachs Group, Inc. is a leading global investment banking, securities and investment management firm."
  },
  "Morgan Stanley": {
    capital: "$1.2 Trillion (Assets)",
    ceo: "Ted Pick",
    stockPrice: "$92.45",
    headquarters: "1585 Broadway, New York, NY",
    description: "Morgan Stanley is an American multinational investment bank and financial services company."
  },
  "Citigroup": {
    capital: "$2.4 Trillion (Assets)",
    ceo: "Jane Fraser",
    stockPrice: "$55.30",
    headquarters: "388 Greenwich Street, New York, NY",
    description: "Citigroup Inc. is an American multinational investment bank and financial services corporation."
  }
};

export async function getCompanyData(companyName: string): Promise<CompanyData> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Provide a JSON summary for the investment bank "${companyName}".
      Include the following fields:
      - capital (e.g. Total Assets in Trillions)
      - ceo (Current CEO Name)
      - stockPrice (Estimated current stock price with currency symbol)
      - headquarters (Address in NYC if applicable)
      - description (A one sentence summary of what they do)

      Return ONLY the JSON object. Do not use markdown code blocks.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up potential markdown formatting
      const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

      return JSON.parse(jsonString) as CompanyData;
    } catch (error) {
      console.error("Error fetching data from Gemini:", error);
      // Fallback to mock data if API fails
      return mockData[companyName] || {
        capital: "Unknown",
        ceo: "Unknown",
        stockPrice: "Unknown",
        headquarters: "Wall Street, NY",
        description: "Data unavailable."
      };
    }
  }

  // Return mock data if no API key is present
  // Simulate a delay to feel like an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockData[companyName] || {
      capital: "N/A",
      ceo: "N/A",
      stockPrice: "N/A",
      headquarters: "Wall Street",
      description: "Company information not found in mock database."
  };
}
