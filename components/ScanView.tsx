import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { analyzePlantImage } from '../services/geminiService';
import { PlantAnalysis } from '../types';

interface ScanViewProps {
  onScanComplete: (result: PlantAnalysis, image: string) => void;
}

export const ScanView: React.FC<ScanViewProps> = ({ onScanComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Refs for two different inputs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCamera = () => {
    cameraInputRef.current?.click();
  };

  const triggerGallery = () => {
    galleryInputRef.current?.click();
  };

  const handleAnalysis = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzePlantImage(image);
      onScanComplete(result, image);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Something went wrong during analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setImage(null);
    // Reset inputs so the same file can be selected again if needed
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-stone-800">Plant Doctor</h2>
        <p className="text-stone-500">Take a photo or upload from gallery to diagnose.</p>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {!image ? (
          <div className="space-y-4">
            {/* Camera Option */}
            <div 
              onClick={triggerCamera}
              className="border-2 border-dashed border-emerald-200 rounded-3xl bg-emerald-50 h-48 flex flex-col items-center justify-center space-y-3 cursor-pointer hover:bg-emerald-100 transition-colors active:scale-95 transform duration-200"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                <Camera size={32} />
              </div>
              <div>
                <p className="text-emerald-800 font-bold text-lg text-center">Take Photo</p>
                <p className="text-emerald-600/60 text-xs text-center">Use Camera</p>
              </div>
            </div>

            {/* Gallery Option */}
            <div 
              onClick={triggerGallery}
              className="border-2 border-dashed border-stone-200 rounded-3xl bg-white h-32 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-stone-50 transition-colors active:scale-95 transform duration-200"
            >
              <div className="flex items-center space-x-2 text-stone-600">
                <ImageIcon size={24} />
                <span className="font-bold">Upload from Gallery</span>
              </div>
              <p className="text-stone-400 text-xs">Supports JPG, PNG</p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden shadow-xl h-96 bg-black group">
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={resetScan}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-xs opacity-80 text-center">Tap X to retake</p>
            </div>
          </div>
        )}
        
        {/* Input for Camera (forces environment capture on mobile) */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment"
          className="hidden" 
          ref={cameraInputRef}
          onChange={handleImageUpload}
        />

        {/* Input for Gallery (allows file selection) */}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={galleryInputRef}
          onChange={handleImageUpload}
        />
      </div>

      <div className="space-y-3 pb-20">
        <button
          onClick={handleAnalysis}
          disabled={!image || isAnalyzing}
          className={`w-full py-4 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg transition-all transform active:scale-95 ${
            !image || isAnalyzing 
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Analyzing Plant...
            </>
          ) : (
            <>
              <Upload className="mr-2" />
              Analyze Plant
            </>
          )}
        </button>
      </div>
    </div>
  );
};