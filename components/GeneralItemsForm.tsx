import React, { useState } from 'react';
import { GeneralItemsData, Condition } from '../types';
import { COMMON_GENERAL_CATEGORIES } from '../constants';
import { ScanBarcode } from 'lucide-react';
import { BarcodeScanner } from './BarcodeScanner';

interface Props {
  data: GeneralItemsData;
  onChange: (data: GeneralItemsData) => void;
}

export const GeneralItemsForm: React.FC<Props> = ({ data, onChange }) => {
  const [showScanner, setShowScanner] = useState(false);

  const handleChange = (field: keyof GeneralItemsData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleScan = (result: string) => {
    handleChange('upc', result);
    setShowScanner(false);
  };

  return (
    <div className="space-y-4">
      {showScanner && (
        <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
      )}

      {/* UPC Row */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-400 mb-1">UPC / Barcode</label>
          <div className="relative">
            <input 
              type="text"
              placeholder="Scan or type..."
              value={data.upc}
              onChange={(e) => handleChange('upc', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 pl-3 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
            />
          </div>
        </div>
        <button 
          onClick={() => setShowScanner(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
          title="Scan Barcode"
        >
          <ScanBarcode className="w-5 h-5" />
        </button>
      </div>

      {/* Category & Brand */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
          <select 
            value={data.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="">Select Category</option>
            {COMMON_GENERAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Brand</label>
          <input 
            type="text"
            placeholder="e.g. Nike, Sony"
            value={data.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* Item Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Item Name</label>
        <input 
          type="text"
          placeholder="e.g. Wireless Noise Cancelling Headphones"
          value={data.itemName}
          onChange={(e) => handleChange('itemName', e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>

      {/* Size / Dimensions */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Size / Dimensions</label>
        <input 
          type="text"
          placeholder="e.g. Large, 10x12x5 inches"
          value={data.sizeDimensions}
          onChange={(e) => handleChange('sizeDimensions', e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>

      {/* Condition & Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Condition</label>
        <select 
          value={data.condition}
          onChange={(e) => handleChange('condition', e.target.value as Condition)}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
         <label className="block text-xs font-semibold text-slate-400 mb-1">Additional Notes</label>
         <textarea 
            rows={3}
            value={data.additionalNotes}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            placeholder="Description, features, flaws..."
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
         />
      </div>

      {/* OCR Text Display */}
      <div>
         <label className="block text-xs font-semibold text-indigo-300 mb-1">AI Analyzed Text (Editable)</label>
         <textarea 
            rows={2}
            value={data.ocrText}
            onChange={(e) => handleChange('ocrText', e.target.value)}
            placeholder="Text extracted from image will appear here..."
            className="w-full bg-indigo-950/30 border border-indigo-500/30 text-indigo-100 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-mono"
         />
      </div>
    </div>
  );
};
