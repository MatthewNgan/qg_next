export default async function handler(req, res) {
    if (req.method === 'POST') {
        const data = await fetch(`http://${process.env.GOOGLE_FORM_API_SERVER}/generate`, {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json());
        res.status(200).json(data);
    }
}