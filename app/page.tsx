'use client';

import Link from 'next/link';
import Image from 'next/image';
import HomeTopbar from '@/components/HomeTopbar';
import HomeLogoBanner from '@/components/HomeLogoBanner';
import Footer from '@/components/Footer';
import { ArrowRight, Check, Globe, Shield, Truck, Zap, Camera, Instagram, ExternalLink, UserPlus, Send } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ margin: 0, padding: 0, background: 'transparent' }}>
      <HomeTopbar />
      <HomeLogoBanner />

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-background home-hero-background-1"></div>
        <div className="home-hero-background home-hero-background-2"></div>
        <div className="home-hero-overlay"></div>
        <div className="home-hero-content">
          <div className="home-hero-badge">
            <div className="home-hero-badge-icon"></div>
            <span>DIRECT UIT DE NEDERLANDSE VELDEN</span>
          </div>
          <h1 className="home-hero-title">
            <span className="home-hero-title-line1">Planten zonder</span>
            <span className="home-hero-title-line2">omwegen.</span>
          </h1>
          <p className="home-hero-description">
            Al 20 jaar de vertrouwde brug tussen de beste Nederlandse kwekers en de Duitse vakman. Nu sneller, transparanter en volledig digitaal.
          </p>
          <div className="home-hero-buttons">
            <Link href="/b2b" className="home-hero-button home-hero-button-primary">
              Inloggen <ArrowRight size={20} />
            </Link>
            <Link href="/b2b" className="home-hero-button home-hero-button-secondary">
              Word Partner <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        {/* Features Section */}
        <div className="home-hero-features">
          <div className="home-hero-feature-item">
            <Check size={20} className="home-hero-feature-check" />
            <div className="home-hero-feature-content">
              <div className="home-hero-feature-number">20+ Jaar</div>
              <div className="home-hero-feature-label">EXPORTERVARING</div>
            </div>
          </div>
          <div className="home-hero-feature-item">
            <Check size={20} className="home-hero-feature-check" />
            <div className="home-hero-feature-content">
              <div className="home-hero-feature-number">100% DE</div>
              <div className="home-hero-feature-label">DUITSE POSTCODES</div>
            </div>
          </div>
          <div className="home-hero-feature-item">
            <Check size={20} className="home-hero-feature-check" />
            <div className="home-hero-feature-content">
              <div className="home-hero-feature-number">350+</div>
              <div className="home-hero-feature-label">KWEKERS NETWERK</div>
            </div>
          </div>
          <div className="home-hero-feature-item">
            <Check size={20} className="home-hero-feature-check" />
            <div className="home-hero-feature-content">
              <div className="home-hero-feature-number">Vanaf 24u</div>
              <div className="home-hero-feature-label">LEVERING</div>
            </div>
          </div>
        </div>
      </section>


      {/* Why Straver Section */}
      <section className="home-why">
        <div className="home-why-container">
          <h2 className="home-why-title">Waarom Straver Online?</h2>
          <p className="home-why-subtitle">
            Wij combineren 20 jaar passie voor groen met de snelheid van nu - exclusief voor de Duitse markt.
          </p>
          <div className="home-why-cards">
            <div className="home-why-card">
              <div className="home-why-card-icon">
                <Globe size={32} />
              </div>
              <h3 className="home-why-card-title">Directe Export</h3>
              <p className="home-why-card-description">
                Wij leveren direct van de kweker naar uw locatie in heel Duitsland, zonder onnodige tussenschakels.
              </p>
            </div>
            <div className="home-why-card">
              <div className="home-why-card-icon">
                <Shield size={32} />
              </div>
              <h3 className="home-why-card-title">Gegarandeerde Kwaliteit</h3>
              <p className="home-why-card-description">
                Dezelfde zorgvuldige selectie die u gewend bent van onze vrachtwagenverkoop.
              </p>
            </div>
            <div className="home-why-card">
              <div className="home-why-card-icon">
                <Truck size={32} />
              </div>
              <h3 className="home-why-card-title">Focus op Duitsland</h3>
              <p className="home-why-card-description">
                Dankzij onze gespecialiseerde logistiek bereiken we nu elke klant in Duitsland, ongeacht de locatie.
              </p>
            </div>
            <div className="home-why-card">
              <div className="home-why-card-icon">
                <Zap size={32} />
              </div>
              <h3 className="home-why-card-title">24/7 Bestelgemak</h3>
              <p className="home-why-card-description">
                Niet meer wachten op de vrachtwagen. Bestel op elk moment via uw eigen klantaccount.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Bank Section */}
      <section className="home-imagebank">
        <div className="home-imagebank-container">
          <div className="home-imagebank-header">
            <div className="home-imagebank-title-section">
              <Camera size={20} className="home-imagebank-icon" />
              <span className="home-imagebank-label">BEELDBANK</span>
            </div>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="home-imagebank-instagram">
              Volg ons op Instagram <ExternalLink size={14} />
            </a>
          </div>
          <h2 className="home-imagebank-heading">
            Een kijkje achter de <span className="home-imagebank-heading-green">groene schermen.</span>
          </h2>
          <div className="home-imagebank-grid">
            <div className="home-imagebank-item">
              <Image
                src="/Buxus_cat.JPG.jpeg"
                alt="Buxus categorie"
                width={246}
                height={246}
                className="home-imagebank-image"
              />
              <div className="home-imagebank-logo-overlay">
                <Image
                  src="/Logo Links BOven .png"
                  alt="Straver Logo"
                  width={100}
                  height={30}
                  className="home-imagebank-logo"
                />
              </div>
            </div>
            <div className="home-imagebank-item">
              <Image
                src="/Agapanthus_cat.PNG"
                alt="Agapanthus categorie"
                width={246}
                height={246}
                className="home-imagebank-image"
              />
              <div className="home-imagebank-logo-overlay">
                <Image
                  src="/Logo Links BOven .png"
                  alt="Straver Logo"
                  width={100}
                  height={30}
                  className="home-imagebank-logo"
                />
              </div>
            </div>
            <div className="home-imagebank-item">
              <Image
                src="/ChatGPT Image 1 feb 2026, 11_11_50.png"
                alt="Carex categorie"
                width={246}
                height={246}
                className="home-imagebank-image"
              />
              <div className="home-imagebank-logo-overlay">
                <Image
                  src="/Logo Links BOven .png"
                  alt="Straver Logo"
                  width={100}
                  height={30}
                  className="home-imagebank-logo"
                />
              </div>
            </div>
            <div className="home-imagebank-item">
              <Image
                src="/Hydrangea_cat.png"
                alt="Hydrangea categorie"
                width={246}
                height={246}
                className="home-imagebank-image"
              />
              <div className="home-imagebank-logo-overlay">
                <Image
                  src="/Logo Links BOven .png"
                  alt="Straver Logo"
                  width={100}
                  height={30}
                  className="home-imagebank-logo"
                />
              </div>
            </div>
            <div className="home-imagebank-item">
              <Image
                src="/Acer_cat.JPG.jpeg"
                alt="Acer categorie"
                width={246}
                height={246}
                className="home-imagebank-image"
              />
              <div className="home-imagebank-logo-overlay">
                <Image
                  src="/Logo Links BOven .png"
                  alt="Straver Logo"
                  width={100}
                  height={30}
                  className="home-imagebank-logo"
                />
              </div>
            </div>
            <div className="home-imagebank-item">
              <Image
                src="/Fruit cat3.png"
                alt="Bamboo categorie"
                width={246}
                height={246}
                className="home-imagebank-image"
              />
              <div className="home-imagebank-logo-overlay">
                <Image
                  src="/Logo Links BOven .png"
                  alt="Straver Logo"
                  width={100}
                  height={30}
                  className="home-imagebank-logo"
                />
              </div>
            </div>
            <div className="home-imagebank-item">
              <Image
                src="/Helloborus_cat.png"
                alt="Helleborus categorie"
                width={246}
                height={246}
                className="home-imagebank-image"
              />
              <div className="home-imagebank-logo-overlay">
                <Image
                  src="/Logo Links BOven .png"
                  alt="Straver Logo"
                  width={100}
                  height={30}
                  className="home-imagebank-logo"
                />
              </div>
            </div>
            <div className="home-imagebank-item">
              <Image
                src="/Camellia_cat.png"
                alt="Camellia categorie"
                width={246}
                height={246}
                className="home-imagebank-image"
              />
              <div className="home-imagebank-logo-overlay">
                <Image
                  src="/Logo Links BOven .png"
                  alt="Straver Logo"
                  width={100}
                  height={30}
                  className="home-imagebank-logo"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Partner Section */}
      <section className="home-b2b">
        <div className="home-b2b-container">
          <div className="home-b2b-content">
            <div className="home-b2b-icon">
              <UserPlus size={32} />
            </div>
            <h2 className="home-b2b-title">
              Word onze nieuwe <span className="home-b2b-title-green">B2B-partner</span>
            </h2>
            <p className="home-b2b-description">
              Profiteer van persoonlijke begeleiding, scherpe prijzen en een assortiment dat wekelijks wordt ververst. Samen laten we uw projecten groeien.
            </p>
            <ul className="home-b2b-benefits">
              <li className="home-b2b-benefit">
                <Check size={20} className="home-b2b-check" />
                <span>Toegang tot exclusieve groothandelsprijzen</span>
              </li>
              <li className="home-b2b-benefit">
                <Check size={20} className="home-b2b-check" />
                <span>Persoonlijke accountmanager voor al uw vragen</span>
              </li>
              <li className="home-b2b-benefit">
                <Check size={20} className="home-b2b-check" />
                <span>Flexibele levering door heel Duitsland</span>
              </li>
              <li className="home-b2b-benefit">
                <Check size={20} className="home-b2b-check" />
                <span>Eenvoudig online bestellen en factureren</span>
              </li>
            </ul>
          </div>
          <div className="home-b2b-form">
            <form className="home-b2b-form-content">
              <div className="home-b2b-form-row">
                <div className="home-b2b-form-field">
                  <label className="home-b2b-form-label">VOORNAAM</label>
                  <input type="text" className="home-b2b-form-input" placeholder="Hans" />
                </div>
                <div className="home-b2b-form-field">
                  <label className="home-b2b-form-label">ACHTERNAAM</label>
                  <input type="text" className="home-b2b-form-input" placeholder="Müller" />
                </div>
              </div>
              <div className="home-b2b-form-field">
                <label className="home-b2b-form-label">BEDRIJFSNAAM (KVK VERPLICHT)</label>
                <input type="text" className="home-b2b-form-input" placeholder="Beispiel GmbH" />
              </div>
              <div className="home-b2b-form-field">
                <label className="home-b2b-form-label">ZAKELIJK E-MAILADRES</label>
                <input type="email" className="home-b2b-form-input" placeholder="beispiel@info.de" />
              </div>
              <div className="home-b2b-form-field">
                <label className="home-b2b-form-label">TYPE PROJECT / BEDRIJFSVOERING</label>
                <textarea 
                  className="home-b2b-form-textarea" 
                  placeholder="Bijv. hovenier, tuincentrum of projectontwikkelaar..."
                  rows={4}
                />
              </div>
              <button type="submit" className="home-b2b-form-submit">
                <Send size={20} />
                Verstuur Aanvraag
              </button>
              <p className="home-b2b-form-disclaimer">
                U ONTVANGT BINNEN 4 WERKUREN EEN REACTIE VAN ONS TEAM
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
