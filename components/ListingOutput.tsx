import React, { useState } from 'react';
import { GeneratedListings } from '../types';
import { Copy, Check } from 'lucide-react';

interface Props {
  listings: GeneratedListings;
}

export const ListingOutput: React.FC<Props> = ({ listings }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const PlatformCard = ({ title, contentKey, label }: { title: string, contentKey: keyof GeneratedListings, label: string }) => {
    const content = listings[contentKey];
    const isCopied = copiedKey === contentKey;

    return (
      <div className="mb-4 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
          <button 
            onClick={() => handleCopy(content, contentKey)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${isCopied ? 'bg-green-900/50 text-green-400' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
          >
            {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {isCopied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="bg-slate-900 rounded p-2 text-sm text-slate-300 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto border border-slate-800">
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-blue-400">eBay</span>
        </h3>
        <PlatformCard title="eBay Title" contentKey="ebayTitle" label="Title" />
        <PlatformCard title="eBay Description" contentKey="ebayDescription" label="Description (HTML Ready)" />
      </div>

      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-blue-500">Facebook Marketplace</span>
        </h3>
        <PlatformCard title="FB Title" contentKey="facebookTitle" label="Title" />
        <PlatformCard title="FB Description" contentKey="facebookDescription" label="Description" />
      </div>

      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-purple-400">Craigslist</span>
        </h3>
        <PlatformCard title="CL Title" contentKey="craigslistTitle" label="Title" />
        <PlatformCard title="CL Description" contentKey="craigslistDescription" label="Description" />
      </div>
    </div>
  );
};
