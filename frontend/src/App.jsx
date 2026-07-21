import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [status, setStatus] = useState('Checking Supabase connection...');

  useEffect(() => {
    const checkConnection = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setStatus(`Connection issue: ${error.message}`);
        return;
      }
      setStatus('Supabase connection is ready.');
      console.log('Session data:', data);
    };

    checkConnection();
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <section style={{ width: '100%', maxWidth: '760px', background: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '24px', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 700 }}>
          CH
        </div>

        <p style={{ margin: '0 0 0.5rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem' }}>
          Welcome back
        </p>
        <h1 style={{ margin: '0 0 0.75rem', fontSize: '2rem', color: '#0f172a' }}>CampusHub is almost ready</h1>
        <p style={{ margin: '0 auto 1.5rem', maxWidth: '620px', color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
          Your campus community space is being built. Once auth and the first modules are live, students will be able to discover clubs, join events, and stay connected in one place.
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <strong>Status:</strong> {status}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="#" style={{ textDecoration: 'none', background: '#2563eb', color: '#fff', padding: '0.8rem 1.2rem', borderRadius: '999px', fontWeight: 600 }}>
            Continue Setup
          </a>
          <a href="#" style={{ textDecoration: 'none', background: '#eef2ff', color: '#4338ca', padding: '0.8rem 1.2rem', borderRadius: '999px', fontWeight: 600 }}>
            View Roadmap
          </a>
        </div>
      </section>
    </main>
  );
}

export default App;
