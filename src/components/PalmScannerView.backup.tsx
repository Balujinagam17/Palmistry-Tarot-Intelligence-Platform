import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { PalmAnalysisResult, PalmLineDetected } from '../types';
import { processPalmImage, renderLandmarksAndLines } from '../utils/computerVision';
import {
  Upload,
  Camera,
  Eye,
  Sliders,
  Sparkles,
  Hand,
  ArrowRight,
  Maximize2,
  Activity,
  Info,
} from 'lucide-react';

interface PalmScannerViewProps {
  onAnalysisComplete: (result: PalmAnalysisResult) => void;
  setActiveTab: (tab: string) => void;
  currentAnalysis?: PalmAnalysisResult;
}

export const PalmScannerView: React.FC<PalmScannerViewProps> = ({
  onAnalysisComplete,
  setActiveTab,
  currentAnalysis,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    currentAnalysis?.processedImageUrl || null
  );
  const [analysis, setAnalysis] = useState<PalmAnalysisResult | null>(currentAnalysis || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedLine, setSelectedLine] = useState<PalmLineDetected | null>(null);

  // Overlay Toggles
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [showBoundingBox, setShowBoundingBox] = useState(true);

  // Canvas Refs
  const imgRef = useRef<HTMLImageElement | null>(null);
  const hiddenProcessingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Trigger Palm Analysis
  const analyzeImage = (src: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        if (!hiddenProcessingCanvasRef.current) return;
        const result = processPalmImage(hiddenProcessingCanvasRef.current, img);
        result.processedImageUrl = src;
        setAnalysis(result);
        setSelectedLine(result.lines[0] || null);
        onAnalysisComplete(result);
      } catch (err) {
        console.error('Palm Analysis Error:', err);
      } finally {
        setIsProcessing(false);
      }
    };
    img.src = src;
  };

  // Re-render Canvas Overlays whenever state or toggles change
  useEffect(() => {
    if (!analysis || !overlayCanvasRef.current || !imgRef.current) return;

    const overlayCanvas = overlayCanvasRef.current;
    const img = imgRef.current;

    overlayCanvas.width = img.clientWidth || 600;
    overlayCanvas.height = img.clientHeight || 600;

    renderLandmarksAndLines(
      overlayCanvas,
      analysis,
      showLandmarks,
      showLines,
      showBoundingBox
    );
  }, [analysis, showLandmarks, showLines, showBoundingBox, imageSrc]);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageSrc(result);
        analyzeImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample Palm Loader
  const loadDefaultSamplePalm = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(400, 400, 50, 400, 400, 400);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 800);

      // Palm Silhouette
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(400, 450, 220, 260, 0, 0, Math.PI * 2);
      ctx.fill();

      // Finger silhouettes
      ctx.fillRect(220, 100, 60, 260);
      ctx.fillRect(300, 60, 60, 300);
      ctx.fillRect(380, 40, 60, 320);
      ctx.fillRect(460, 70, 60, 290);
      ctx.fillRect(540, 140, 50, 220);

      const sampleUrl = canvas.toDataURL();
      setImageSrc(sampleUrl);
      analyzeImage(sampleUrl);
    }
  };

  // Live Camera Controls
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 720 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } catch (err) {
        alert('Camera access denied or unavailable. Please upload a photo.');
      }
    }
  };

  const captureCameraFrame = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 800;
      canvas.height = video.videoHeight || 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameUrl = canvas.toDataURL();
        setImageSrc(frameUrl);
        analyzeImage(frameUrl);
        toggleCamera();
      }
    }
  };

  return (
    <div className="space-y-8 pb-12 text-slate-100">
      {/* Hidden processing canvas */}
      <canvas ref={hiddenProcessingCanvasRef} className="hidden" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-1">
            <Hand className="w-4 h-4" />
            <span>PALM VISION ANALYSIS</span>
          </div>
          <h1 className="text-2xl lg:text-4xl font-black text-white">
            Palm Line & Elemental Analysis
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload your palm photo or capture a live image to evaluate your major lines, hand element classification, and energy balance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadDefaultSamplePalm}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30 transition-all cursor-pointer"
          >
            Load Sample Palm
          </button>
          <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold font-mono transition-all shadow-lg flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={toggleCamera}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer border ${
              isCameraActive
                ? 'bg-red-950 text-red-400 border-red-500/50'
                : 'bg-slate-900 text-purple-300 border-purple-500/40'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{isCameraActive ? 'Stop Camera' : 'Live Camera'}</span>
          </button>
        </div>
      </div>

      {/* Live Video Modal Stream if Active */}
      {isCameraActive && (
        <div className="rounded-3xl border border-purple-500/40 bg-slate-950 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase">LIVE CAMERA FEED</span>
            <span className="text-xs font-mono text-emerald-400 animate-pulse">● CAMERA ONLINE</span>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-black max-w-2xl mx-auto border border-purple-500/30">
            <video ref={videoRef} className="w-full h-auto transform -scale-x-100" />
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-cyan-400/40 rounded-2xl m-8 flex items-center justify-center">
              <span className="text-xs font-mono text-cyan-300/80 bg-black/60 px-3 py-1 rounded">
                CENTER PALM IN FRAME
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={captureCameraFrame}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              Capture & Analyze Palm
            </button>
          </div>
        </div>
      )}

      {/* Main Analysis Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Canvas Viewer & Overlay Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl border border-cyan-500/30 bg-slate-950 p-4 shadow-2xl overflow-hidden flex items-center justify-center min-h-[480px]">
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center gap-3">
                <Sparkles className="w-10 h-10 text-cyan-400 animate-spin" />
                <span className="text-sm font-mono font-bold text-cyan-300">
                  ANALYZING PALM STRUCTURE & ENERGY CONTOURS...
                </span>
              </div>
            )}

            {!imageSrc ? (
              <div className="p-12 text-center space-y-4 max-w-md">
                <div className="w-20 h-20 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <Hand className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white">No Palm Image Selected</h3>
                <p className="text-slate-400 text-xs">
                  Upload a clear image of your dominant palm, use your camera, or click 'Load Sample Palm' above.
                </p>
                <button
                  onClick={loadDefaultSamplePalm}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-bold text-xs font-mono border border-cyan-500/40 transition-all cursor-pointer"
                >
                  Load Sample Palm Image
                </button>
              </div>
            ) : (
              <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 bg-slate-900">
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Palm Analysis"
                  className="w-full h-full object-contain"
                />
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
              </div>
            )}
          </div>

          {/* Overlay Controls */}
          {analysis && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>DISPLAY CONTROLS</span>
              </span>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={showLandmarks}
                    onChange={(e) => setShowLandmarks(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Landmark Nodes</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={showLines}
                    onChange={(e) => setShowLines(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Major Lines</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={showBoundingBox}
                    onChange={(e) => setShowBoundingBox(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Palm Contour</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Line Inspector & Results */}
        <div className="lg:col-span-5 space-y-6">
          {!analysis ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500 text-sm font-mono">
              Waiting for palm image selection...
            </div>
          ) : (
            <>
              {/* Hand Shape & Confidence Summary */}
              <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                      PALM ELEMENT TYPE
                    </span>
                    <h3 className="text-2xl font-black text-white">
                      {analysis.palmClass} Hand Element
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                      READING RESONANCE
                    </span>
                    <div className="text-xl font-bold text-emerald-400">
                      {analysis.handLandmarks.overallConfidence}%
                    </div>
                  </div>
                </div>

                {/* Feature Score Meters */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Hand Orientation</span>
                    <p className="text-white font-bold">{analysis.handLandmarks.handOrientation} Hand</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Major Lines Found</span>
                    <p className="text-white font-bold">{analysis.lines.length} Lines Mapped</p>
                  </div>
                </div>
              </div>

              {/* Detected Lines Selector List */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
                <h4 className="text-sm font-mono font-bold text-slate-300 uppercase flex items-center justify-between">
                  <span>MAJOR PALM LINES</span>
                  <span className="text-xs text-cyan-400">Select to inspect</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {analysis.lines.map((line) => {
                    const isSelected = selectedLine?.id === line.id;
                    return (
                      <button
                        key={line.id}
                        onClick={() => setSelectedLine(line)}
                        className={`p-2.5 rounded-xl text-left border text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 text-white border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: line.color }}
                          />
                          <span>{line.displayName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Depth: {line.depthScore}%
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Line Detail Box */}
                {selectedLine && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white text-sm flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: selectedLine.color }}
                        />
                        <span>{selectedLine.title}</span>
                      </h5>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        CLARITY: {selectedLine.clarityConfidence}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{selectedLine.meaning}</p>
                  </div>
                )}
              </div>

              {/* Proceed Action Button */}
              <button
                onClick={() => setActiveTab('tarot_sanctuary')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
              >
                <span>PROCEED TO TAROT SPREAD</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
