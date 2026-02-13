'use client';

import React, { useState } from 'react';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <footer className="footer-shopify">
      <div className="footer-container">
        <div className="footer-content">
          {/* Left Column - Email & Discord */}
          <div className="footer-left">
            <div className="footer-email-section">
              <h3 className="footer-heading">Get notified by email</h3>
              <p className="footer-text">
                How else can we tell you about monthly offers and special discounts?
              </p>
              <form onSubmit={handleSubmit} className="footer-email-form">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="footer-email-input"
                  required
                />
                <button type="submit" className="footer-submit-btn">
                  Submit
                </button>
              </form>
            </div>

            <div className="footer-discord-section">
              <h3 className="footer-heading">Join our Discord community!</h3>
              <p className="footer-text">
                Connect with plant lovers from around the world{' '}
                <Link href="#" className="footer-link-inline">here on our discord</Link>.
              </p>
            </div>
          </div>

          {/* Middle Column - Links */}
          <div className="footer-middle">
            <div className="footer-links-column">
              <h4 className="footer-links-heading">Helpful Links</h4>
              <ul className="footer-links-list">
                <li><Link href="#" className="footer-link">FAQs</Link></li>
                <li><Link href="#" className="footer-link">Common issues</Link></li>
                <li><Link href="#" className="footer-link">Shipping</Link></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4 className="footer-links-heading">Company</h4>
              <ul className="footer-links-list">
                <li><Link href="/info" className="footer-link">Our Story</Link></li>
                <li><Link href="#" className="footer-link">Corporate Gifting</Link></li>
                <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4 className="footer-links-heading">Compliance</h4>
              <ul className="footer-links-list">
                <li><Link href="#" className="footer-link">Accessibility Statement</Link></li>
                <li><Link href="#" className="footer-link">Privacy Policy</Link></li>
                <li><Link href="#" className="footer-link">Terms of Use</Link></li>
              </ul>
            </div>
          </div>

          {/* Right Column - Social Media & Contact */}
          <div className="footer-right">
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="footer-social-link" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="#" className="footer-social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="footer-social-link" aria-label="Pinterest">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.391.806-2.428 1.809-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.807 1.481 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.223-.334.135-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.292-1.155l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
              </a>
            </div>

            <div className="footer-contact-section">
              <div className="footer-contact-block">
                <h4 className="footer-contact-heading">Adresgegevens</h4>
                <div className="footer-contact-info">
                  <p className="footer-contact-name">Arno Straver Boomkwekerij</p>
                  <p className="footer-contact-address">Middenweg 23</p>
                  <p className="footer-contact-address">4281 KH Andel</p>
                </div>
              </div>

              <div className="footer-contact-block">
                <h4 className="footer-contact-heading">Contactgegevens</h4>
                <div className="footer-contact-info">
                  <p className="footer-contact-item">
                    <span className="footer-contact-label">Tel:</span>
                    <a href="tel:+31653976428" className="footer-contact-link">+31 (0)6-53976428</a>
                  </p>
                  <p className="footer-contact-item">
                    <span className="footer-contact-label">E-mail:</span>
                    <a href="mailto:info@arnostraver.nl" className="footer-contact-link">info@arnostraver.nl</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Payment Icons & Copyright */}
        <div className="footer-bottom">
          <div className="footer-payments">
            <div className="payment-icon">Visa</div>
            <div className="payment-icon">Mastercard</div>
            <div className="payment-icon">Amex</div>
            <div className="payment-icon">PayPal</div>
            <div className="payment-icon">Apple Pay</div>
            <div className="payment-icon">Google Pay</div>
            <div className="payment-icon">Shop Pay</div>
            <div className="payment-icon">Discover</div>
            <div className="payment-icon">Diners</div>
            <div className="payment-icon">Elo</div>
          </div>

          <div className="footer-copyright">
            <p>© 2026, StraverPflanzenExport</p>
          </div>

          <div className="footer-accessibility">
            <button className="accessibility-btn" aria-label="Accessibility">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="M7 12h10M12 7v10"/>
                <path d="M8 8l-2-2M16 8l2-2M8 16l-2 2M16 16l2 2"/>
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
