
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageSize } from '../types';

const ImageGenPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('High quality car rental marketing banner, luxury car in front of a modern office building, 4k resolution');
  const [size, setSize] = useState<ImageSize>('1K');
  const [loading, setLoading] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);

  const handleGenerate = async () => {
    // Check if key is selected. High resolution models require a selected API key.
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      // Assume selection successful and proceed due to potential race condition.
    }

    setLoading(true);
    try {
      const img = await generateImage(prompt, size);
      setGeneratedImg(img);
    } catch (error: any) {
      console.error(error);
      // If the request fails with "Requested entity was not found", reset the key selection state.
      if (error?.message?.includes("Requested entity was not found.")) {
        alert("API key project not found. Please ensure you have selected a valid project with billing enabled in the key selection dialog.");
        await window.aistudio.openSelectKey();
      } else {
        alert("Failed to generate image. Please ensure you have selected a valid API key with billing enabled.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6 no-print">
      <h2 className="text-xl font-bold mb-4 flex items-center text-purple-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        AI Marketing Image Generator
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Image Prompt</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 outline-none h-20"
          />
        </div>
        <div className="flex space-x-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700">Resolution</label>
            <select 
              value={size}
              onChange={(e) => setSize(e.target.value as ImageSize)}
              className="mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="1K">1K (Standard - Flash)</option>
              <option value="2K">2K (High Res - Pro)</option>
              <option value="4K">4K (Premium - Pro)</option>
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 mt-5"
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Note: High resolution (2K/4K) requires <code className="bg-gray-100 px-1">gemini-3-pro-image-preview</code>. Ensure your API key is from a project with 
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-purple-600 underline ml-1">billing enabled</a>.
        </p>
        {generatedImg && (
          <div className="mt-4 border-2 border-purple-100 p-2 rounded-lg bg-purple-50">
            <img src={generatedImg} alt="AI Generated" className="w-full h-auto rounded shadow-lg" />
            <a href={generatedImg} download="rental-marketing.png" className="mt-2 inline-block text-purple-700 font-semibold hover:underline">Download Original</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenPanel;
