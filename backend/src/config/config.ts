import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * GEMINI_API_KEY: API key for Gemini, used as the judge model.
 * MISTRAL_API_KEY: API key for Mistral, used as one of the competing models.
 * COHERE_API_KEY: API key for Cohere, used as another competing model.
 */

type CONFIG = {
    readonly GEMINI_API_KEY: string;
    readonly MISTRAL_API_KEY: string;
    readonly COHERE_API_KEY: string;
};

const configs: CONFIG = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || '',
    COHERE_API_KEY: process.env.COHERE_API_KEY || '',
}

export default configs;