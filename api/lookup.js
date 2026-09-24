// This file executes securely on Vercel's cloud architecture, away from public view.
export default async function handler(req, res) {
    // 1. Cross-Origin Header Settings to authorize safe processing handshakes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Read query parameters passed up securely from your front-end form
    const { target, mode } = req.query;

    if (!target) {
        return res.status(400).json({ status: "error", message: "Missing target search entry criteria parameter." });
    }

    // ⚠️ SECURE ADVANTAGE: Hardcode your real provider token strings right here!
    // They are completely safe and will never be leaked into the user's browser inspector.
    const PRIVATE_VERIPHONE_KEY = "YOUR_REAL_SECRET_KEY_HERE"; 

    try {
        if (mode === 'phone') {
            // Convert standard input strings into continuous international format parameters (+1...)
            const rawDigits = "1" + target.replace(/\D/g, '');
            
            // Execute private backend handshake to external verification endpoints
            const apiResponse = await fetch(`https://veriphone.io{rawDigits}&key=${PRIVATE_VERIPHONE_KEY}`);
            if (!apiResponse.ok) throw new Error("Provider returned invalid configuration handshake credentials.");
            
            const data = await apiResponse.json();
            return res.status(200).json({ status: "success", source: "live_api", data: data });
        } else {
            // Email Verification API endpoint mapping hooks can be wired right here
            return res.status(200).json({ 
                status: "success", 
                source: "simulation", 
                data: { name: "Alexander Pierce", location: "California (CA), USA", domain: target.split('@') } 
            });
        }
    } catch (error) {
        return res.status(500).json({ status: "error", message: `Cloud gateway breakdown: ${error.message}` });
    }
}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://w3.org' viewBox='0 0 24 24' fill='%2360a5fa'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>">
    <title>El Fenomeno Lookup</title>
    <style>
        body { 
            background: linear-gradient(rgba(11, 15, 25, 0.90), rgba(11, 15, 25, 0.90)), url('https://unsplash.com'); 
            background-repeat: no-repeat; background-size: cover; background-position: center; background-attachment: fixed; background-color: #0b0f19; color: #f3f4f6; 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 2rem; min-height: 100vh; box-sizing: border-box; 
        } 
        .container { max-width: 900px; margin: 0 auto; } 
        .header-title { text-align: center; padding: 1rem 0 2rem 0; } 
        .header-title h1 { font-weight: 800; font-size: 2.3rem; margin-bottom: 0.2rem; background: linear-gradient(90deg, #60a5fa, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; } 
        .modern-search-card { background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%); border: 1px solid rgba(75, 85, 99, 0.4); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4); backdrop-filter: blur(12px); border-radius: 20px; padding: 2.5rem 2rem; width: 100%; box-sizing: border-box; margin-bottom: 2rem; } 
        .search-pills-container { display: flex; gap: 12px; justify-content: center; margin-bottom: 1.8rem; } 
        .search-pill { background: rgba(126, 58, 242, 0.15); border: 1px solid rgba(144, 97, 249, 0.4); padding: 8px 18px; border-radius: 50px; color: #c4b5fd; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; } 
        .search-form { display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; } 
        .search-input { flex: 1; min-width: 280px; background-color: rgba(255, 255, 255, 0.95) !important; color: #111827 !important; border: 2px solid #a855f7 !important; border-radius: 12px !important; padding: 0 20px !important; height: 54px !important; font-size: 0.95rem !important; outline: none; } 
        .search-btn { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; font-weight: 600; border-radius: 12px; height: 54px; padding: 0 30px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3); transition: all 0.2s ease-in-out; display: flex; align-items: center; justify-content: center; gap: 10px; } 
        .search-btn:hover { background: linear-gradient(135deg, #047857 0%, #065f46 100%); transform: translateY(-1px); } 
        .clear-btn { background: linear-gradient(135deg, #4b5563 0%, #374151 100%); color: #f3f4f6; font-weight: 600; border-radius: 12px; height: 54px; padding: 0 20px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); transition: all 0.2s ease-in-out; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .clear-btn:hover { background: linear-gradient(135deg, #374151 0%, #1f2937 100%); transform: translateY(-1px); }
        .info-section { background-color: #111827; border: 1px solid #1f2937; padding: 20px; border-radius: 12px; margin-bottom: 15px; } 
        .badge { background-color: #1e3a8a; color: #bfdbfe; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; display: inline-block; margin-bottom: 8px; } 
        .error-msg { color: #f87171; text-align: center; margin-top: 15px; font-weight: 500; transition: opacity 0.5s ease; } 
        .loader { width: 18px; height: 18px; border: 3px solid #ffffff; border-bottom-color: transparent; border-radius: 50%; display: inline-block; box-sizing: border-box; animation: rotation 1s linear infinite; } 
        @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } 
        .loading-overlay { display: none; text-align: center; padding: 20px; color: #9ca3af; font-size: 1rem; } 
        details { background: #111827; border: 1px solid #1f2937; border-radius: 12px; margin-bottom: 15px; padding: 15px 20px; } 
        summary { cursor: pointer; font-weight: bold; color: #ffffff; font-size: 1.1rem; outline: none; } 
        .data-table-container { margin-top: 15px; overflow-x: auto; }
        .custom-data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem; }
        .custom-data-table th, .custom-data-table td { padding: 12px 16px; border-bottom: 1px solid #1f2937; }
        .custom-data-table th { background-color: rgba(59, 130, 246, 0.1); color: #60a5fa; font-weight: 600; width: 35%; }
        .custom-data-table td { color: #e5e7eb; }
        .custom-data-table tr:last-child td { border-bottom: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header-title">
            <h1 style="cursor: pointer;" onclick="window.location.reload()">El Fenomeno Lookup</h1>
            <p style="color: #9ca3af; font-size: 1rem;">Search an Email or Phone Number</p>
        </div>
        <div class="modern-search-card">
            <div class="search-pills-container">
                <div class="search-pill"><span>📧</span> Email Search</div>
                <div class="search-pill"><span>📞</span> Phone Search</div>
            </div>
            <form class="search-form" id="searchForm" onsubmit="event.preventDefault(); handleSearch(event);">
                <input type="text" id="queryInput" name="q" class="search-input" placeholder="Enter email address (e.g., target@domain.com)..." required>
                <button type="submit" class="search-btn" id="searchBtn"><span id="btnText">Start Search</span></button>
                <button type="button" class="clear-btn" id="clearBtn" onclick="handleClear()"><span>🗑️</span> Clear</button>
            </form>
            <div class="loading-overlay" id="loadingOverlay">
                <span class="loader" style="width: 24px; height: 24px; border-width: 4px; vertical-align: middle; margin-right: 8px;"></span> Searching databases...
            </div>
            <div id="errorMsg" class="error-msg" style="display: none;"></div>
        </div>
        <div id="resultsContainer"></div>
    </div>
    <script>
        let activeSearchMode = 'email';
        document.addEventListener('DOMContentLoaded', () => {
            const pills = document.querySelectorAll('.search-pill');
            const queryInput = document.getElementById('queryInput');
            queryInput.addEventListener('input', (e) => { if (activeSearchMode === 'phone') formatUSAPhone(e.target); });
            pills.forEach((pill, index) => {
                pill.style.cursor = 'pointer'; pill.style.transition = 'all 0.2s ease-in-out';
                const mode = index === 0 ? 'email' : 'phone'; pill.setAttribute('data-mode', mode);
                if (mode === 'email') activatePillVisuals(pill); else deactivatePillVisuals(pill);
                pill.addEventListener('click', () => {
                    const chosenMode = pill.getAttribute('data-mode'); if (activeSearchMode === chosenMode) return;
                    activeSearchMode = chosenMode; pills.forEach(p => deactivatePillVisuals(p)); activatePillVisuals(pill);
                    if (activeSearchMode === 'email') {
                        queryInput.placeholder = 'Enter email address (e.g., target@domain.com)...'; queryInput.type = 'email'; queryInput.inputMode = 'email';
                    } else {
                        queryInput.placeholder = 'Enter USA number (e.g., (202) 555-0143)...'; queryInput.type = 'tel'; queryInput.inputMode = 'tel';
                    }
                    handleClear(); queryInput.focus();
                });
            });
        });
        function formatUSAPhone(input) {
            let digits = input.value.replace(/\D/g, ''); if (digits.length > 10) digits = digits.substring(0, 10);
            let formatted = ''; if (digits.length > 0) formatted += '(' + digits.substring(0, 3);
            if (digits.length >= 4) formatted += ') ' + digits.substring(3, 6);
            if (digits.length >= 7) formatted += '-' + digits.substring(6, 10); input.value = formatted;
        }
        function activatePillVisuals(element) { element.style.background = 'rgba(144, 97, 249, 0.3)'; element.style.border = '2px solid #a855f7'; element.style.color = '#ffffff'; element.style.transform = 'scale(1.05)'; element.style.boxShadow = '0 0 12px rgba(168, 85, 247, 0.4)'; }
        function deactivatePillVisuals(element) { element.style.background = 'rgba(126, 58, 242, 0.15)'; element.style.border = '1px solid rgba(144, 97, 249, 0.4)'; element.style.color = '#c4b5fd'; element.style.transform = 'scale(1)'; element.style.boxShadow = 'none'; }
        function handleClear() { document.getElementById('queryInput').value = ''; document.getElementById('resultsContainer').innerHTML = ''; document.getElementById('errorMsg').style.display = 'none'; }
        async function handleSearch(event) { 
            event.preventDefault(); const query = document.getElementById('queryInput').value.trim(); const loadingOverlay = document.getElementById('loadingOverlay'); 
            const searchBtn = document.getElementById('searchBtn'); const clearBtn = document.getElementById('clearBtn'); const resultsContainer = document.getElementById('resultsContainer'); const errorMsg = document.getElementById('errorMsg'); 
            if (!query) return; 
            if (activeSearchMode === 'email' && !query.includes('@')) { showError("Invalid structural layout. Email requires an '@' symbol."); return; }
            if (activeSearchMode === 'phone' && query.replace(/\D/g, '').length < 10) { showError("Please enter a complete 10-digit USA number."); return; }
            errorMsg.style.display = 'none'; resultsContainer.innerHTML = ''; loadingOverlay.style.display = 'block'; searchBtn.disabled = true; searchBtn.style.opacity = '0.5'; clearBtn.disabled = true; clearBtn.style.opacity = '0.5';
            try {
                const url = `/api/lookup?target=${encodeURIComponent(query)}&mode=${activeSearchMode}`;
                const response = await fetch(url); if (!response.ok) throw new Error("Vercel backend router dropped the request.");
                const result = await response.json();
                if (result.status === "success") {
                    if (activeSearchMode === 'phone' && result.source === "live_api") {
                        const apiData = result.data; const badgeColor = apiData.phone_valid ? "#059669" : "#dc2626"; const labelText = apiData.phone_valid ? "VALID REGISTRY" : "SUSPECT / BLOCKED";
                        resultsContainer.innerHTML = `
                            <div class="info-section"><span class="badge" style="background-color: ${badgeColor}; color: #ffffff;">${labelText}</span><h3>Live Cloud Registry Data</h3><p><strong>Query Target:</strong> ${escapeHtml(query)}</p></div>
                            <details open><summary>Enriched Data Matrix</summary><div class="data-table-container"><table class="custom-data-table">
                            <tr><th>Wireless Carrier</th><td>${escapeHtml(apiData.carrier || 'Unknown Network Provider')}</td></tr><tr><th>Line Connection Type</th><td>${escapeHtml(apiData.phone_type || 'Unknown Type')}</td></tr><tr><th>Registered Country</th><td>${escapeHtml(apiData.country || 'United States')}</td></tr><tr><th>International ID</th><td>${escapeHtml(apiData.international_number)}</td></tr>
                            </table></div></details>`;
                    } else {
                        resultsContainer.innerHTML = `
                            <div class="info-section"><span class="badge" style="background-color: #059669; color: #ffffff;">MATCH FOUND</span><h3>Secure Backend Match</h3><p><strong>Query Target:</strong> ${escapeHtml(query)}</p></div>
                            <details open><summary>Identity Records</summary><div class="data-table-container"><table class="custom-data-table">
                            <tr><th>Full Legal Name</th><td>${escapeHtml(result.data.name)}</td></tr><tr><th>Geographic Location</th><td>${escapeHtml(result.data.location)}</td></tr><tr><th>Domain Provider</th><td>${escapeHtml(result.data.domain)}</td></tr><tr><th>Profile Status</th><td>Active / Verified Log</td></tr>
                            </table></div></details>`;
                    }
                } else { showError(result.message || "No matches located inside tables."); }
            } catch (err) { showError(`Query tracking breakdown: ${err.message}`); } 
            finally { loadingOverlay.style.display = 'none'; searchBtn.disabled = false; searchBtn.style.opacity = '1'; clearBtn.disabled = false; clearBtn.style.opacity = '1'; }
        } 
        function showError(msg) { const errorMsg = document.getElementById('errorMsg'); errorMsg.textContent = msg; errorMsg.style.display = 'block'; errorMsg.style.opacity = '1'; setTimeout(() => { errorMsg.style.opacity = '0'; setTimeout(() => { errorMsg.style.display = 'none'; }, 500); }, 5000); } 
        function escapeHtml(str) { return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
    </script>
</body>
</html>
