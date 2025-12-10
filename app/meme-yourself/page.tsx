"use client";

import { useState, useEffect, useRef } from "react";
import { Employee } from "@/lib/types";
import MemeCard from "@/components/MemeCard";
import { useCameraContext } from "@/lib/CameraContext";
import Link from "next/link";

export default function MemeYourselfPage() {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const { selectedEmployeeId, saveImage } = useCameraContext();

  // Fetch employee when selectedEmployeeId changes
  useEffect(() => {
    if (selectedEmployeeId) {
      fetchEmployee(selectedEmployeeId);
    } else {
      setCurrentEmployee(null);
      stopCamera();
    }
  }, [selectedEmployeeId]);

  // Start camera when employee is selected
  useEffect(() => {
    if (currentEmployee) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [currentEmployee]);

  // Handle video ref changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef.current]);

  // Cleanup countdown timer on unmount
  useEffect(() => {
    return () => {
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
      }
    };
  }, []);

  const fetchEmployee = async (id: string) => {
    try {
      const response = await fetch(`/api/employees/${id}`);
      if (response.ok) {
        const employee = await response.json();
        setCurrentEmployee(employee);
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      setError("Failed to load employee data");
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      setStream(mediaStream);
      setError("");
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Failed to access camera. Please grant camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !currentEmployee) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 image
    const imageData = canvas.toDataURL("image/jpeg", 0.9);

    // Set captured image for preview
    setCapturedImage(imageData);
  };

  const startCountdownAndCapture = () => {
    if (!stream || countdown) return;

    let timeLeft = 3;
    setCountdown(timeLeft);

    countdownTimer.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        if (countdownTimer.current) {
          clearInterval(countdownTimer.current);
          countdownTimer.current = null;
        }
        setCountdown(null);
        captureImage();
      } else {
        setCountdown(timeLeft);
      }
    }, 1000);
  };

  const saveCapturedImage = async () => {
    if (!capturedImage || !currentEmployee) return;

    setIsSaving(true);

    try {
      await fetch(`/api/employees/${currentEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: capturedImage }),
      });

      // Save to context for real-time update
      saveImage(capturedImage);

      // Show success message
      alert("Picture saved! ✅ Check the host page to see your meme!");
      setCapturedImage(null);
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save picture. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const retryCapture = () => {
    setCapturedImage(null);
  };

  return (
    <>
      <h1
        className="text-5xl font-bold text-white mb-2"
        style={{ width: "100%", textAlign: "center", marginTop: "28px" }}
      >
        MemedIn
      </h1>
      <div className="p-2" style={{ minHeight: "100vh" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="max-w-full mx-auto">
            {/* Header */}

            <p
              className="text-white/90 text-lg"
              style={{
                width: "100%",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              Strike a pose!
            </p>

            {/* Status Messages */}
            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-6">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {!currentEmployee && (
              <div className="clay-card p-12 text-center">
                <div className="text-6xl mb-6">🎬</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Waiting for Host...
                </h2>
                <p className="text-gray-600 text-lg">
                  The host needs to select a meme from the Main page to activate
                  your camera.
                </p>
              </div>
            )}

            {/* Meme Display with Camera */}
            {currentEmployee && (
              <div
                className="flex flex-col items-center"
                style={{ width: "calc(100vw - 45px)" }}
              >
                <>
                  <MemeCard employee={currentEmployee} isLarge>
                    {countdown && !capturedImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-6xl font-bold">
                        {countdown}
                      </div>
                    )}
                    {capturedImage ? (
                      <img
                        src={capturedImage}
                        alt="Captured"
                        className="w-full h-full object-cover"
                      />
                    ) : stream ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-black">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                          <p>Starting camera...</p>
                        </div>
                      </div>
                    )}
                  </MemeCard>
                </>

                {/* Capture Button */}
                {!capturedImage && (
                  <>
                    <button
                      style={{
                        marginTop: "20px",
                        padding: "10px 15px",
                        fontSize: "18px",
                      }}
                      onClick={startCountdownAndCapture}
                      disabled={!stream || countdown !== null}
                      className="clay-button px-12 py-5 text-white font-bold text-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {countdown ? `⏳ ${countdown}` : "📸 Capture Photo"}
                    </button>
                    <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 mt-4">
                      <p className="text-white text-[14px] font-semibold">
                        Position yourself and click to capture!
                      </p>
                    </div>
                  </>
                )}

                {/* Preview Actions */}
                {capturedImage && (
                  <div className="flex flex-col gap-4 w-full max-w-md">
                    <div className="flex gap-4">
                      <button
                        onClick={retryCapture}
                        style={{
                          marginTop: "20px",
                          padding: "10px 15px",
                          fontSize: "18px",
                        }}
                        className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all"
                      >
                        🔄 Retry
                      </button>
                      <button
                        onClick={saveCapturedImage}
                        disabled={isSaving}
                        style={{
                          marginTop: "20px",
                          padding: "10px 15px",
                          fontSize: "18px",
                        }}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all disabled:opacity-50"
                      >
                        {isSaving ? "💾 Saving..." : "💾 Save Meme"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>
    </>
  );
}
