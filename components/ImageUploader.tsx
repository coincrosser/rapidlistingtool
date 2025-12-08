import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Loader2, Wand2 } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImagesChange: (images: ImageFile[]) => void;
  onOcrTextChange: (text: string) => void;
  images: ImageFile[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, onOcrTextChange, images }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: ImageFile[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const reader = new FileReader();
        
        await new Promise<void>((resolve) => {
          reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove data URL prefix for API
            const base64Data = base64String.split(',')[1];
            
            newImages.push({
              id: Math.random().toString(36).substr(2, 9),
              data: base64Data,
              mimeType: file.type
            });
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
      
      onImagesChange([...images, ...newImages]);
    }
  };

  const handleAnalyze = async () => {
    if (images.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      // Analyze the last uploaded image by default
      const lastImage = images[images.length - 1];
      const text = await analyzeImage(lastImage.data, lastImage.mimeType);
      onOcrTextChange(text);
    } catch (error) {
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeImage = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Upload Button */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-300/30 hover:border-indigo-400 bg-slate-800/50 hover:bg-slate-800 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
            multiple 
          />
          <Camera className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform mb-2" />
          <span className="text-sm font-medium text-slate-300">Add Photos</span>
        </div>

        {/* OCR Button */}
        <button 
          onClick={handleAnalyze}
          disabled={images.length === 0 || isAnalyzing}
          className={`
            border-2 border-indigo-500/30 bg-indigo-900/20 hover:bg-indigo-900/40 
            rounded-xl p-6 flex flex-col items-center justify-center transition-all
            ${(images.length === 0 || isAnalyzing) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-400'}
          `}
        >
          {isAnalyzing ? (
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-2" />
          ) : (
            <Wand2 className="w-8 h-8 text-purple-400 mb-2" />
          )}
          <span className="text-sm font-medium text-purple-200">
            {isAnalyzing ? "Analyzing..." : "Scan Text (AI)"}
          </span>
        </button>
      </div>

      {/* Preview Strip */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img) => (
            <div key={img.id} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-slate-600">
              <img 
                src={`data:${img.mimeType};base64,${img.data}`} 
                alt="Upload preview" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => removeImage(img.id)}
                className="absolute top-0 right-0 bg-black/60 text-white p-1 hover:bg-red-600 transition-colors"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
