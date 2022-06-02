export default async function handler(req, res) {
    if (req.method === 'POST') {
        const data = await fetch(`http://${process.env.COMPREHELP_SERVER}/qg`, {
            method: 'POST',
            body: JSON.stringify({
                text: req.body.text
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json());
        res.status(200).json(data);
    }
}