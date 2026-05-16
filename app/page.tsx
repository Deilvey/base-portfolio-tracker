export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0052FF 0%, #0066FF 100%)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Base Portfolio Tracker</h1>
        <p style={{ fontSize: '1.5rem', opacity: 0.9 }}>Coming Soon! 🚀</p>
        <p style={{ fontSize: '1rem', opacity: 0.7, marginTop: '2rem' }}>
          Track your crypto portfolio on Base chain
        </p>
      </div>
    </div>
  )
}
