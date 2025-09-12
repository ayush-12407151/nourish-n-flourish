import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, X, Upload } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface CameraScannerProps {
  onScanComplete: (extractedText: string) => void;
}

const CameraScanner = ({ onScanComplete }: CameraScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      // Convert canvas to blob and process with OCR
      canvas.toBlob(async (blob) => {
        if (blob) {
          await processImage(blob);
        }
      });
    }
  };

  const processImage = async (imageFile: File | Blob) => {
    setIsScanning(true);
    try {
      const result = await Tesseract.recognize(imageFile, 'eng', {
        logger: m => console.log(m)
      });
      
      const extractedText = result.data.text;
      onScanComplete(extractedText);
      handleClose();
    } catch (error) {
      console.error('OCR Error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleClose = () => {
    stopCamera();
    setIsOpen(false);
    setIsScanning(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
    startCamera();
  };

  return (
    <>
      <Button variant="earth" className="gap-2" onClick={handleOpen}>
        <Camera className="h-4 w-4" />
        Scan Receipt
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Receipt or Product</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Camera View */}
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            {/* Controls */}
            <div className="flex gap-3">
              <Button 
                onClick={captureImage} 
                disabled={!stream || isScanning}
                className="flex-1"
                variant="hero"
              >
                {isScanning ? 'Processing...' : 'Capture & Scan'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CameraScanner;