export interface FullAnime {
  title: string
  description: string
  synonyms: string[]
  type: string
  episodes: number
  tags: string[]
  anidbid: string
  picture: string
  thumbnail: string
  relations: string[]
}

export interface AnimeTitle {
  title: string
  anidbid: number
  defaulttvdbseason: number
  episodeoffset: number
  synonyms: string[]
  tmdbid: number
  imdbid: string
}
