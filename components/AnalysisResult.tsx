import React from 'react';
import { PlantAnalysis } from '../types';
import { CheckCircle, AlertTriangle, HelpCircle, ArrowLeft, Thermometer, Droplets, Volume2, Youtube, ExternalLink, ArrowRight, Users, Share2 } from 'lucide-react';

interface AnalysisResultProps {
  result: PlantAnalysis;
  image: string;
  onBack: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, image, onBack }) => {
  const isHealthy = result.healthStatus === 'Healthy';
  const isUnknown = result.healthStatus === 'Unknown';

  const speakResult = () => {
    const text = `This looks like ${result.plantName}. It appears to be ${result.healthStatus}. ${result.description}`;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 overflow-y-auto no-scrollbar pb-24">
      {/* Header Image */}
      <div className="relative h-72 w-full">
        <img src={image} alt="Analyzed Plant" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1 shadow-sm">{result.plantName}</h1>
              <p className="text-stone-300 italic text-sm">{result.scientificName}</p>
            </div>
            <button onClick={speakResult} className="bg-emerald-500 p-3 rounded-full text-white shadow-lg shadow-emerald-900/20 active:scale-95 transition-transform">
              <Volume2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold ${
              isHealthy ? 'bg-green-100 text-green-700' :
              isUnknown ? 'bg-stone-100 text-stone-600' :
              'bg-red-100 text-red-700'
            }`}>
              {isHealthy ? <CheckCircle size={18} /> : isUnknown ? <HelpCircle size={18} /> : <AlertTriangle size={18} />}
              <span>{result.healthStatus}</span>
            </div>
            <span className="text-stone-400 font-semibold text-sm">
              {Math.round(result.confidence)}% Confidence
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-800 mb-2">Diagnosis</h3>
              <p className="text-stone-600 leading-relaxed">
                {result.description}
              </p>
            </div>

            {!isHealthy && !isUnknown && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <h3 className="text-red-800 font-bold mb-3 flex items-center">
                  <AlertTriangle size={18} className="mr-2" />
                  Treatment Plan
                </h3>
                <ul className="space-y-3">
                  {result.treatments.map((step, idx) => (
                    <li key={idx} className="flex items-start text-red-700 text-sm">
                      <span className="bg-red-200 text-red-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
             {isHealthy && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                <h3 className="text-green-800 font-bold mb-3 flex items-center">
                  <CheckCircle size={18} className="mr-2" />
                  Care Tips
                </h3>
                <ul className="space-y-3">
                  {result.treatments.map((step, idx) => (
                    <li key={idx} className="flex items-start text-green-700 text-sm">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* YouTube Video Suggestions */}
        {result.youtubeSuggestions && result.youtubeSuggestions.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-bold text-stone-800 flex items-center">
                <Youtube className="mr-2 text-red-600" size={24} />
                Watch How to Fix It
              </h3>
            </div>
            
            <div className="space-y-3">
              {result.youtubeSuggestions.map((video, idx) => (
                <a 
                  key={idx}
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.searchQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start bg-stone-50 rounded-xl p-3 border border-stone-100 hover:border-red-200 hover:bg-red-50/30 transition-all group"
                >
                  {/* Thumbnail placeholder or Icon */}
                  <div className="w-16 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 group-hover:bg-red-200 transition-colors">
                    <Youtube size={24} className="text-red-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-800 text-sm leading-tight mb-1 group-hover:text-red-700 truncate">
                      {video.title}
                    </h4>
                    <p className="text-xs text-stone-500 mb-1 flex items-center">
                      <span className="font-medium bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded text-[10px] mr-2">
                        {video.channelName}
                      </span>
                    </p>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed opacity-80">
                      {video.summary}
                    </p>
                  </div>
                  
                  <div className="self-center ml-2">
                     <ExternalLink size={16} className="text-stone-300 group-hover:text-red-400" />
                  </div>
                </a>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-stone-100 text-center">
               <a 
                 href={`https://www.youtube.com/results?search_query=how+to+treat+${encodeURIComponent(result.diseaseName || result.plantName)}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-sm font-semibold text-red-600 hover:text-red-700 inline-flex items-center"
               >
                 Search more videos on YouTube <ArrowRight size={14} className="ml-1" />
               </a>
            </div>
          </div>
        )}

        {/* Community Share Section */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-stone-800 flex items-center">
              <Users className="mr-2 text-orange-500" size={24} />
              Community Help
            </h3>
          </div>
          <p className="text-stone-500 text-sm mb-4">
            Not sure about the diagnosis? Share your scan with the r/plantclinic community on Reddit to get a second opinion.
          </p>
          <a
            href={`https://www.reddit.com/r/plantclinic/submit?title=${encodeURIComponent(`Help needed: ${result.plantName} issue`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center bg-[#FF4500] hover:bg-[#e03d00] text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-orange-200"
          >
            <Share2 size={18} className="mr-2" />
            Ask on Reddit
          </a>
        </div>

        {/* Environmental conditions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-2">
              <Thermometer size={20} />
            </div>
            <span className="text-xs text-stone-400 font-medium uppercase">Ideal Temp</span>
            <span className="text-stone-800 font-bold">20° - 25°C</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-2">
              <Droplets size={20} />
            </div>
            <span className="text-xs text-stone-400 font-medium uppercase">Watering</span>
            <span className="text-stone-800 font-bold">Twice / Week</span>
          </div>
        </div>
      </div>
    </div>
  );
};