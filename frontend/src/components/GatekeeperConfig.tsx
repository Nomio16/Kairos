import { useState } from 'react';

export const GatekeeperConfig: React.FC = () => {
    const [timeLimit, setTimeLimit] = useState(15);
    const [sites] = useState(['youtube.com', 'instagram.com', 'tiktok.com']);
    
    return (
        <div className="glass-panel" style={{ margin: '0 auto', marginTop: '50px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ 
                background: 'linear-gradient(to right, #60a5fa, #a78bfa)', 
                WebkitBackgroundClip: 'text', 
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent' 
            }}>
                🐱 Gatekeeper Settings
            </h2>
            <p>Configure your doomscrolling protection parameters.</p>
            
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                    Allowed Time Limit per app (minutes/day):
                </label>
                <input 
                    type="number" 
                    value={timeLimit} 
                    onChange={e => setTimeLimit(Number(e.target.value))}
                    style={{ 
                        width: '100%', padding: '12px', borderRadius: '10px', 
                        background: 'var(--bg-secondary)', 
                        border: '1px solid var(--glass-border)', 
                        color: 'white', fontSize: '1.1rem'
                    }}
                />
            </div>
            
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                    Addictive Sites to Block:
                </label>
                {sites.map(site => (
                    <div key={site} style={{ 
                        background: 'var(--bg-secondary)', padding: '12px', 
                        borderRadius: '10px', marginBottom: '10px', display: 'flex', 
                        justifyContent: 'space-between', alignItems: 'center' 
                    }}>
                        {site}
                        <button style={{ 
                            background: 'transparent', border: 'none', 
                            color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' 
                        }}>Remove</button>
                    </div>
                ))}
                <button style={{ 
                    background: 'transparent', border: '1px dashed var(--accent-color)', 
                    color: 'var(--accent-color)', width: '100%', padding: '12px', 
                    borderRadius: '10px', marginTop: '5px', cursor: 'pointer' 
                }}>
                    + Add New Site
                </button>
            </div>
            
            <button className="btn-primary" style={{ marginTop: '30px', width: '100%' }}
                onClick={() => alert('Saved Settings to Chrome Sync')}
            >
                Save Configuration
            </button>
        </div>
    );
};
