export default async function handler(req, res) {
  if (req.method === 'GET') {
    await fetch(`http://${process.env.GOOGLE_FORM_API_SERVER}/getresponses?form_id=${req.query.id}`, {
      method: 'GET',
      headers: {
        'Authorization': req.headers.authorization
      }
    }).then(response => {
      if (response.status !== 200) throw response.statusText
      return response.json()
    }).then(data => res.status(200).json(data)).catch(error => res.status(500).statusText(error));
  }
}