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
    return this.client.get(`/seasons/${tvdbid}`)
  }
  async getMetadata(tvdbid: string, type?: string) {
    if (!type) {
      try {
        const [main, extened, translationseng] = await Promise.all([
          this.client.get(`/series/${tvdbid}/episodes/default/eng`),
          this.client.get(`/series/${tvdbid}/extended`),
          this.client.get(`/series/${tvdbid}/translations/eng`),
        ])
        main.data.data.artworks = extened.data.data.artworks
        main.data.translations = translationseng.data
        return main
      } catch (e) {
        try {
          return this.client.get(`/movies/${tvdbid}/extended`)
        } catch (e) {
          return {}
        }
      }
    }
    if (type === 'series') {
      const [main, extened, translationseng] = await Promise.all([
        this.client.get(
          `/${type.toLowerCase()}/${tvdbid}/episodes/default/eng`,
        ),
        this.client.get(`/${type.toLowerCase()}/${tvdbid}/extended`),
        this.client.get(`/${type.toLowerCase()}/${tvdbid}/translations/eng`),
      ])
      main.data.data.artworks = extened.data.data.artworks
      main.data.data.translations = translationseng.data.data
      return main
    } else {
      return this.client.get(`/${type.toLowerCase()}/${tvdbid}/extended`)
    }
  }
  async searchMetadata(query: string, type?: string) {
    if (!type) {
      return this.client.get(`/search?q=${encodeURIComponent(query)}`)
    }
    return this.client.get(
      `/search?q=${encodeURIComponent(query)}&type=${type}`,
    )
  }
  async searchAny(query: string) {
    return this.client.get(
      `/search?q=${encodeURIComponent(query)}&language=eng`,
    )
  }
}

export { TheTvDbClient }
