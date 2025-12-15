import Link from 'next/link';
import Topbar from '@/components/Topbar';
import LogoBanner from '@/components/LogoBanner';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <LogoBanner />
      <div className="content-wrapper">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>404 - Pagina niet gevonden</h1>
          <p style={{ marginBottom: '30px', color: '#666' }}>Het product dat u zoekt bestaat niet.</p>
          <Link href="/" style={{ color: '#32B336', textDecoration: 'underline' }}>
            Terug naar overzicht
          </Link>
        </div>
      </div>
    </div>
  );
}


