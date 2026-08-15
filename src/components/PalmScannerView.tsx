import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Upload,
  Camera,
  Sliders,
  Sparkles,
  Hand,
  ArrowRight,
  Activity,
  Info,
} from "lucide-react";

import { PalmAnalysisResult, PalmLineDetected } from "../types";
import { uploadPalmImage, analyzePalmImage } from "../services/api";

interface PalmScannerViewProps {
  onAnalysisComplete: (result: PalmAnalysisResult) => void;
  setActiveTab: (tab: string) => void;
  currentAnalysis?: PalmAnalysisResult;
}

interface BackendPalmAnalysis {
  id: number;
  user_id: number;
  hand: string;
  features: {
    thumb_length: number;
    index_length: number;
    middle_length: number;
    ring_length: number;
    pinky_length: number;
    palm_width: number;
    palm_height: number;
    aspect_ratio: number;
    [key: string]: number;
  };
  interpretation: {
    personality?: string;
    love?: string;
    intelligence?: string;
    health?: string;
    career?: string;
    summary?: string;
    [key: string]: string | undefined;
  };
  image_path: string;
}

export const PalmScannerView: React.FC<PalmScannerViewProps> = ({
  onAnalysisComplete,
  setActiveTab,
  currentAnalysis,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    currentAnalysis?.processedImageUrl || null,
  );

  const [analysis, setAnalysis] = useState<PalmAnalysisResult | null>(
    currentAnalysis || null,
  );

  const [backendAnalysis, setBackendAnalysis] =
    useState<BackendPalmAnalysis | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);

  /*
   * IMPORTANT:
   * Keep the MediaStream in its own ref.
   *
   * The old implementation tried to attach the stream to
   * videoRef immediately, but the <video> element does not
   * exist until isCameraActive becomes true.
   */
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const [isVideoReady, setIsVideoReady] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedLine, setSelectedLine] = useState<PalmLineDetected | null>(
    null,
  );

  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [showBoundingBox, setShowBoundingBox] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  /*
   * ---------------------------------------------------------
   * Convert backend response into frontend type
   * ---------------------------------------------------------
   */
  const convertBackendResultToFrontendResult = (
    result: BackendPalmAnalysis,
    processedImageUrl: string,
  ): PalmAnalysisResult => {
    const frontendResult = {
      processedImageUrl,

      palmClass: "Palm Analysis",

      handLandmarks: {
        overallConfidence: 100,
        handOrientation: result.hand || "Unknown",
      },

      lines: [] as PalmLineDetected[],

      backendAnalysisId: result.id,
      backendFeatures: result.features,
      backendInterpretation: result.interpretation,
    } as unknown as PalmAnalysisResult;

    return frontendResult;
  };

  /*
   * ---------------------------------------------------------
   * Convert browser image/data URL to File
   * ---------------------------------------------------------
   */
  const dataUrlToFile = async (
    dataUrl: string,
    fileName: string,
  ): Promise<File> => {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error("Unable to convert captured image.");
    }

    const blob = await response.blob();

    return new File([blob], fileName, {
      type: blob.type || "image/jpeg",
    });
  };

  /*
   * ---------------------------------------------------------
   * REAL BACKEND PALM ANALYSIS
   * ---------------------------------------------------------
   */
  const analyzeFileWithBackend = async (file: File, previewUrl: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error(
          "You are not logged in. Please sign in before analyzing a palm.",
        );
      }

      /*
       * STEP 1 — Upload image
       */
      const uploadResult = await uploadPalmImage(file, token);

      console.log("Palm upload successful:", uploadResult);

      if (!uploadResult?.id) {
        throw new Error(
          "Palm image upload succeeded but no image ID was returned.",
        );
      }

      /*
       * STEP 2 — Analyze uploaded image
       */
      const result = await analyzePalmImage(uploadResult.id, token);

      console.log("Palm analysis successful:", result);

      /*
       * STEP 3 — Normalize backend response
       */
      const rawResult = result as BackendPalmAnalysis & {
        data?: BackendPalmAnalysis | null;
      };

      const realBackendResult = rawResult?.data ?? rawResult;

      if (!realBackendResult || typeof realBackendResult !== "object") {
        throw new Error(
          "The palm analysis backend returned an invalid response.",
        );
      }

      const normalizedBackendResult: BackendPalmAnalysis = {
        ...realBackendResult,

        features:
          realBackendResult.features &&
          typeof realBackendResult.features === "object"
            ? realBackendResult.features
            : {},

        interpretation:
          realBackendResult.interpretation &&
          typeof realBackendResult.interpretation === "object"
            ? realBackendResult.interpretation
            : {},
      };

      setBackendAnalysis(normalizedBackendResult);

      /*
       * STEP 4 — Preserve existing frontend state
       */
      const frontendResult = convertBackendResultToFrontendResult(
        normalizedBackendResult,
        previewUrl,
      );

      setImageSrc(previewUrl);
      setAnalysis(frontendResult);
      setSelectedLine(null);

      onAnalysisComplete(frontendResult);

      console.log(
        "Palm analysis completed and frontend state updated:",
        frontendResult,
      );
    } catch (err) {
      console.error("Palm backend analysis error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Palm analysis failed. Please try again.";

      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * File Upload
   * ---------------------------------------------------------
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    /*
     * Stop camera if user uploads an image while camera
     * is running.
     */
    stopCamera();

    const previewUrl = URL.createObjectURL(file);

    setImageSrc(previewUrl);
    setAnalysis(null);
    setBackendAnalysis(null);
    setSelectedLine(null);
    setError(null);

    analyzeFileWithBackend(file, previewUrl);
  };

  /*
   * ---------------------------------------------------------
   * Sample Palm
   * ---------------------------------------------------------
   */
  const loadDefaultSamplePalm = () => {
    setError(
      "The sample palm is only a frontend demo image. Please upload a real palm photograph for backend analysis.",
    );
  };

  /*
   * ---------------------------------------------------------
   * STOP CAMERA
   * ---------------------------------------------------------
   */
  const stopCamera = () => {
    console.log("Stopping camera...");

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      cameraStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setIsVideoReady(false);
    setIsCameraActive(false);

    console.log("Camera stopped.");
  };

  /*
   * ---------------------------------------------------------
   * START CAMERA
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   *
   * 1. Get the MediaStream.
   * 2. Store it in cameraStreamRef.
   * 3. Set isCameraActive(true).
   * 4. React renders <video>.
   * 5. The useEffect below attaches the stream to <video>.
   *
   * This fixes the original bug.
   */
  const toggleCamera = async () => {
    if (isCameraActive) {
      stopCamera();
      return;
    }

    setError(null);
    setIsVideoReady(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(
        "Camera access is not supported by this browser. Please upload a palm photo instead.",
      );
      return;
    }

    try {
      console.log("Requesting camera access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
        },
        audio: false,
      });

      console.log("Camera stream received:", stream);

      const videoTrack = stream.getVideoTracks()[0];

      if (!videoTrack) {
        stream.getTracks().forEach((track) => track.stop());

        throw new Error("No video track was returned by the camera.");
      }

      console.log("Camera track:", videoTrack.label);

      cameraStreamRef.current = stream;

      /*
       * This causes the <video> element to be rendered.
       */
      setIsCameraActive(true);

      setError(null);
    } catch (err) {
      console.error("Camera error:", err);

      let message = "Camera access failed. Please upload a palm photo instead.";

      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          message =
            "Camera permission was denied. Please allow camera access in Chrome and try again.";
        } else if (err.name === "NotFoundError") {
          message = "No camera was found on this device.";
        } else if (err.name === "NotReadableError") {
          message = "The camera is already being used by another application.";
        } else if (err.name === "OverconstrainedError") {
          message =
            "The requested camera settings are not supported. Please try again.";
        } else if (err.name === "SecurityError") {
          message =
            "Camera access was blocked by the browser security settings.";
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      setIsCameraActive(false);
      cameraStreamRef.current = null;
    }
  };

  /*
   * ---------------------------------------------------------
   * ATTACH STREAM TO VIDEO AFTER VIDEO IS RENDERED
   * ---------------------------------------------------------
   *
   * This is the main fix.
   */
  useEffect(() => {
    if (!isCameraActive) {
      return;
    }

    const video = videoRef.current;
    const stream = cameraStreamRef.current;

    if (!video || !stream) {
      console.warn(
        "Camera is active but video element or stream is not ready yet.",
      );
      return;
    }

    console.log("Attaching MediaStream to video element...");

    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    const handleLoadedMetadata = async () => {
      console.log(
        "Video metadata loaded:",
        video.videoWidth,
        "x",
        video.videoHeight,
      );

      try {
        await video.play();

        console.log(
          "Video playback started:",
          video.videoWidth,
          "x",
          video.videoHeight,
        );

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          setIsVideoReady(true);
          setError(null);
        }
      } catch (err) {
        console.error("Video play error:", err);

        setError(
          "Camera opened, but the video preview could not start. Please try again.",
        );

        setIsVideoReady(false);
      }
    };

    const handleCanPlay = () => {
      console.log("Camera can play:", video.videoWidth, "x", video.videoHeight);

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setIsVideoReady(true);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    video.addEventListener("canplay", handleCanPlay);

    /*
     * In some browsers metadata may already be available.
     */
    if (video.readyState >= 1) {
      void handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);

      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [isCameraActive]);

  /*
   * ---------------------------------------------------------
   * CAPTURE CAMERA FRAME
   * ---------------------------------------------------------
   */
  const captureCameraFrame = async () => {
    const video = videoRef.current;

    if (!video) {
      setError(
        "Camera video element is not available. Please restart the camera.",
      );
      return;
    }

    /*
     * Do not capture until the actual video dimensions exist.
     */
    if (
      !isVideoReady ||
      video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      console.warn("Camera frame not ready:", {
        isVideoReady,
        readyState: video.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });

      setError(
        "Camera frame is not ready. Please wait until the live preview appears.",
      );

      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      console.log(
        "Capturing camera frame:",
        video.videoWidth,
        "x",
        video.videoHeight,
      );

      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to create image capture canvas.");
      }

      /*
       * IMPORTANT:
       *
       * The <video> preview is mirrored using CSS only.
       * We intentionally do NOT flip the canvas.
       *
       * MediaPipe receives the real camera frame.
       */
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frameUrl = canvas.toDataURL("image/jpeg", 0.92);

      console.log("Camera frame captured successfully.");

      setImageSrc(frameUrl);

      /*
       * Stop camera after capture.
       */
      stopCamera();

      /*
       * Convert captured image into File.
       */
      const file = await dataUrlToFile(
        frameUrl,
        `palm-camera-${Date.now()}.jpg`,
      );

      /*
       * Send to the same backend pipeline used by uploads.
       */
      await analyzeFileWithBackend(file, frameUrl);
    } catch (err) {
      console.error("Camera palm analysis error:", err);

      setError(
        err instanceof Error ? err.message : "Camera palm analysis failed.",
      );

      setIsProcessing(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * STOP CAMERA WHEN COMPONENT UNMOUNTS
   * ---------------------------------------------------------
   */
  useEffect(() => {
    return () => {
      console.log("PalmScannerView unmounting - stopping camera.");

      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());

        cameraStreamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */
  return (
    <div className="space-y-8 pb-12 text-slate-100">
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
            Upload your palm photo or capture a live image to evaluate your palm
            measurements and personalized interpretation.
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
            disabled={isProcessing}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer border ${
              isCameraActive
                ? "bg-red-950 text-red-400 border-red-500/50"
                : "bg-slate-900 text-purple-300 border-purple-500/40"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Camera className="w-4 h-4" />

            <span>{isCameraActive ? "Stop Camera" : "Live Camera"}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}

      {error && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-300 flex items-start gap-3"
        >
          <Info className="w-5 h-5 flex-shrink-0" />

          <span>{error}</span>
        </motion.div>
      )}

      {/* Live Camera */}

      {isCameraActive && (
        <div className="rounded-3xl border border-purple-500/40 bg-slate-950 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase">
              LIVE CAMERA FEED
            </span>

            <span
              className={`text-xs font-mono ${
                isVideoReady
                  ? "text-emerald-400 animate-pulse"
                  : "text-amber-400"
              }`}
            >
              {isVideoReady ? "● CAMERA READY" : "● STARTING CAMERA..."}
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-black max-w-2xl mx-auto border border-purple-500/30 min-h-[300px] flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto min-h-[300px] object-contain transform -scale-x-100"
            />

            {!isVideoReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                <Camera className="w-10 h-10 text-cyan-400 animate-pulse mb-3" />

                <span className="text-sm font-mono text-cyan-300">
                  STARTING CAMERA...
                </span>

                <span className="text-xs text-slate-500 mt-1">
                  Please wait a moment
                </span>
              </div>
            )}

            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-cyan-400/40 rounded-2xl m-8 flex items-center justify-center">
              <span className="text-xs font-mono text-cyan-300/80 bg-black/60 px-3 py-1 rounded">
                CENTER PALM IN FRAME
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={captureCameraFrame}
              disabled={isProcessing || !isVideoReady}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-sm shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isProcessing
                ? "ANALYZING..."
                : isVideoReady
                  ? "Capture & Analyze Palm"
                  : "Waiting for Camera..."}
            </button>
          </div>
        </div>
      )}

      {/* Main Analysis Display */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}

        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl border border-cyan-500/30 bg-slate-950 p-4 shadow-2xl overflow-hidden flex items-center justify-center min-h-[480px]">
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center gap-3">
                <Sparkles className="w-10 h-10 text-cyan-400 animate-spin" />

                <span className="text-sm font-mono font-bold text-cyan-300">
                  UPLOADING & ANALYZING PALM...
                </span>

                <span className="text-xs text-slate-500 font-mono">
                  Processing with the FastAPI palm analysis engine
                </span>
              </div>
            )}

            {!imageSrc ? (
              <div className="p-12 text-center space-y-4 max-w-md">
                <div className="w-20 h-20 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <Hand className="w-10 h-10 text-cyan-400" />
                </div>

                <h3 className="text-xl font-bold text-white">
                  No Palm Image Selected
                </h3>

                <p className="text-slate-400 text-xs">
                  Upload a clear image of your dominant palm or use your camera.
                </p>

                <label className="inline-flex px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-bold text-xs font-mono border border-cyan-500/40 transition-all cursor-pointer">
                  Upload Palm Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 bg-slate-900">
                <img
                  src={imageSrc}
                  alt="Palm Analysis"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Display Controls */}

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

        {/* RIGHT */}

        <div className="lg:col-span-5 space-y-6">
          {!backendAnalysis ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500 text-sm font-mono">
              <Activity className="w-8 h-8 mx-auto mb-3 text-slate-600" />
              Waiting for palm image selection...
            </div>
          ) : (
            <>
              {/* Backend Analysis Summary */}

              <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                      PALM ANALYSIS
                    </span>

                    <h3 className="text-2xl font-black text-white">
                      {backendAnalysis.hand} Hand
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                      STATUS
                    </span>

                    <div className="text-sm font-bold text-emerald-400">
                      COMPLETED
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Analysis ID</span>

                    <p className="text-white font-bold">
                      #{backendAnalysis.id}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">User ID</span>

                    <p className="text-white font-bold">
                      #{backendAnalysis.user_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Measurements */}

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
                <h4 className="text-sm font-mono font-bold text-slate-300 uppercase">
                  MEASURED PALM FEATURES
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(backendAnalysis.features ?? {}).map(
                    ([feature, value]) => (
                      <div
                        key={feature}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800"
                      >
                        <span className="text-[10px] text-slate-500 font-mono uppercase">
                          {feature.replace(/_/g, " ")}
                        </span>

                        <p className="text-white font-bold font-mono mt-1">
                          {typeof value === "number"
                            ? value.toFixed(4)
                            : String(value)}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Interpretation */}

              <div className="rounded-3xl border border-purple-500/30 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />

                  <h4 className="text-sm font-mono font-bold text-slate-300 uppercase">
                    PALM INTERPRETATION
                  </h4>
                </div>

                {backendAnalysis.interpretation?.personality && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold">
                      Personality
                    </span>

                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      {backendAnalysis.interpretation.personality}
                    </p>
                  </div>
                )}

                {backendAnalysis.interpretation?.love && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-pink-400 font-mono uppercase font-bold">
                      Love
                    </span>

                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      {backendAnalysis.interpretation.love}
                    </p>
                  </div>
                )}

                {backendAnalysis.interpretation?.intelligence && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-blue-400 font-mono uppercase font-bold">
                      Intelligence
                    </span>

                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      {backendAnalysis.interpretation.intelligence}
                    </p>
                  </div>
                )}

                {backendAnalysis.interpretation?.health && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold">
                      Health
                    </span>

                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      {backendAnalysis.interpretation.health}
                    </p>
                  </div>
                )}

                {backendAnalysis.interpretation?.career && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">
                      Career
                    </span>

                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      {backendAnalysis.interpretation.career}
                    </p>
                  </div>
                )}

                {backendAnalysis.interpretation?.summary && (
                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
                    <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold">
                      Summary
                    </span>

                    <p className="text-sm text-white leading-relaxed mt-1">
                      {backendAnalysis.interpretation.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Backend Information */}

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />

                  <p className="text-xs text-slate-400 leading-relaxed">
                    This result was generated by the connected FastAPI
                    palm-analysis backend. The measurements and interpretations
                    shown here come from the backend response.
                  </p>
                </div>
              </div>

              {/* Continue */}

              <button
                onClick={() => setActiveTab("tarot_sanctuary")}
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
