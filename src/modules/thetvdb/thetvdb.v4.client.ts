import axios, { AxiosInstance } from 'axios'

class TheTvDbClient {
  private readonly apiKey: string
  private readonly pin: string
  private authToken: string
  private client: AxiosInstance
  constructor(apiKey: string, pin: string) {
    this.apiKey = apiKey
    this.pin = pin
    axios
      .post(`https://api4.thetvdb.com/v4/login`, {
        apikey: this.apiKey,
        pin: this.pin,
      })
      .then((data) => {
        this.authToken = data.data.data.token
        console.log(data.data)
        this.client = axios.create({
          baseURL: 'https://api4.thetvdb.com/v4',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${this.authToken}`,
          },
        })
      })
  }
  getSeasons(tvdbid: string) {
    console.log(tvdbid)
    return this.client.get(`/seasons/${tvdbid}`)
  }
  async getMetadata(tvdbid: string, type: string) {
    if (type === 'series') {
      const [main, extened] = await Promise.all([
        this.client.get(`/${type}/${tvdbid}/episodes/default/eng`),
        this.client.get(`/${type}/${tvdbid}/extended`),
      ])
      main.data.data.artworks = extened.data.data.artworks
      return main
    } else {
      return this.client.get(`/${type}/${tvdbid}/extended`)
    }
  }
  async searchMetadata(query: string, type: string) {
    return this.client.get(
      `/search?q=${encodeURIComponent(query)}&type=${type}`,
    )
  }
}

export { TheTvDbClient }
