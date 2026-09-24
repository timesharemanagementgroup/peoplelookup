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

    // 🔒 SECURE UPDATED ADVANTAGE: Your key is read safely out of the Vercel Dashboard Environment Variables.
    const PRIVATE_VERIPHONE_KEY = process.env.VERIPHONE_API_KEY; 

    try {
        if (mode === 'phone') {
            const rawDigits = "1" + target.replace(/\D/g, '');
            
            // Check if user set up their environment variable key yet
            if (!PRIVATE_VERIPHONE_KEY || PRIVATE_VERIPHONE_KEY === "YOUR_REAL_SECRET_KEY_HERE") {
                // Return fallback simulation with Risk Analysis parameters
                return res.status(200).json({ 
                    status: "success", 
                    source: "simulation", 
                    data: { carrier: "Verizon Wireless (Mobile)", phone_type: "mobile", country: "United States", international_number: `+1 ${target}`, valid: true, risk: "Low Risk" } 
                });
            }

            const apiResponse = await fetch(`https://veriphone.io{rawDigits}&key=${PRIVATE_VERIPHONE_KEY}`);
            if (!apiResponse.ok) throw new Error("Provider returned invalid configuration handshake credentials.");
            
            const data = await apiResponse.json();
            
            // Dynamic Risk Evaluation Engine based on line type properties
            let calculatedRisk = "Low Risk";
            if (!data.phone_valid) calculatedRisk = "High Threat (Invalid Line)";
            else if (data.phone_type === "voip") calculatedRisk = "Medium Risk (VoIP Virtual Line)";
            else if (data.phone_type === "premium") calculatedRisk = "High Threat (Premium Rate Line)";

            return res.status(200).json({ status: "success", source: "live_api", data: { ...data, risk: calculatedRisk } });
        } else {
            // Dynamic Email simulation logic with custom email risk categorization
            let emailRisk = "Low Risk";
            if (target.endsWith('.ru') || target.endsWith('.temp') || target.includes('disposable')) {
                emailRisk = "High Threat (Disposable Mailbox)";
            } else if (target.endsWith('@gmail.com') || target.endsWith('@outlook.com')) {
                emailRisk = "Low Risk (Trusted Domain)";
            }

            return res.status(200).json({ 
                status: "success", 
                source: "simulation", 
                data: { name: "Alexander Pierce", location: "California (CA), USA", domain: target.split('@')[1], risk: emailRisk } 
            });
        }
    } catch (error) {
        return res.status(500).json({ status: "error", message: `Cloud gateway breakdown: ${error.message}` });
    }
}
