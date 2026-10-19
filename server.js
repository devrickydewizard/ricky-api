const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());

// Your exact cookies from Reqable
const YT_COOKIES = "__Secure-YNID=CuIBCAUSlAEB8QZuZuYVlxBzw_-44avtUjeC5CtTtTcgjsBthYLcj4FGfEfu_GILl0VPLHvglpU3krpVAxrPLtgDObqVXrbh-W0Gt2uVz4XwigAMTdy6_Xp2vC1xZzQ0r6cS4AIC0PSfycsXsprkhmwElaQ5jahreAjcfHsr-EkmS2QWcvI-9XiDfOn9C2VLyA3c-cijWi98NT9OKAUyRQHeqZ1P59iYJVD_vAK2BOyZu0CJYP7bDx8MASupQgpNA-C1ggayZUUs61ziSmbo_5b2V9Pg63UBrE_0ourxCOrAIAjeDQ; __Secure-ROLLOUT_TOKEN=CP6C4M7Ct6zxwAEQsprK4qjGlwMYir6B5KjGlwM%3D; __Secure-BUCKET=CN0B; __Secure-3PSIDTS=sidts-CjUBkldj_35LvjF3uSWiA5hb7MFU9bVlPe-9KX3-jzrBKKl3f94sKyIT48sZK6MG1mrDWDvjkRAA; __Secure-3PSIDCC=AKEyXzXbqai5e45kVOeLNCGPFGwKozTyzLQv4vJj8C-YA0B8XMz9qOPz9Qi1ihdaW3Nf7-JT; __Secure-3PSID=g.a000DwmawvNu4Yp9FAFYklpC42ykh6XtWafAhx5_oLjw31k-neUVUNhiOQGCuAseZY9GQKsOlgACgYKATYSARUSFQHGX2Mij057238DUPhq9meM5R_z3RoVAUF8yKpGJ5Ln7kIunMWgJpJu5_qK0076; __Secure-3PAPISID=-0zzESUYbSous5Vl/AnSejw3kOncz8lCX2; __Secure-1PSIDTS=sidts-CjUBkldj_35LvjF3uSWiA5hb7MFU9bVlPe-9KX3-jzrBKKl3f94sKyIT48sZK6MG1mrDWDvjkRAA; __Secure-1PSIDCC=AKEyXzV1rcZKPHtY92Lf4b1UpXpG4K8wDZTMvfNFcmfvwEioVbN1M3n_FdpabhLMS-pMANW8ww; __Secure-1PSID=g.a000DwmawvNu4Yp9FAFYklpC42ykh6XtWafAhx5_oLjw31k-neUVBmbYG_ebwSzIHbEKU8QeygACgYKAacSARUSFQHGX2Mi8rD5wpCkDJrHq20ikLsleRoVAUF8yKp2_4OzwZsPXWnA7g4ZTTGy0076; __Secure-1PAPISID=-0zzESUYbSous5Vl/AnSejw3kOncz8lCX2; YSC=wx1xMPg2xQs; VISITOR_PRIVACY_METADATA=CgJLRRIEGgAgYA%3D%3D; VISITOR_INFO1_LIVE=jigwsi9C080; SSID=AosC_TpXPLLBuh1qH; SIDCC=AKEyXzXHYMFtAsxEBgmMKp-TnbQkUa4DprvlNWVSbq3k5erusEAFmkwKrFjRWZqhEJRBFOer; SID=g.a000DwmawvNu4Yp9FAFYklpC42ykh6XtWafAhx5_oLjw31k-neUVDpjEjdk11uihOnl7kceGugACgYKAUkSARUSFQHGX2MiZ3lsJpzfkLNHP8zblVWymBoVAUF8yKqqHzBGvS4wCWO1z_24gO8u0076; SAPISID=-0zzESUYbSous5Vl/AnSejw3kOncz8lCX2; PREF=f6=40000000&tz=Africa.Nairobi&f7=100; LOGIN_INFO=AFmmF2swRQIhAOQ5BH3dd_3dq8DdIqQXeJmC3ONd9q9iR09zdCGRCtYBAiAaS8UTqrYuXZE53LCfQJgESthjnSAAAwSHLzsPbsrynA:QUQ3MjNmel9ycXRVc1dyTTh2SlBuaF8wRE81VC1xTGlpLTF6S2x0TU9VN3BDQzhfc3JwejRCX2pnQ0w1U1M0QU1qcTV6cG9yS1VWVFl6MDBVeTliNGJUSzBJY1lNQ1FLU051LWtHTGFaZ0VpU3pvRkFiVTB4LUotQzkwaUVCVUp3VzRTX19lSm9peTRuaE1YU2tOX3BTRnFxUWpHUjVNWWV3; HSID=Au93oBAPTY3p-i8b5; GPS=1; CONSISTENCY=AJDB8J8qppSamFjydWC52krEDoL93T1VgQu9XfO_JKE6XdvWXvcexnv7-yW0zXjvQGLm036tOk7Foor5fcweXJENqBANBlUAfMk2p-j0EqmeTXNmFAyR4jBWb5A20Euuosmj7jWr-0nmZMJTIlbSryYh; APISID=tcAGTbF9scceITOD/Aqt5necHL0IxpxFxT";

// Helper to format raw cookies into the array format required by @distube/ytdl-core
function formatCookies(cookieString) {
    return cookieString.split(';').map(c => {
        const [name, ...valueParts] = c.trim().split('=');
        return {
            domain: ".youtube.com",
            name: name,
            value: valueParts.join('='),
            path: "/",
            secure: true,
            httpOnly: true,
            hostOnly: false,
            sameSite: "no_restriction"
        };
    });
}

// Create the agent once
const agent = ytdl.createAgent(formatCookies(YT_COOKIES));

app.get('/', (req, res) => {
    res.json({ status: 'online', message: 'RickyDewizard Download API is running!' });
});

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    const type = req.query.type || 'audio';
    
    if (!videoUrl) return res.status(400).json({ error: 'URL is required' });

    try {
        console.log(`Fetching ${type} for: ${videoUrl}`);
        
        const info = await ytdl.getInfo(videoUrl, { agent }); // <-- Using the agent here
        
        const format = type === 'audio' 
            ? ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
            : ytdl.chooseFormat(info.formats, { quality: 'highest' });
            
        res.json({ success: true, download_url: format.url });
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch media: ' + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
