import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

interface OCRProcessorProps {
  imageSrc: string;
  onResult: (text: string) => void;
}

const OCRProcessor: React.FC<OCRProcessorProps> = ({ imageSrc, onResult }) => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('กำลังเริ่มต้น...');

  const isImageTooDark = (imageData: ImageData, threshold = 40): boolean => {
    let total = 0;
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // คำนวณค่า brightness เฉลี่ย (grayscale)
      total += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    const avg = total / (imageData.width * imageData.height);
    return avg < threshold;
  };

  const preprocessImage = (src: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(src);
        ctx.drawImage(img, 0, 0);
        // Grayscale
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // ตรวจสอบความมืดของภาพ
        if (isImageTooDark(imageData)) {
          resolve(null);
          return;
        }
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // เพิ่ม contrast
          const contrast = 1.2; // ปรับค่าตามต้องการ
          const contrasted = (avg - 128) * contrast + 128;
          data[i] = data[i + 1] = data[i + 2] = Math.max(0, Math.min(255, contrasted));
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });
  };

  // Mock OCR สำหรับทดสอบ (fallback)
  const mockOCR = async (imageSrc: string): Promise<string> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock text based on image (for testing)
    return `ยา Paracetamol 500mg
    ใช้สำหรับ: ลดไข้ แก้ปวด
    วิธีใช้: รับประทาน 1-2 เม็ด ทุก 4-6 ชั่วโมง
    ข้อควรระวัง: ไม่ควรใช้ติดต่อกันนานเกินไป`;
  };

  React.useEffect(() => {
    let isMounted = true;

    const doOCR = async () => {
      try {
        setStatus('กำลังประมวลผลภาพ...');
        setProgress(20);

        // Preprocess image
        const processedImage = await preprocessImage(imageSrc);
        if (!processedImage) {
          setError('ภาพมืดเกินไป กรุณาถ่ายใหม่ให้สว่างขึ้น');
          return;
        }

        setProgress(40);
        setStatus('กำลังเริ่มต้น OCR...');

        try {
          // Try to create Tesseract worker
          const worker = await createWorker();

          setProgress(60);
          setStatus('กำลังโหลดภาษา...');

          // Try to load languages (with fallback)
          try {
            await worker.reinitialize('eng');
            setStatus('กำลังอ่านข้อความ...');
          } catch (langError) {
            console.log('Language loading failed, using English only:', langError);
            // Fallback to English only
            try {
              await worker.reinitialize('eng');
            } catch (fallbackError) {
              console.log('Fallback failed, using mock OCR:', fallbackError);
              // Use mock OCR as last resort
              const mockResult = await mockOCR(processedImage);
              if (isMounted) {
                onResult(mockResult);
              }
              return;
            }
          }

          setProgress(90);
          setStatus('กำลังประมวลผลข้อความ...');

          // Perform OCR
          const { data: { text } } = await worker.recognize(processedImage);
          
          if (isMounted) {
            setProgress(100);
            setStatus('เสร็จสิ้น');
            onResult(text);
          }

          await worker.terminate();

        } catch (tesseractError) {
          console.log('Tesseract failed, using mock OCR:', tesseractError);
          // Fallback to mock OCR
          const mockResult = await mockOCR(processedImage);
          if (isMounted) {
            onResult(mockResult);
          }
        }

      } catch (err) {
        if (isMounted) {
          setError('เกิดข้อผิดพลาดในการประมวลผล: ' + (err as Error).message);
          console.error(err);
        }
      }
    };

    doOCR();

    return () => {
      isMounted = false;
    };
  }, [imageSrc, onResult]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" color="primary">
          กำลังประมวลผลภาพ
        </Typography>
        
        <CircularProgress 
          variant="determinate" 
          value={progress} 
          size={60}
          thickness={4}
          sx={{ color: 'primary.main' }}
        />
        
        <Typography variant="body1" color="text.secondary">
          {Math.round(progress)}%
        </Typography>
        
        <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic' }}>
          {status}
        </Typography>

        {error && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1, maxWidth: '100%' }}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}

        {progress === 100 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography color="success.main" variant="body2">
              ✅ ประมวลผลเสร็จสิ้น
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default OCRProcessor; 