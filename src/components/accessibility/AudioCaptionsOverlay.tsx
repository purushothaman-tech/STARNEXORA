import React from 'react';
import { Volume2, VolumeX, Pause, Play, Square, Subtitles, X, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AudioCaptionsOverlay: React.FC = () => {
  const {
    accessibility,
    activeCaption,
    isSpeaking,
    speechPaused,
    pauseSpeaking,
    resumeSpeaking,
    stopSpeaking,
    speakText,
  } = useApp();

  if (!accessibility.captions || !activeCaption) return null;

  return (
    <aside
      aria-label="Live Audio Captions and Transcript"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-slate-950/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md animate-in slide-from-bottom-3"
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] font-bold text-teal-400">
        <div className="flex items-center gap-1.5">
          <Subtitles className="w-3.5 h-3.5 text-teal-400" />
          <span>Live Speech Transcript / Captions</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          {speechPaused ? (
            <button
              onClick={resumeSpeaking}
              aria-label="Resume audio"
              className="p-1 hover:text-white rounded"
              title="Resume Audio (Play)"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          ) : isSpeaking ? (
            <button
              onClick={pauseSpeaking}
              aria-label="Pause audio"
              className="p-1 hover:text-white rounded"
              title="Pause Audio"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => speakText(activeCaption)}
              aria-label="Play audio"
              className="p-1 hover:text-white rounded"
              title="Play Audio"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => speakText(activeCaption)}
            aria-label="Replay audio"
            className="p-1 hover:text-teal-300 rounded"
            title="Replay Audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={stopSpeaking}
            aria-label="Stop audio and close captions"
            className="p-1 hover:text-rose-400 rounded"
            title="Stop Audio"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-100 font-medium leading-relaxed font-sans">
        &ldquo;{activeCaption}&rdquo;
      </p>
    </aside>
  );
};
