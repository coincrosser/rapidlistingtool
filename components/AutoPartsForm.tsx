import React from 'react';
import { AutoPartsData, Condition } from '../types';
import { YEARS, MAKES, POPULAR_MODELS, COMMON_AUTO_CATEGORIES } from '../constants';

interface Props {
  data: AutoPartsData;
  onChange: (data: AutoPartsData) => void;
}

export const AutoPartsForm: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof AutoPartsData, value: string) => {
    // If make changes, reset model
    if (field === 'make') {
      onChange({ ...data, make: value, model: '' });
    } else {
      onChange({ ...data, [field]: value });
    }
  };

  const availableModels = data.make && POPULAR_MODELS[data.make] 
    ? POPULAR_MODELS[data.make] 
    : [];

  return (
    <div className="space-y-4">
      {/* Year / Make / Model Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Year</label>
          <select 
            value={data.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="">Year</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Make</label>
          <select 
            value={data.make}
            onChange={(e) => handleChange('make', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="">Make</option>
            {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Model</label>
          {availableModels.length > 0 ? (
            <select 
              value={data.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              <option value="">Model</option>
              {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
              <option value="Other">Other</option>
            </select>
          ) : (
            <input 
              type="text"
              placeholder="Model"
              value={data.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          )}
        </div>
      </div>

      {/* Trim & Category */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Trim / Engine</label>
          <input 
            type="text"
            placeholder="e.g. EX 2.4L, GT V8"
            value={data.trimEngine}
            onChange={(e) => handleChange('trimEngine', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
          <select 
            value={data.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="">Select Category</option>
            {COMMON_AUTO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Part Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Part Name</label>
        <input 
          type="text"
          placeholder="e.g. Passenger Side Headlight Assembly"
          value={data.partName}
          onChange={(e) => handleChange('partName', e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">OEM Part #</label>
          <input 
            type="text"
            placeholder="e.g. 123-456-789"
            value={data.oemNumber}
            onChange={(e) => handleChange('oemNumber', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Interchange #</label>
          <input 
            type="text"
            placeholder="e.g. 550-12345"
            value={data.interchangeNumber}
            onChange={(e) => handleChange('interchangeNumber', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
          />
        </div>
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
            placeholder="Any specific defects, warranty info, or shelf location..."
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
