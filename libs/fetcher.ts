export const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
      'x-rapidapi-key': 'b1ce7d6ccdmsh2c20195f3dde848p1750d9jsn420336a43a7a',
    },
  }).then((r) => r.json())
