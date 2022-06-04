export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = await fetch(`http://${process.env.GOOGLE_FORM_API_SERVER}/getform?form_id=${req.query.id}`, {method: 'GET', headers: {
      'Authorization': req.headers.authorization
    }}).then(response => response.json());
    res.status(200).json(data);
  }
}