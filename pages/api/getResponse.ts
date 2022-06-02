export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = await fetch(`http://${process.env.GOOGLE_FORM_API_SERVER}/getresponses?id=${req.query.id}`).then(response => response.json());
    res.status(200).json(data);
  }
}