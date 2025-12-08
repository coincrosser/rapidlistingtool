import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import { X, ScanLine } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string | null>(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.getText());
    },
    onError(err) {
      // Suppress minor scanning errors to avoid UI flicker
      // setError(err.message); 
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-4">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        
        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
          <div className="relative aspect-[4/3] bg-black">
            <video ref={ref} className="w-full h-full object-cover" />
            
            {/* Overlay UI */}
            <div className="absolute inset-0 border-2 border-indigo-500/50 m-8 rounded-lg pointer-events-none flex items-center justify-center">
               <div className="w-full h-0.5 bg-red-500/80 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm font-medium">
              Align barcode within the frame
            </div>
          </div>
          
          <div className="p-4 flex items-center justify-center gap-2 text-slate-300">
            <ScanLine className="w-5 h-5 text-indigo-400" />
            <span>Scanning active...</span>
          </div>

          {error && (
            <div className="p-2 bg-red-900/50 text-red-200 text-center text-xs">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
