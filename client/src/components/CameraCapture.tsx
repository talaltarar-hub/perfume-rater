import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Check } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast.error("Unable to access camera. Please check permissions.");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setCapturedImage(null);
      onClose();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  if (capturedImage) {
    return (
      <div className="space-y-4">
        <div className="relative w-full bg-muted rounded-lg overflow-hidden">
          <img src={capturedImage} alt="Captured" className="w-full h-auto" />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={retakePhoto} className="gap-2">
            <Camera className="w-4 h-4" />
            Retake
          </Button>
          <Button onClick={confirmCapture} className="gap-2">
            <Check className="w-4 h-4" />
            Use Photo
          </Button>
        </div>
      </div>
    );
  }

  if (isCameraActive) {
    return (
      <div className="space-y-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg bg-black"
          style={{ aspectRatio: "4/3" }}
        />
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={stopCamera} className="gap-2">
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button onClick={takePhoto} className="gap-2">
            <Camera className="w-4 h-4" />
            Take Photo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <Camera className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground text-center mb-4">
          Take a photo of your perfume bottle using your phone camera
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose} className="gap-2">
          <X className="w-4 h-4" />
          Cancel
        </Button>
        <Button onClick={startCamera} className="gap-2">
          <Camera className="w-4 h-4" />
          Open Camera
        </Button>
      </div>
    </div>
  );
}
