import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import './Scan.css';
import OCRProcessor from '../../components/OCR/OCRProcessor';
import { searchDrugsEnhanced, getAllDrugs } from '../../api/drugData';

const navItems = [
  { to: '/', label: 'หน้าหลัก', icon: '🏠' },
  { to: '/search', label: 'ค้นหา', icon: '🔍' },
  { to: '/categories', label: 'หมวดหมู่', icon: '📁' },
  { to: '/help', label: 'ช่วยเหลือ', icon: '❔' },
];

// We will need a ResultCard component, let's assume it exists in a shared directory
// import ResultCard from '../shared/ResultCard'; 
// For now, let's define a placeholder so the code runs.
// ปรับ ResultCard ให้แสดงชื่อยาสามัญ (generic name) เป็นหัวข้อหลัก
const ResultCard = ({ drug }: { drug: any }) => {
  if (!drug || typeof drug !== 'object') return null;
  return (
    <div className="result-card">
      <div className="result-header">
        <div className="result-image-placeholder">💊</div>
        <div className="result-info">
          <h3 className="result-title">{drug.ชื่อสามัญ || drug.genericName || '-'}</h3>
          <div className="result-tags">
            <span className="result-tag">{drug.ชื่อการค้า || drug.tradeName || ''}</span>
          </div>
          <div className="result-match">
            <span>✓</span>
            {drug.match && <span>ตรงกัน {drug.match}%</span>}
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const webcamRef = useRef<Webcam>(null);
    const [cameraError, setCameraError] = useState<string>('');
    const [ocrDebug, setOcrDebug] = useState<{ raw: string, keywords: string[], searches: Array<{ word: string, found: any[] }> }>({ raw: '', keywords: [], searches: [] });

    // ถ่ายภาพจาก webcam
    const handleCapture = () => {
        if (webcamRef.current) {
            const imgSrc = webcamRef.current.getScreenshot();
            if (imgSrc) {
                setImage(imgSrc);
                setResults([]);
                setProcessing(true);
            }
        }
    };

    // อัปโหลดไฟล์
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResults([]);
                setProcessing(true);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // รับผลลัพธ์จาก OCR จริง
    const handleOCRResult = async (text: string) => {
        setOcrText(text);
        setProcessing(false);

        if (text && text.trim()) {
            const matches = text.match(/[a-zA-Zก-๙]{3,}/g);
            const keywords = matches ? matches.map(w => w.toLowerCase()) : [];

            const allDrugs = await getAllDrugs();
            let results: any[] = [];
            let searches: Array<{ word: string, found: any[] }> = [];
            for (const word of keywords) {
                const found = await searchDrugsEnhanced(word, 'all', allDrugs);
                searches.push({ word, found });
                if (Array.isArray(found)) {
                    results = results.concat(found);
                }
            }
            results = results.filter((v, i, a) => a.findIndex(t => t.ชื่อการค้า === v.ชื่อการค้า) === i);
            setOcrDebug({ raw: text, keywords, searches });
            setResults(results);
        } else {
            setOcrDebug({ raw: text, keywords: [], searches: [] });
            setResults([]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        noClick: true,
        noKeyboard: true,
    });
    
    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="scan-page">
            <header className="header">
                <button onClick={() => navigate(-1)} className="back-btn">←</button>
                <h1 className="header-title">ถ่ายรูป/อัปโหลดยา</h1>
            </header>

            <div className="tabs">
                <button 
                    className={`tab-btn ${activeTab === 'camera' ? 'active' : ''}`}
                    onClick={() => setActiveTab('camera')}>
                    <span className="tab-icon">📷</span>
                    ถ่ายรูป
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upload')}>
                    <span className="tab-icon">📁</span>
                    อัปโหลด
                </button>
            </div>

            {activeTab === 'camera' && (
                <div className="camera-view">
                    <div className="camera-container">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            videoConstraints={{ facingMode: 'environment' }}
                            onUserMediaError={() => setCameraError('ไม่สามารถเข้าถึงกล้องได้')}
                        />
                    </div>
                    {cameraError && <div style={{ color: 'red', marginTop: 8 }}>{cameraError}</div>}
                    <button className="camera-btn" onClick={handleCapture} disabled={!!cameraError}>
                        <span>📸</span>
                        <span>ถ่ายภาพ</span>
                    </button>
                </div>
            )}

            {activeTab === 'upload' && (
                <div {...getRootProps()} className={`upload-area ${isDragActive ? 'active' : ''}`}>
                    <input {...getInputProps()} ref={fileInputRef} style={{ display: 'none' }} />
                    <div className="upload-icon">📁</div>
                    <h2 className="upload-title">อัปโหลดรูปยา</h2>
                    <p className="upload-subtitle">ลากไฟล์มาวางที่นี่ หรือ</p>
                    <button onClick={handleUploadButtonClick} className="upload-btn">
                        <span>เลือกไฟล์</span>
                        <span>📎</span>
                    </button>
                </div>
            )}

            {/* แสดงภาพที่ถ่ายหรืออัปโหลด */}
            {image && (
                <img src={image} alt="preview" className="preview-image" />
            )}

            {/* แสดง OCRProcessor ขณะกำลังประมวลผล */}
            {image && processing && (
                <OCRProcessor imageSrc={image} onResult={handleOCRResult} />
            )}

            {/* แสดงผล OCR ดิบ (optional) */}
            {ocrText && !processing && (
                <div style={{ margin: '16px', background: '#f8f8f8', padding: 8, borderRadius: 8 }}>
                    <b>ข้อความที่อ่านได้:</b>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{ocrText}</pre>
                </div>
            )}

            {/* แสดง debug OCR */}
            <div style={{ background: '#f8f8f8', color: '#333', fontSize: 12, padding: 8, margin: 8, borderRadius: 8 }}>
                <div><b>OCR RAW:</b> {ocrDebug.raw}</div>
                <div><b>KEYWORDS:</b> {JSON.stringify(ocrDebug.keywords)}</div>
                <div><b>SEARCHES:</b> {ocrDebug.searches.map(s => `${s.word} → [${Array.isArray(s.found) ? s.found.length : 0}]`).join(', ')}</div>
            </div>

            {/* แสดงผลลัพธ์ OCR (mock เฉพาะเมื่อมีข้อความจริง) */}
            {Array.isArray(results) && results.length > 0 ? (
                <div className="search-results">
                    <div className="results-header">
                        <h2 className="results-title">ผลการค้นหา</h2>
                        <span className="results-count">พบ {results.length} รายการ</span>
                    </div>
                    {results.map((drug, index) => (
                        <ResultCard key={index} drug={drug} />
                    ))}
                </div>
            ) : Array.isArray(results) && results.length === 0 ? (
                <div className="search-results">
                    <div className="results-header">
                        <h2 className="results-title">ผลการค้นหา</h2>
                        <span className="results-count">ไม่พบผลลัพธ์</span>
                    </div>
                </div>
            ) : null}

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <div className="nav-items">
                    {Array.isArray(navItems) && navItems.map(item => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className="nav-item"
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default ScanPage; 