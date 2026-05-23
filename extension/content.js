console.log("Kairos Gatekeeper injected! Monitoring doomscrolling.");

chrome.storage.local.get(['timeLimit'], function(result) {
    // Wait X seconds (or mock immediately for dev) to inject the CSS overlay
    setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(15, 23, 42, 0.95)';
        overlay.style.zIndex = '2147483647';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.flexDirection = 'column';
        overlay.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
        overlay.style.color = '#fff';
        
        // Either iframe the PWA /gatekeeper route, or hardcode generic block
        overlay.innerHTML = `
            <h1 style="font-size: 6rem; margin:0">😿</h1>
            <h2 style="color: #ef4444; font-size: 2.5rem; margin-bottom:10px">Halt!</h2>
            <p style="font-size: 1.3rem; max-width: 500px; text-align:center; color:#94a3b8">
              You came here to doomscroll, but your Korean spaced repetition reviews are pending. Complete 5 flashcards to unlock this site!
            </p>
            <button id="unlock-btn" style="
                margin-top:30px; padding: 18px 36px; 
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                border: none; border-radius: 12px; color: white;
                font-size: 1.2rem; cursor: pointer; font-weight: bold;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            ">
                Launch Kairos
            </button>
        `;
        
        document.body.appendChild(overlay);
        // Lock site interaction
        document.body.style.overflow = 'hidden'; 
        
        document.getElementById('unlock-btn').addEventListener('click', () => {
            window.location.href = 'http://localhost:5173/';
        });
    }, 3000); // Trigger after 3 seconds for demo purposes
});
