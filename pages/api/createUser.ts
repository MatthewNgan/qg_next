export default async function handler(req, res) {
  if (req.method === 'POST') {
    await fetch(`${process.env.BACKEND_SERVER}/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    }).then(response => {
      if (response.status !== 200) throw response.statusText;
      return response.json()
    }).then(data => res.status(200).json(data)).catch(error => res.status(500).send(error));
  }
}