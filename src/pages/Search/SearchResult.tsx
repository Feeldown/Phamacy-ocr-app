import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchDrugsAdvanced, DrugData } from '../../api/drugData';
import './Search.css';

// Component สำหรับ highlight keyword ในข้อความ
const HighlightedText = ({ text, keyword }: { text: string, keyword: string }) => {
    if (!keyword.trim()) return <span>{text}</span>;
    
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
        <span>
            {parts.map((part, index) => 
                regex.test(part) ? (
                    <mark key={index} style={{ 
                        background: '#fff3cd', 
                        color: '#856404', 
                        padding: '0 2px', 
                        borderRadius: '3px' 
                    }}>
                        {part}
                    </mark>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </span>
    );
};

const DrugCard = ({ drug, onClick, searchKeyword }: { drug: DrugData, onClick: () => void, searchKeyword: string }) => {
    const getDrugIcon = (form: string) => {
        if (form.includes('เม็ด')) return '💊';
        if (form.includes('น้ำ')) return '🧪';
        if (form.includes('ครีม') || form.includes('ขี้ผึ้ง')) return '🧴';
        if (form.includes('ฉีด')) return '💉';
        if (form.includes('แคปซูล')) return '💊';
        if (form.includes('แกรนูล')) return '🧪';
        return '💊';
    };
    
    return (
        <div className="drug-card" onClick={onClick}>
            <div className="drug-card-image">{getDrugIcon(drug.รูปแบบยา)}</div>
            <div className="drug-card-info">
                <h3 className="drug-card-title">
                    <HighlightedText text={drug.ชื่อการค้า} keyword={searchKeyword} />
                </h3>
                <p className="drug-card-subtitle">
                    <HighlightedText text={drug.ชื่อสามัญ} keyword={searchKeyword} />
                </p>
                <div className="drug-card-uses">
                    <HighlightedText 
                        text={drug['ยานี้ใช้สำหรับ'].split('\n')[0].replace('* ', '')} 
                        keyword={searchKeyword} 
                    />
                </div>
            </div>
        </div>
    );
};

const SearchResult = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [results, setResults] = useState<DrugData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchAttempted, setSearchAttempted] = useState(false);

    // ฟังก์ชันสำหรับบันทึกผลการค้นหาล่าสุด
    const saveSearchResults = (searchQuery: string, searchResults: DrugData[]) => {
        try {
            const searchHistory = {
                query: searchQuery,
                results: searchResults,
                timestamp: Date.now()
            };
            localStorage.setItem('lastSearchResults', JSON.stringify(searchHistory));
        } catch (err) {
            console.error('Error saving search results:', err);
        }
    };

    // ฟังก์ชันสำหรับโหลดผลการค้นหาล่าสุด
    const loadLastSearchResults = (searchQuery: string) => {
        try {
            const saved = localStorage.getItem('lastSearchResults');
            if (saved) {
                const searchHistory = JSON.parse(saved);
                // ตรวจสอบว่าเป็นผลการค้นหาเดียวกันและไม่เก่าเกินไป (24 ชั่วโมง)
                if (searchHistory.query === searchQuery && 
                    Date.now() - searchHistory.timestamp < 24 * 60 * 60 * 1000) {
                    return searchHistory.results;
                }
            }
        } catch (err) {
            console.error('Error loading search results:', err);
        }
        return null;
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                setIsLoading(false);
                setSearchAttempted(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                setSearchAttempted(true);
                
                // ลองโหลดผลการค้นหาจาก localStorage ก่อน
                const cachedResults = loadLastSearchResults(query);
                if (cachedResults) {
                    setResults(cachedResults);
                    setIsLoading(false);
                    return;
                }
                
                // ใช้ฟังก์ชัน searchDrugsAdvanced ใหม่
                const searchResults = await searchDrugsAdvanced(query, {
                    caseSensitive: false,
                    fuzzy: true,
                    searchFields: ['generic', 'brand', 'uses', 'sideEffects']
                });

                setResults(searchResults);
                
                // บันทึกผลการค้นหาล่าสุด
                saveSearchResults(query, searchResults);
                
            } catch (err) {
                setError('เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง');
                console.error('Search error:', err);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleBack = () => navigate(-1);
    const handleNewSearch = () => navigate('/search');

    if (isLoading) {
        return (
            <div className="search-page">
                <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={handleBack} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}>←</button>
                    <h1 className="header-title" style={{ flex: 1 }}>ผลการค้นหา</h1>
                </header>
                <div className="loading-state" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div className="loading-spinner" style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '4px solid #f3f3f3', 
                        borderTop: '4px solid #4263eb', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }} />
                    <p>กำลังค้นหา...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="search-page">
                <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={handleBack} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}>←</button>
                    <h1 className="header-title" style={{ flex: 1 }}>ผลการค้นหา</h1>
                </header>
                <div className="error-state" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ color: '#e74c3c', marginBottom: '20px' }}>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        style={{ 
                            padding: '10px 20px', 
                            background: '#4263eb', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        ลองใหม่อีกครั้ง
                    </button>
                    <button 
                        onClick={handleNewSearch} 
                        style={{ 
                            padding: '10px 20px', 
                            background: '#6c757d', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: 'pointer' 
                        }}
                    >
                        ค้นหาใหม่
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="search-page">
            <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={handleBack} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}>←</button>
                <h1 className="header-title" style={{ flex: 1 }}>ผลการค้นหา</h1>
            </header>
            <div className="results-section">
                <div className="results-header">
                    <h2 className="section-title">ผลการค้นหา: "{query}"</h2>
                    {searchAttempted && (
                        <span className="results-count">
                            {results.length > 0 ? `พบ ${results.length} รายการ` : 'ไม่พบผลการค้นหา'}
                        </span>
                    )}
                </div>
                
                {searchAttempted && results.length === 0 ? (
                    <div className="no-results" style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
                        <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>ไม่พบผลการค้นหา</h3>
                        <p style={{ color: '#888', marginBottom: '20px' }}>
                            ไม่พบยาที่ตรงกับคำค้นหา "{query}"
                        </p>
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>คำแนะนำ:</p>
                            <ul style={{ textAlign: 'left', display: 'inline-block', color: '#666' }}>
                                <li>ตรวจสอบการสะกดคำ</li>
                                <li>ลองค้นหาด้วยชื่อสามัญ</li>
                                <li>ลองค้นหาด้วยชื่อการค้า</li>
                                <li>ลองค้นหาด้วยสรรพคุณ</li>
                            </ul>
                        </div>
                        <button 
                            onClick={handleNewSearch} 
                            style={{ 
                                padding: '12px 24px', 
                                background: '#4263eb', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            ค้นหาใหม่
                        </button>
                    </div>
                ) : results.length > 0 ? (
                    <div className="drugs-grid">
                        {results.map((drug, index) => {
                            const cardKey = drug.ชื่อการค้า + '_' + drug.รูปแบบยา + '_' + index;
                            return (
                                <DrugCard
                                    key={cardKey}
                                    drug={drug}
                                    searchKeyword={query}
                                    onClick={() => navigate(`/drug-details?name=${encodeURIComponent(drug.ชื่อการค้า)}`)}
                                />
                            );
                        })}
                    </div>
                ) : null}
            </div>
            
            {/* เพิ่ม CSS สำหรับ loading spinner */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SearchResult; 