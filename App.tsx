import React, { useState } from 'react';
import { Wrench, Package, Sparkles, Loader2, Zap } from 'lucide-react';
import { AutoPartsForm } from './components/AutoPartsForm';
import { GeneralItemsForm } from './components/GeneralItemsForm';
import { ImageUploader } from './components/ImageUploader';
import { ListingOutput } from './components/ListingOutput';
import { AutoPartsData, GeneralItemsData, GeneratedListings, ListingMode, Condition, ImageFile } from './types';
import { generateListings } from './services/geminiService';

const initialAutoData: AutoPartsData = {
  condition: Condition.USED_GOOD,
  additionalNotes: '',
  ocrText: '',
  year: '',
  make: '',
  model: '',
  trimEngine: '',
  category: '',
  partName: '',
  oemNumber: '',
  interchangeNumber: ''
};

const initialGeneralData: GeneralItemsData = {
  condition: Condition.NEW,
  additionalNotes: '',
  ocrText: '',
  upc: '',
  category: '',
  brand: '',
  itemName: '',
  sizeDimensions: ''
};

function App() {
  const [mode, setMode] = useState<ListingMode>(ListingMode.AUTO_PARTS);
  const [autoData, setAutoData] = useState<AutoPartsData>(initialAutoData);
  const [generalData, setGeneralData] = useState<GeneralItemsData>(initialGeneralData);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedListings | null>(null);

  // Helper to handle OCR text update from the shared ImageUploader
  const handleOcrUpdate = (text: string) => {
    if (mode === ListingMode.AUTO_PARTS) {
      setAutoData(prev => ({ ...prev, ocrText: text }));
    } else {
      setGeneralData(prev => ({ ...prev, ocrText: text }));
    }
  };

  // Helper to get current OCR text
  const getCurrentOcrText = () => {
    return mode === ListingMode.AUTO_PARTS ? autoData.ocrText : generalData.ocrText;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResults(null);
    try {
      const currentData = mode === ListingMode.AUTO_PARTS ? autoData : generalData;
      const listings = await generateListings(mode, currentData);
      setResults(listings);
      
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      alert("Error generating listings. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = () => {
    if (mode === ListingMode.AUTO_PARTS) {
      return autoData.partName.length > 0 && autoData.make.length > 0;
    } else {
      return generalData.itemName.length > 0 || generalData.upc.length > 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Zap className="text-yellow-400 fill-yellow-400" />
              RapidListingTool
            </h1>
            <p className="text-slate-400 text-sm mt-1">AI-Powered Reseller Automation Suite</p>
          </div>
          
          {/* Mode Switcher */}
          <div className="bg-slate-900/50 p-1 rounded-xl flex border border-slate-700">
            <button 
              onClick={() => { setMode(ListingMode.AUTO_PARTS); setResults(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                mode === ListingMode.AUTO_PARTS 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Auto Parts
            </button>
            <button 
              onClick={() => { setMode(ListingMode.GENERAL_ITEMS); setResults(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                mode === ListingMode.GENERAL_ITEMS 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              General Items
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Left Column: Input Form */}
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="bg-indigo-500/20 p-1.5 rounded-lg text-indigo-300">1</span>
                Photos & AI Analysis
              </h2>
              <ImageUploader 
                images={images} 
                onImagesChange={setImages} 
                onOcrTextChange={handleOcrUpdate} 
              />
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="bg-indigo-500/20 p-1.5 rounded-lg text-indigo-300">2</span>
                Item Details
              </h2>
              
              {mode === ListingMode.AUTO_PARTS ? (
                <AutoPartsForm data={autoData} onChange={setAutoData} />
              ) : (
                <GeneralItemsForm data={generalData} onChange={setGeneralData} />
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!isFormValid() || isGenerating}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl
                ${!isFormValid() || isGenerating 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-indigo-500/25 transform hover:-translate-y-0.5'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Listings
                </>
              )}
            </button>
          </div>

          {/* Right Column: Output */}
          <div id="results-section">
            {results ? (
              <ListingOutput listings={results} />
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-900/30">
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Ready to Generate</h3>
                <p className="max-w-xs text-sm">Fill in the item details and click generate to create optimized listings for eBay, Facebook, and Craigslist.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
