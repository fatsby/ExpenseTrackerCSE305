import React, { useState, useEffect } from 'react';
import './css/homepage.css'; 




function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');

    //loading animatoin
    useEffect(() => {
        const preloaderTimer = setTimeout(() => {
            setIsLoading(false);
        }, 600); 

        return () => clearTimeout(preloaderTimer);
    }, []); 

    
    useEffect(() => {
    const handleAnchorClick = (event) => {
        const targetLink = event.target.closest('a');
        if (targetLink && targetLink.href && targetLink.target !== '_blank') {
            const href = targetLink.getAttribute('href');
           
            if (href.startsWith('#')) {
                setIsLoading(false); 
                return; 
            }
           
            event.preventDefault(); 
            setIsLoading(true); 
            setTimeout(() => {
                window.location.href = targetLink.href; 
            }, 500); 
        }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
        document.removeEventListener('click', handleAnchorClick);
    };
}, []);

    const handleContactFormSubmit = (event) => {
        event.preventDefault(); 
        alert("Your message has been sent!");
        // In a real application, you would send this data to a backend
        // console.log({ contactName, contactEmail, contactMessage });
        // Optionally clear form fields after submission
        setContactName('');
        setContactEmail('');
        setContactMessage('');
    };

    return (
        <>
            {/* Loading Animation */}
            {isLoading && (
                <div id="loading" className="loading">
                    <img src="src/assets/aroundtheworld.gif" alt="Loading..." className="loading-gif" />
                </div>
                
            )}

            {/* Header */}
            <div className="homepage-vh">
                <header>
                <div className="logo-image">
                    <a href="homepage">
                        <img src="src/assets/expense-tracker-high-resolution-logo.png" alt="Expense Tracker Logo" />
                    </a>
                </div>
                <div className="navigation">
                    <nav className = "homepage-nav">
                        <a href="homepage">Home</a>
                        <a href="#services-section">Services</a> {/* Use fragment ID for section */}
                        <a href="#about-us-section">About us</a> {/* Use fragment ID for section */}
                        <a href="#contact-section">Contact Us</a> {/* Use fragment ID for section */}
                        
                    </nav>
                </div>
                <div className="contact1"></div>
                </header>

                <main>
                {/* Banner Section */}
                <section className="banner">
                    <div className="hero">
                        <div className="slogan">
                            <h2>your finances</h2><br /><h1>Simplified</h1>
                            <a href="login" className="banner-btn">Get Started</a>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="services" id="services-section"> {/* Added ID for navigation */}
                    <div className="service-header">
                        <p className="subtitle"><strong>Take a look at our services</strong></p>
                        <p className="details-infor">
                            Stop guessing where your money goes.
                            <br />Expense tracking service offers a simple yet powerful way to gain clear insights into your finances.
                            <br /> Take control today and build a more secure financial future.
                        </p>
                    </div>

                    <div className="service-grid">
                        <div className="grid-item">
                            <img src="src/assets/mange-incomemm.jpg" alt="Manage Income" />
                            <h3>Easily manage income</h3>
                        </div>
                        <div className="grid-item">
                            <img src="src/assets/see-where-money-go.jpg" alt="See Where Your Money Goes" />
                            <h3>See Where Your Money Goes</h3>
                        </div>
                        <div className="grid-item">
                            <img src="src/assets/stay-on-top-of-spending.jpg" alt="Stay on Top of Your Spending" />
                            <h3>Stay on Top of Your Spending</h3>
                        </div>
                    </div>
                </section>

                <img src="src/assets/white-space.png" alt="White Space" />

                {/* About Us Section */}
                <section className="about-us" id="about-us-section"> {/* Added ID for navigation */}
                    <div className="us-header">
                        <p className="subtitle"><strong>Our team will be happy to help you</strong></p>
                        <p className="details-infor">
                            Always ready to support 24/7.
                            <br />If you feel that managing expenses is too troublesome,
                            <br /> Do not hesitate to contact us for assistance.
                        </p>
                    </div>

                    <div className="us-grid">
                        <div className="us-item">
                            <img src="src/assets/avt.jpg" alt="Nguyen Dinh Thien" />
                            <h3>Nguyen Dinh Thien</h3>
                            <a href="https://www.facebook.com/nguyen.thien.173931" target="_blank" rel="noopener noreferrer">
                                <i className='bx bxl-facebook-circle'></i> Nguyen Thien
                            </a>
                            <br />
                            <a href="https://www.instagram.com/dynh_thinz04/" target="_blank" rel="noopener noreferrer">
                                <i className='bx bxl-instagram'></i> dynh_thinz04
                            </a>
                        </div>
                        <div className="us-item">
                            <img src="src/assets/fit-cat1.jpg" alt="Le Minh Tri" />
                            <h3>Le Minh Tri</h3>
                            <a href="https://www.facebook.com/letri2312" target="_blank" rel="noopener noreferrer">
                                <i className='bx bxl-facebook-circle'></i> Le Minh Tri
                            </a>
                            <br />
                            <a href="https://www.instagram.com/fatsbyle/" target="_blank" rel="noopener noreferrer">
                                <i className='bx bxl-instagram'></i> fatsbyle
                            </a>
                        </div>
                        <div className="us-item">
                            <img src="src/assets/cat2.jpg" alt="Tran Binh Trong" />
                            <h3>Tran Binh Trong</h3>
                            <a href="https://www.facebook.com/binhtrong.tran.311056" target="_blank" rel="noopener noreferrer">
                                <i className='bx bxl-facebook-circle'></i> Tran Binh Trong
                            </a>
                            <br />
                            <a href="https://www.instagram.com/kakaprolavit/" target="_blank" rel="noopener noreferrer">
                                <i className='bx bxl-instagram'></i> kakaprolavit
                            </a>
                        </div>
                        <div className="us-item">
                            <img src="src/assets/fit-cat.jpg" alt="Nguyen Trong Luu" />
                            <h3>Nguyen Trong Luu</h3>
                            <a href="https://www.facebook.com/lanhlung.la.7140" target="_blank" rel="noopener noreferrer">
                                <i className='bx bxl-facebook-circle'></i> Nguyen Luu
                            </a>
                            <br />
                            <a href="https://www.instagram.com/22nd.february_/" target="_blank" rel="noopener noreferrer">
                                <i className='bx bxl-instagram'></i> 22nd.february_
                            </a>
                        </div>
                    </div>
                </section>
                <img src="src/assets/white-space.png" alt="White Space" />

                {/* Contact Section */}
                <section className="contact" id="contact-section"> 
                    <div className="contact-grid">
                        <div className="text-form">
                            <span><p className="subtitle">Contact us to <b className="subtitle">Begin managing your finances</b></p></span>
                            <p className="details-infor">Got questions or need assistance? <br />We're here to help you manage your expenses <br /> and take control of your finances—reach out today!</p>
                        </div>

                        <div className="contact-item">
                            <form onSubmit={handleContactFormSubmit} className='message-form'>
                                <input className='contact-name'
                                    type="text"
                                    placeholder="your name"
                                    required
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                />
                                <input className='contact-email'
                                    type="email"
                                    placeholder="your email"
                                    required
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                />
                                <textarea className='contact-area'
                                    rows="4"
                                    
                                    placeholder="enter message"
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                ></textarea>
                                <button type="submit" className="send-msg">Send Message</button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            
            <footer>
                <div className="footer-container">
                    <div className="first-ele">
                        <img
                            src="src/assets/only-logo.png"
                            alt="Expense Tracker Logo"
                            style={{ width: '80px', height: 'auto', borderRadius: '28px' }} 
                            />
                        <p>Easily track your expenses, manage your budget effectively, and make smarter financial decisions. Our expense tracker empowers you to take control of your personal finances, leading to greater peace of mind and financial freedom in the future.</p>
                        <i className='bx bxl-facebook-square' ></i>
                        <i className='bx bxl-instagram-alt' ></i>
                    </div>

                    <div className="second-ele">
                        <h4>Usefull Links</h4>
                        <ul type="none">
                            <li>About us</li>
                            <li>Contact us</li>
                            <li>Terms of Services</li>
                            <li>Plan & Precing</li>
                            <li>Site Map</li>
                        </ul>
                    </div>

                    <div className="third-ele">
                        <h4>Contact Us</h4>
                        <ul className="phone-num" type="none">
                            <li><i className='bx bxs-phone' ></i> Phone Number: +84..(The Liems)</li>
                        </ul>
                        <ul className="mail-address" type="none">
                            <li><i className='bx bxl-gmail' ></i> Email: theliems.support@eiu.edu.vn</li>
                        </ul>
                        <ul className="address" type="none">
                            <li><i className='bx bx-map' ></i><a href="https://maps.app.goo.gl/5MSLK73v9266wtg96" target="_blank" rel="noopener noreferrer"> Address: Thu Dau Mot - Binh Duong</a></li>
                            <li><i className='bx bxs-graduation' ></i><a href="https://maps.app.goo.gl/usEamfmgeRZYH9u59" target="_blank" rel="noopener noreferrer"> Eastern International University</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
            </div>
        </>
    );
}

export default HomePage;