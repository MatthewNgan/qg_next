export default async function handler(req, res) {
  if (req.method === 'POST') {
    await fetch(`${process.env.COMPREHELP_SERVER}/qg`, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status !== 200) throw response.statusText
      return response.json()
    }).then(data => res.status(200).json(data)).catch(error => res.status(500).send(error));
  }
}