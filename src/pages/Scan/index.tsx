import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import './Scan.css';
import OCRProcessor from '../../components/OCR/OCRProcessor';
import { searchDrugsEnhanced, getAllDrugs } from '../../api/drugData';

// We will need a ResultCard component, let's assume it exists in a shared directory
// import ResultCard from '../shared/ResultCard'; 
// For now, let's define a placeholder so the code runs.
// ปรับ ResultCard ให้แสดงชื่อยาสามัญ (generic name) เป็นหัวข้อหลัก
const ResultCard = ({ drug, onClick }: { drug: any, onClick?: () => void }) => {
  if (!drug || typeof drug !== 'object') return null;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div 
      className="result-card" 
      onClick={handleClick} 
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        backgroundColor: 'white',
        transition: 'all 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }
      }}
    >
      <div className="result-header" style={{ display: 'flex', gap: '16px' }}>
        <div className="result-image-placeholder" style={{
          fontSize: '32px',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          flexShrink: 0
        }}>
          💊
        </div>
        <div className="result-info" style={{ flex: 1 }}>
          <h3 className="result-title" style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: 600,
            color: '#333',
            lineHeight: '1.3'
          }}>
            {drug.ชื่อสามัญ || drug.genericName || '-'}
          </h3>
          <div className="result-tags" style={{ marginBottom: '8px' }}>
            <span className="result-tag" style={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 500
            }}>
              {drug.ชื่อการค้า || drug.tradeName || ''}
            </span>
          </div>
          <div className="result-form" style={{ marginBottom: '8px' }}>
            <span className="result-form-text" style={{
              backgroundColor: '#f3e5f5',
              color: '#7b1fa2',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 500
            }}>
              {drug.รูปแบบยา || ''}
            </span>
          </div>
          <div className="result-uses">
            <span className="result-uses-text" style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.4',
              display: 'block'
            }}>
              {drug['ยานี้ใช้สำหรับ'] ? 
                drug['ยานี้ใช้สำหรับ'].split('\n')[0].replace('* ', '').substring(0, 100) + 
                (drug['ยานี้ใช้สำหรับ'].length > 100 ? '...' : '') : 
                'ไม่มีข้อมูลการใช้ยา'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

type Tab = 'camera' | 'upload';

const ScanPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('camera');
    const [image, setImage] = useState<string | null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [processing, setProcessing] = useState(false);
    const [ocrText, setOcrText] = useState('');
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const webcamRef = useRef<Webcam>(null);
    const [cameraError, setCameraError] = useState<string>('');

    // ล้าง error เมื่อเปลี่ยน tab
    useEffect(() => {
        setError('');
        setCameraError('');
    }, [activeTab]);

    // ล้าง state เมื่อเปลี่ยน image
    useEffect(() => {
        if (image) {
            setResults([]);
            setOcrText('');
            setError('');
        }
    }, [image]);

    // ล้าง state เมื่อ component unmount
    useEffect(() => {
        return () => {
            setImage(null);
            setResults([]);
            setOcrText('');
            setError('');
            setCameraError('');
            setProcessing(false);
        };
    }, []);

    // ถ่ายภาพจาก webcam
    const handleCapture = () => {
        if (webcamRef.current) {
            try {
            const imgSrc = webcamRef.current.getScreenshot();
            if (imgSrc) {
                setImage(imgSrc);
                setResults([]);
                    setOcrText('');
                    setError('');
                setProcessing(true);
                } else {
                    setError('ไม่สามารถถ่ายภาพได้ กรุณาลองใหม่อีกครั้ง');
                }
            } catch (error) {
                console.error('Error capturing image:', error);
                setError('เกิดข้อผิดพลาดในการถ่ายภาพ กรุณาลองใหม่อีกครั้ง');
            }
        } else {
            setError('ไม่สามารถเข้าถึงกล้องได้');
        }
    };

    // อัปโหลดไฟล์
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            // ตรวจสอบขนาดไฟล์ (ไม่เกิน 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('ไฟล์มีขนาดใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 10MB');
                return;
            }
            
            // ตรวจสอบประเภทไฟล์
            if (!file.type.startsWith('image/')) {
                setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResults([]);
                setOcrText('');
                setError('');
                setProcessing(true);
            };
            reader.onerror = () => {
                setError('เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาลองใหม่อีกครั้ง');
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // รับผลลัพธ์จาก OCR จริง
    const handleOCRResult = async (text: string) => {
        setOcrText(text);
        setProcessing(false);
        setError('');

        if (text && text.trim()) {
            try {
            const matches = text.match(/[a-zA-Zก-๙]{3,}/g);
            const keywords = matches ? matches.map(w => w.toLowerCase()) : [];

                if (keywords.length === 0) {
                    setResults([]);
                    setError('ไม่พบข้อความที่สามารถค้นหาได้ กรุณาลองถ่ายภาพใหม่');
                    return;
                }

            const allDrugs = await getAllDrugs();
            let results: any[] = [];
                
            for (const word of keywords) {
                    try {
                const found = await searchDrugsEnhanced(word, 'all', allDrugs);
                if (Array.isArray(found)) {
                    results = results.concat(found);
                        }
                    } catch (error) {
                        console.error(`Error searching for keyword "${word}":`, error);
                }
            }
                
                // ลบตัวซ้ำและเรียงลำดับ
            results = results.filter((v, i, a) => a.findIndex(t => t.ชื่อการค้า === v.ชื่อการค้า) === i);
            setResults(results);
                
                if (results.length === 0) {
                    setError('ไม่พบยาที่ตรงกับข้อความที่อ่านได้');
                }
            } catch (error) {
                console.error('Error processing OCR results:', error);
                setError('เกิดข้อผิดพลาดในการประมวลผลผลลัพธ์');
            setResults([]);
            }
        } else {
            setResults([]);
            setError('ไม่พบข้อความที่สามารถอ่านได้ กรุณาลองถ่ายภาพใหม่');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
        noClick: true,
        noKeyboard: true,
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false,
    });
    
    const handleUploadButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // จัดการ file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // ตรวจสอบขนาดไฟล์ (ไม่เกิน 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('ไฟล์มีขนาดใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 10MB');
                return;
            }
            
            // ตรวจสอบประเภทไฟล์
            if (!file.type.startsWith('image/')) {
                setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResults([]);
                setOcrText('');
                setError('');
                setProcessing(true);
            };
            reader.onerror = () => {
                setError('เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาลองใหม่อีกครั้ง');
            };
            reader.readAsDataURL(file);
        }
        // ล้าง input value เพื่อให้สามารถเลือกไฟล์เดิมได้อีกครั้ง
        if (event.target) {
            event.target.value = '';
        }
    };

    return (
        <div className="scan-page page-container">
            <header className="header" style={{
                padding: '16px',
                borderBottom: '1px solid #e9ecef',
                backgroundColor: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button 
                        onClick={() => {
                            navigate(-1);
                            // ล้าง state เมื่อออกจากหน้า
                            setImage(null);
                            setResults([]);
                            setOcrText('');
                            setError('');
                            setCameraError('');
                            setProcessing(false);
                        }} 
                        className="back-btn"
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s',
                            color: '#666'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0f0f0';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        ←
                    </button>
                    <h1 className="header-title" style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#333'
                    }}>
                        ถ่ายรูป/อัปโหลดยา
                    </h1>
                </div>
            </header>

            <div className="tabs" style={{
                display: 'flex',
                margin: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '4px',
                gap: '4px'
            }}>
                <button 
                    className={`tab-btn ${activeTab === 'camera' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('camera');
                        setImage(null);
                        setResults([]);
                        setOcrText('');
                        setError('');
                        setCameraError('');
                    }}
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        backgroundColor: activeTab === 'camera' ? '#007bff' : 'transparent',
                        color: activeTab === 'camera' ? 'white' : '#666'
                    }}
                >
                    <span className="tab-icon">📷</span>
                    ถ่ายรูป
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('upload');
                        setImage(null);
                        setResults([]);
                        setOcrText('');
                        setError('');
                        setCameraError('');
                    }}
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        backgroundColor: activeTab === 'upload' ? '#007bff' : 'transparent',
                        color: activeTab === 'upload' ? 'white' : '#666'
                    }}
                >
                    <span className="tab-icon">📁</span>
                    อัปโหลด
                </button>
            </div>

            {activeTab === 'camera' && (
                <div className="camera-view" style={{ margin: '16px' }}>
                    <div className="camera-container" style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '2px solid #e9ecef',
                        marginBottom: '16px',
                        backgroundColor: '#000',
                        position: 'relative'
                    }}>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            videoConstraints={{ facingMode: 'environment' }}
                            onUserMediaError={(error) => {
                                console.error('Camera error:', error);
                                setCameraError('ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบการอนุญาตกล้อง');
                                setError('ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบการอนุญาตกล้อง');
                            }}
                            onUserMedia={() => {
                                setCameraError('');
                                setError('');
                            }}
                            style={{
                                display: 'block',
                                width: '100%',
                                height: 'auto'
                            }}
                        />
                        {!cameraError && (
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                left: '16px',
                                right: '16px',
                                textAlign: 'center',
                                color: 'white',
                                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                                fontSize: '14px',
                                fontWeight: 500,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                padding: '8px 12px',
                                borderRadius: '20px',
                                backdropFilter: 'blur(4px)'
                            }}>
                                📷 วางกล้องให้ตรงกับฉลากยา
                            </div>
                        )}
                    </div>
                    {cameraError && (
                        <div style={{ 
                            color: 'red', 
                            marginBottom: '16px',
                            padding: '8px 12px',
                            backgroundColor: '#ffebee',
                            borderRadius: '4px',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '16px' }}>📷</span>
                            {cameraError}
                    </div>
                    )}
                    <button 
                        className="camera-btn" 
                        onClick={handleCapture} 
                        disabled={!!cameraError}
                        style={{ 
                            width: '100%',
                            padding: '16px',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: cameraError ? '#ccc' : '#007bff',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 500,
                            cursor: cameraError ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            if (!cameraError) {
                                e.currentTarget.style.backgroundColor = '#0056b3';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!cameraError) {
                                e.currentTarget.style.backgroundColor = '#007bff';
                            }
                        }}
                    >
                        <span>📸</span>
                        <span>ถ่ายภาพ</span>
                    </button>
                </div>
            )}

            {activeTab === 'upload' && (
                <div {...getRootProps()} className={`upload-area ${isDragActive ? 'active' : ''}`} style={{
                    margin: '16px',
                    padding: '32px 16px',
                    border: '2px dashed',
                    borderColor: isDragActive ? '#007bff' : '#dee2e6',
                    borderRadius: '8px',
                    backgroundColor: isDragActive ? '#f8f9ff' : '#f8f9fa',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {isDragActive && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 123, 255, 0.1)',
                            border: '2px solid #007bff',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            color: '#007bff',
                            fontWeight: 'bold'
                        }}>
                            📁 วางไฟล์ที่นี่!
                        </div>
                    )}
                    <input 
                        {...getInputProps()} 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }} 
                    />
                    <div className="upload-icon" style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                    <h2 className="upload-title" style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '18px', 
                        fontWeight: 500,
                        color: '#333'
                    }}>
                        อัปโหลดรูปยา
                    </h2>
                    <p className="upload-subtitle" style={{ 
                        margin: '0 0 16px 0', 
                        fontSize: '14px', 
                        color: '#666'
                    }}>
                        {isDragActive 
                            ? 'วางไฟล์ที่นี่เพื่ออัปโหลด' 
                            : 'ลากไฟล์มาวางที่นี่ หรือ'
                        }
                    </p>
                    <button 
                        onClick={handleUploadButtonClick} 
                        className="upload-btn"
                        style={{
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '12px 24px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#0056b3';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#007bff';
                        }}
                    >
                        <span>เลือกไฟล์</span>
                        <span>📎</span>
                    </button>
                    <p className="upload-hint" style={{
                        margin: '16px 0 0 0',
                        fontSize: '12px',
                        color: '#999'
                    }}>
                        รองรับไฟล์: JPG, PNG, JPEG, WebP (ไม่เกิน 10MB)
                    </p>
                </div>
            )}

            {/* แสดงภาพที่ถ่ายหรืออัปโหลด */}
            {image && (
                <div className="image-preview-container" style={{
                    margin: '16px',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'white'
                }}>
                    <div className="image-preview-header" style={{
                        padding: '12px 16px',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e9ecef',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ 
                            margin: 0, 
                            fontSize: '16px', 
                            fontWeight: 500,
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>🖼️</span>
                            ภาพที่เลือก
                        </h3>
                        <button 
                            onClick={() => {
                                setImage(null);
                                setResults([]);
                                setOcrText('');
                                setError('');
                            }}
                            className="remove-image-btn"
                            style={{
                                background: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#cc0000';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#ff4444';
                            }}
                        >
                            <span>🗑️</span>
                            ลบภาพ
                        </button>
                    </div>
                    <div style={{ padding: '16px', textAlign: 'center' }}>
                        <img 
                            src={image} 
                            alt="preview" 
                            className="preview-image" 
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                display: 'block',
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* แสดง OCRProcessor ขณะกำลังประมวลผล */}
            {image && processing && (
                <div className="processing-container" style={{
                    margin: '16px',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                <OCRProcessor imageSrc={image} onResult={handleOCRResult} />
                </div>
            )}

            {/* แสดง loading state เมื่อไม่มี OCRProcessor */}
            {image && processing && !ocrText && (
                <div className="loading-container" style={{
                    margin: '16px',
                    padding: '32px 20px',
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}>
                    <div style={{ 
                        fontSize: '48px', 
                        marginBottom: '16px',
                        animation: 'pulse 2s infinite'
                    }}>
                        ⏳
                    </div>
                    <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '18px', 
                        fontWeight: 500,
                        color: '#333'
                    }}>
                        กำลังประมวลผลภาพ...
                    </p>
                    <p style={{ 
                        margin: 0, 
                        fontSize: '14px', 
                        color: '#666',
                        lineHeight: '1.4'
                    }}>
                        กรุณารอสักครู่ ระบบกำลังอ่านข้อความจากภาพ
                    </p>
                    <style>
                        {`
                            @keyframes pulse {
                                0%, 100% { opacity: 1; }
                                50% { opacity: 0.5; }
                            }
                        `}
                    </style>
                </div>
            )}

            {/* แสดง error message */}
            {error && (
                <div className="error-message" style={{
                    margin: '16px',
                    padding: '12px 16px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '4px',
                    border: '1px solid #f5c6cb',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative'
                }}>
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    <strong>ข้อผิดพลาด:</strong> {error}
                    <button 
                        onClick={() => setError('')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#721c24',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginLeft: 'auto',
                            padding: '0',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(114, 28, 36, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* แสดงผล OCR ดิบ (optional) */}
            {ocrText && !processing && (
                <div className="ocr-result-container" style={{
                    margin: '16px',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'white'
                }}>
                    <div className="ocr-result-header" style={{
                        padding: '12px 16px',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e9ecef',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ 
                            margin: 0, 
                            fontSize: '16px', 
                            fontWeight: 500,
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>📝</span>
                            ข้อความที่อ่านได้
                        </h3>
                        <button 
                            onClick={() => setOcrText('')}
                            className="clear-ocr-btn"
                            style={{
                                background: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#444';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#666';
                            }}
                        >
                            <span>🗑️</span>
                            ล้างข้อความ
                        </button>
                    </div>
                    <div className="ocr-text-content" style={{ padding: '16px' }}>
                        <pre style={{ 
                            whiteSpace: 'pre-wrap', 
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            margin: 0,
                            padding: '12px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px',
                            border: '1px solid #e9ecef',
                            maxHeight: '200px',
                            overflow: 'auto',
                            color: '#333'
                        }}>
                            {ocrText}
                        </pre>
                    </div>
                </div>
            )}

            {/* แสดงผลลัพธ์ OCR (mock เฉพาะเมื่อมีข้อความจริง) */}
            {Array.isArray(results) && results.length > 0 ? (
                <div className="search-results" style={{
                    margin: '16px',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'white'
                }}>
                    <div className="results-header" style={{
                        padding: '12px 16px',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e9ecef',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h2 className="results-title" style={{ 
                                margin: 0, 
                                fontSize: '18px', 
                                fontWeight: 500,
                                color: '#333',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>🔍</span>
                                ผลการค้นหา
                            </h2>
                            <span className="results-count" style={{
                                fontSize: '14px',
                                color: '#666',
                                backgroundColor: '#e9ecef',
                                padding: '4px 8px',
                                borderRadius: '12px'
                            }}>
                                พบ {results.length} รายการ
                            </span>
                        </div>
                        <button 
                            onClick={() => {
                                setResults([]);
                                setOcrText('');
                            }}
                            className="clear-results-btn"
                            style={{
                                background: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#444';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#666';
                            }}
                        >
                            <span>🗑️</span>
                            ล้างผลลัพธ์
                        </button>
                    </div>
                    <div className="results-list" style={{ padding: '16px' }}>
                    {results.map((drug, index) => (
                            <ResultCard 
                                key={`${drug.ชื่อการค้า}-${index}`} 
                                drug={drug}
                                onClick={() => {
                                    // Navigate to drug details page
                                    navigate(`/drug-details?name=${encodeURIComponent(drug.ชื่อการค้า)}`);
                                }}
                            />
                    ))}
                </div>
                </div>
            ) : Array.isArray(results) && results.length === 0 && ocrText ? (
                <div className="search-results" style={{
                    margin: '16px',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'white'
                }}>
                    <div className="results-header" style={{
                        padding: '12px 16px',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e9ecef'
                    }}>
                        <h2 className="results-title" style={{ 
                            margin: 0, 
                            fontSize: '18px', 
                            fontWeight: 500,
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>🔍</span>
                            ผลการค้นหา
                        </h2>
                        <span className="results-count" style={{
                            fontSize: '14px',
                            color: '#666',
                            backgroundColor: '#e9ecef',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            display: 'inline-block',
                            marginTop: '8px'
                        }}>
                            ไม่พบผลลัพธ์
                        </span>
                    </div>
                    <div className="no-results" style={{ padding: '24px 16px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#333' }}>
                            ไม่พบยาที่ตรงกับข้อความที่อ่านได้
                        </p>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
                            ลองถ่ายภาพใหม่ให้ชัดเจนขึ้น หรือตรวจสอบว่ามีข้อความบนฉลากยาหรือไม่
                        </p>
                        <button 
                            onClick={() => {
                                setImage(null);
                                setResults([]);
                                setOcrText('');
                                setError('');
                            }}
                            className="retry-btn"
                            style={{
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '12px 24px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                                transition: 'background-color 0.2s',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#0056b3';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#007bff';
                            }}
                        >
                            <span>🔄</span>
                            ลองใหม่
                        </button>
                    </div>
                </div>
            ) : null}

            {/* แสดง success message เมื่อประมวลผลเสร็จ */}
            {ocrText && !processing && results.length > 0 && (
                <div className="success-message" style={{
                    margin: '16px',
                    padding: '12px 16px',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    borderRadius: '4px',
                    border: '1px solid #c3e6cb',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: '16px' }}>✅</span>
                    <strong>สำเร็จ:</strong> พบยา {results.length} รายการที่ตรงกับข้อความที่อ่านได้
                </div>
            )}

            {/* แสดง info message เมื่อประมวลผลเสร็จแต่ไม่พบผลลัพธ์ */}
            {ocrText && !processing && results.length === 0 && !error && (
                <div className="info-message" style={{
                    margin: '16px',
                    padding: '12px 16px',
                    backgroundColor: '#d1ecf1',
                    color: '#0c5460',
                    borderRadius: '4px',
                    border: '1px solid #bee5eb',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: '16px' }}>ℹ️</span>
                    <strong>ข้อมูล:</strong> ประมวลผลเสร็จสิ้นแล้ว แต่ไม่พบยาที่ตรงกับข้อความที่อ่านได้
                </div>
            )}
        </div>
    );
};

export default ScanPage; 