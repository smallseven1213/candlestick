export const fetcher = async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(input, {
      ...init,
      headers: {
        'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
        'x-rapidapi-key': 'b1ce7d6ccdmsh2c20195f3dde848p1750d9jsn420336a43a7a',
      },
    })

    if (res.status !== 200) {
      throw {
        status: res.status,
        statusText: res.statusText,
      }
    }
    return res.json()
  } catch (error) {
    throw error
  }
}
