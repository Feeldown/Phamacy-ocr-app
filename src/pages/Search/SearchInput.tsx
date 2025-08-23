import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDrugs, DrugData, getSearchSuggestions } from '../../api/drugData';

const SearchInput = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>(() => {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const [allDrugs, setAllDrugs] = useState<DrugData[]>([]);
    const [suggestedDrugs, setSuggestedDrugs] = useState<DrugData[]>([]);
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
    const [randomSuggestions, setRandomSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchDrugs = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const drugs = await getAllDrugs();
                setAllDrugs(drugs);
                // สุ่มชื่อการค้า 5 รายการ (หรือถ้าไม่มีชื่อการค้า ให้ใช้ชื่อสามัญ)
                const names = drugs.map(d => d.ชื่อการค้า || d.ชื่อสามัญ).filter(Boolean);
                const picked: string[] = [];
                const used = new Set();
                while (picked.length < 5 && used.size < names.length) {
                    const idx = Math.floor(Math.random() * names.length);
                    if (!used.has(idx)) {
                        picked.push(names[idx]);
                        used.add(idx);
                    }
                }
                setRandomSuggestions(picked);
            } catch (err) {
                setError('ไม่สามารถโหลดข้อมูลยาได้ กรุณาลองใหม่อีกครั้ง');
                console.error('Error fetching drugs:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDrugs();
    }, []);

    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    // ใช้ debounce สำหรับการค้นหาคำแนะนำ
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.trim().length >= 2) {
                try {
                    const suggestions = await getSearchSuggestions(query, 8);
                    setSearchSuggestions(suggestions);
                    setShowSuggestions(true);
                } catch (err) {
                    console.error('Error getting suggestions:', err);
                }
            } else {
                setSearchSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    useEffect(() => {
        if (query.trim().length === 0) {
            setSuggestedDrugs([]);
            return;
        }
        
        // ป้องกันการค้นหาที่เป็นช่องว่างล้วนๆ หรืออักขระพิเศษ
        const trimmedQuery = query.trim();
        if (trimmedQuery.length === 0 || /^[^\w\u0E00-\u0E7F]+$/.test(trimmedQuery)) {
            setSuggestedDrugs([]);
            return;
        }

        const normalized = trimmedQuery.toLowerCase();
        const filtered = allDrugs.filter(drug =>
            drug.ชื่อการค้า.toLowerCase().includes(normalized) ||
            drug.ชื่อสามัญ.toLowerCase().includes(normalized)
        ).slice(0, 5);
        setSuggestedDrugs(filtered);
    }, [query, allDrugs]);

    const validateAndSearch = (searchQuery: string) => {
        const trimmed = searchQuery.trim();
        
        // ตรวจสอบว่าไม่ใช่ช่องว่างล้วนๆ
        if (trimmed.length === 0) {
            setError('กรุณาป้อนคำค้นหา');
            return false;
        }
        
        // ตรวจสอบว่าไม่ใช่แค่อักขระพิเศษ
        if (/^[^\w\u0E00-\u0E7F]+$/.test(trimmed)) {
            setError('กรุณาป้อนคำค้นหาที่มีตัวอักษรหรือตัวเลข');
            return false;
        }
        
        // ตรวจสอบความยาวขั้นต่ำ
        if (trimmed.length < 2) {
            setError('กรุณาป้อนคำค้นหาอย่างน้อย 2 ตัวอักษร');
            return false;
        }
        
        setError(null);
        return true;
    };

    const handleSuggestionClick = (text: string) => {
        if (validateAndSearch(text)) {
            setQuery(text);
            setShowSuggestions(false);
            navigate(`/search/result?query=${encodeURIComponent(text)}`);
        }
    };

    const handleClearQuery = () => {
        setQuery('');
        setError(null);
        setShowSuggestions(false);
    };

    const handleBack = () => navigate(-1);

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            if (validateAndSearch(query)) {
                setSearchHistory(prev => {
                    const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, 10);
                    return newHistory;
                });
                setShowSuggestions(false);
                navigate(`/search/result?query=${encodeURIComponent(query)}`);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleSearchBtn = () => {
        if (query.trim()) {
            if (validateAndSearch(query)) {
                setSearchHistory(prev => {
                    const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, 10);
                    return newHistory;
                });
                setShowSuggestions(false);
                navigate(`/search/result?query=${encodeURIComponent(query)}`);
            }
        }
    };

    const handleInputFocus = () => {
        if (query.trim().length >= 2 && searchSuggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleInputBlur = () => {
        // ใช้ setTimeout เพื่อให้ click event ทำงานได้ก่อน
        setTimeout(() => setShowSuggestions(false), 200);
    };

    if (isLoading) {
        return (
            <div className="search-page page-container">
                <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={handleBack} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}>←</button>
                    <h1 className="header-title" style={{ flex: 1 }}>ค้นหายา</h1>
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
                    <p>กำลังโหลดข้อมูลยา...</p>
                </div>
            </div>
        );
    }

    if (error && allDrugs.length === 0) {
        return (
            <div className="search-page page-container">
                <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={handleBack} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}>←</button>
                    <h1 className="header-title" style={{ flex: 1 }}>ค้นหายา</h1>
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
                            cursor: 'pointer' 
                        }}
                    >
                        ลองใหม่อีกครั้ง
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="search-page page-container">
            <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={handleBack} style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}>←</button>
                <h1 className="header-title" style={{ flex: 1 }}>ค้นหายา</h1>
            </header>
            <div className="search-section">
                <div className="search-bar" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span className="search-icon" style={{ position: 'absolute', left: 16, fontSize: 20, color: '#4263eb' }}>🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="ค้นหาชื่อยา, สรรพคุณ หรือ อาการไม่พึงประสงค์"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setError(null); // ล้าง error เมื่อผู้ใช้พิมพ์
                        }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        style={{ paddingLeft: 40, paddingRight: 40 }}
                        onKeyDown={handleInputKeyDown}
                        autoComplete="off"
                    />
                    {query && (
                        <button onClick={handleClearQuery} style={{ position: 'absolute', right: 10, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>✕</button>
                    )}
                    <button 
                        onClick={handleSearchBtn} 
                        style={{ 
                            marginLeft: 8, 
                            padding: '8px 16px', 
                            borderRadius: 20, 
                            border: 'none', 
                            background: '#4263eb', 
                            color: 'white', 
                            fontWeight: 500, 
                            cursor: 'pointer' 
                        }}
                    >
                        ค้นหา
                    </button>
                </div>
                
                {/* แสดง Error Message */}
                {error && (
                    <div style={{ 
                        color: '#e74c3c', 
                        fontSize: '14px', 
                        marginTop: '8px', 
                        padding: '8px 12px', 
                        background: '#fdf2f2', 
                        border: '1px solid #fecaca', 
                        borderRadius: '6px' 
                    }}>
                        {error}
                    </div>
                )}

                {/* แสดง Search Suggestions (Autocomplete) */}
                {showSuggestions && searchSuggestions.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 12,
                        margin: 0,
                        padding: 0,
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}>
                        {searchSuggestions.map((suggestion, idx) => (
                            <div key={suggestion + idx} style={{ 
                                borderBottom: idx < searchSuggestions.length-1 ? '1px solid #f0f0f0' : 'none' 
                            }}>
                                <button
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    style={{
                                        width: '100%',
                                        background: 'none',
                                        border: 'none',
                                        textAlign: 'left',
                                        padding: '12px 16px',
                                        fontSize: 15,
                                        cursor: 'pointer',
                                        color: '#212529',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span style={{ color: '#4263eb', marginRight: 8 }}>🔍</span>
                                    <span>{suggestion}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* แสดง Drug Suggestions */}
                {suggestedDrugs.length > 0 && !showSuggestions && (
                    <ul style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: 12,
                        margin: 0,
                        padding: 0,
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                        {suggestedDrugs.map((drug, idx) => (
                            <li key={drug.ชื่อการค้า + idx} style={{ listStyle: 'none', borderBottom: idx < suggestedDrugs.length-1 ? '1px solid #f0f0f0' : 'none' }}>
                                <button
                                    onClick={() => handleSuggestionClick(drug.ชื่อการค้า)}
                                    style={{
                                        width: '100%',
                                        background: 'none',
                                        border: 'none',
                                        textAlign: 'left',
                                        padding: '12px 16px',
                                        fontSize: 15,
                                        cursor: 'pointer',
                                        color: '#212529'
                                    }}
                                >
                                    <span style={{ color: '#4263eb', marginRight: 8 }}>💊</span>
                                    <span>{drug.ชื่อการค้า}</span>
                                    <span style={{ color: '#888', marginLeft: 8, fontSize: 13 }}>{drug.ชื่อสามัญ}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                
                <div style={{ margin: '16px 0' }}>
                    {searchHistory.length > 0 && (
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>ประวัติการค้นหา</div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {searchHistory.map((item, idx) => (
                                    <li key={item+idx}>
                                        <button onClick={() => handleSuggestionClick(item)} style={{ background: 'none', border: 'none', color: '#4263eb', cursor: 'pointer', padding: '4px 0', fontSize: 15, textAlign: 'left' }}>{item}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>แนะนำให้ค้นหา</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {randomSuggestions.map((item, idx) => (
                            <li key={item+idx}>
                                <button onClick={() => handleSuggestionClick(item)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px 0', fontSize: 15, textAlign: 'left' }}>{item}</button>
                            </li>
                        ))}
                    </ul>
                </div>
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

export default SearchInput; 