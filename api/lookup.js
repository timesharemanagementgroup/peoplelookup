// This file executes securely on Vercel's cloud architecture, away from public view.
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { target, mode } = req.query;
    if (!target) {
        return res.status(400).json({ status: "error", message: "Missing target search entry criteria parameter." });
    }

    // Secure Dashboard Key Token reference
    const PRIVATE_VERIPHONE_KEY = process.env.VERIPHONE_API_KEY; 

    try {
        if (mode === 'phone') {
            const rawDigits = "1" + target.replace(/\D/g, '');
            
            // Local fallback routing block if the environment dashboard key isn't deployed yet
            if (!PRIVATE_VERIPHONE_KEY || PRIVATE_VERIPHONE_KEY === "YOUR_REAL_SECRET_KEY_HERE") {
                return res.status(200).json({ 
                    status: "success", 
                    source: "simulation", 
                    data: { carrier: "T-Mobile USA, Inc.", phone_type: "mobile", country: "United States", risk: "Low Risk" } 
                });
            }

            const apiResponse = await fetch(`https://veriphone.io{rawDigits}&key=${PRIVATE_VERIPHONE_KEY}`);
            if (!apiResponse.ok) throw new Error("Provider returned invalid configuration handshake credentials.");
            
            const data = await apiResponse.json();
            
            // Risk evaluation calculator engine 
            let calculatedRisk = "Low Risk";
            if (!data.phone_valid) calculatedRisk = "High Threat (Invalid Line)";
            else if (data.phone_type === "voip") calculatedRisk = "Medium Risk (VoIP Virtual Line)";
            else if (data.phone_type === "premium") calculatedRisk = "High Threat (Premium Rate Line)";

            return res.status(200).json({ status: "success", source: "live_api", data: { ...data, risk: calculatedRisk } });
        } else {
            // 👤 Dedicated Name Lookup Engine mapping scenario blocks
            let nameRisk = "Low Risk";
            let lowerTarget = target.toLowerCase();
            
            // Simulated threat metrics evaluations
            if (lowerTarget.includes('test') || lowerTarget.includes('unknown')) {
                nameRisk = "Medium Risk (Unverified Alias)";
            }

            return res.status(200).json({ 
                status: "success", 
                source: "simulation", 
                data: { 
                    name: target, 
                    location: "Miami, Florida (FL), USA", 
                    line_status: "Active Citizen File Record",
                    risk: nameRisk 
                } 
            });
        }
    } catch (error) {
        return res.status(500).json({ status: "error", message: `Cloud gateway breakdown: ${error.message}` });
    }
}
