import React from 'react';
import { Link } from 'react-router-dom';
import './Help.css';

const HelpPage = () => {
    return (
        <div className="help-page">
            <header className="page-header">
                <h1 className="header-title">ช่วยเหลือ</h1>
                <p className="header-subtitle">คำแนะนำในการใช้งานแอปพลิเคชัน</p>
            </header>

            <div className="help-content">
                <section className="help-section">
                    <h2 className="section-title">
                        <span className="title-bar" />
                        วิธีการใช้งาน
                    </h2>
                    <div className="help-cards">
                        <div className="help-card">
                            <div className="help-card-icon">🔍</div>
                            <h3>การค้นหา</h3>
                            <p>ค้นหาข้อมูลยาได้โดยการพิมพ์ชื่อยา, สรรพคุณ หรือ อาการไม่พึงประสงค์ในช่องค้นหา</p>
                        </div>
                        <div className="help-card">
                            <div className="help-card-icon">📷</div>
                            <h3>การสแกน</h3>
                            <p>ถ่ายภาพยาหรืออัปโหลดรูปภาพยาเพื่อค้นหาข้อมูลได้ทันที</p>
                        </div>
                        <div className="help-card">
                            <div className="help-card-icon">📱</div>
                            <h3>การใช้งานบนมือถือ</h3>
                            <p>แอปพลิเคชันรองรับการใช้งานบนอุปกรณ์มือถือทุกขนาดหน้าจอ</p>
                        </div>
                    </div>
                </section>

                <section className="help-section">
                    <h2 className="section-title">
                        <span className="title-bar" />
                        คำถามที่พบบ่อย
                    </h2>
                    <div className="faq-list">
                        <div className="faq-item">
                            <h3>วิธีการค้นหาข้อมูลยา?</h3>
                            <p>คุณสามารถค้นหาข้อมูลยาได้ 3 วิธี:</p>
                            <ul>
                                <li>พิมพ์ชื่อยาในช่องค้นหา</li>
                                <li>ถ่ายภาพยาด้วยกล้อง</li>
                                <li>อัปโหลดรูปภาพยา</li>
                            </ul>
                        </div>
                        <div className="faq-item">
                            <h3>ข้อมูลที่แสดงมีอะไรบ้าง?</h3>
                            <p>ข้อมูลยาที่แสดงประกอบด้วย:</p>
                            <ul>
                                <li>ชื่อการค้าและชื่อสามัญ</li>
                                <li>สรรพคุณและวิธีใช้</li>
                                <li>ข้อควรระวังและผลข้างเคียง</li>
                                <li>รูปแบบยาและขนาดบรรจุ</li>
                            </ul>
                        </div>
                        <div className="faq-item">
                            <h3>แอปพลิเคชันรองรับภาษาอะไรบ้าง?</h3>
                            <p>ปัจจุบันแอปพลิเคชันรองรับภาษาไทยและภาษาอังกฤษ</p>
                        </div>
                    </div>
                </section>

                <section className="help-section">
                    <h2 className="section-title">
                        <span className="title-bar" />
                        ติดต่อเรา
                    </h2>
                    <div className="contact-info">
                        <p>หากคุณมีคำถามหรือต้องการความช่วยเหลือเพิ่มเติม สามารถติดต่อเราได้ที่:</p>
                        <div className="contact-methods">
                            <a href="mailto:support@example.com" className="contact-method">
                                <span className="contact-icon">📧</span>
                                <span>support@example.com</span>
                            </a>
                            <a href="tel:+1234567890" className="contact-method">
                                <span className="contact-icon">📞</span>
                                <span>123-456-7890</span>
                            </a>
                        </div>
                    </div>
                </section>
            </div>

            <div className="help-footer">
                <Link to="/" className="back-button">
                    <span className="back-icon">←</span>
                    กลับหน้าหลัก
                </Link>
            </div>
        </div>
    );
};

export default HelpPage; 