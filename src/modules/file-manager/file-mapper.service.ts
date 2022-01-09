import { Injectable } from '@nestjs/common'

@Injectable()
export class FileMapperService {
  constructor() {}
  /**
   * Given you have episode number and season number, map them
   * @param file
   * @param episodes
   * @returns
   */
  mapFileToEpisodeWithSeason(file: any, episodes: any) {
    if (file.episode && file.season) {
      return episodes.find(
        (episode: any) =>
          episode.episode === file.episode &&
          file.season === episode.seasonNumber,
      )
    }
    return this.mapFilesToEpisodes(file, episodes)
  }

  /**
   * Sort episodes in array by season and episode number
   * @param episodes
   * @returns
   */
  sortEpisodes(episodes: any) {
    return episodes.sort((a: any, b: any) => {
      if (a.seasonNumber === b.seasonNumber) {
        return a.episode - b.episode
      }
      return a.seasonNumber - b.seasonNumber
    })
  }

  /**
   * Convert object of seasons to array of episodes (ordered)
   * (seasons from episodesToSeasons)
   * @param seasons
   * @returns
   */
  seasonsToEpisodes(seasons: any) {
    return Object.keys(seasons).reduce(
      (acc: any[], season: any) => [...acc, ...seasons[season]],
      [],
    )
  }

  /**
   * Convert array of episodes to object of seasons
   * (episodes from metadata)
   * @param episodes
   * @returns
   */
  episodesToSeasons(episodes: any) {
    return episodes.reduce((acc: any, episode: any) => {
      const season = acc[episode.seasonNumber] || []
      return {
        ...acc,
        [episode.seasonNumber]: [...season, episode],
      }
    }, {})
  }

  /**
   * Given an episode number without season, map to the episode with the season
   * @param episodeNumber
   * @param episodes
   * @returns
   */
  getEpisodeFromEpisodeNumber(episodeNumber: any, episodes: any) {
    // const seasons = episodesToSeasons(episodes)
    const episode = episodes.find((searchEpisode: any, i: number) => {
      /* if (searchEpisode.episode === episodeNumber) {
      return searchEpisode
    } */
      if (i + 1 === episodeNumber) {
        return searchEpisode
      }
      return null
    })
    return episode
  }

  getEpisodeByOtherMeans(file: any, episodes: any) {
    const episode = episodes.find((episode: any) => {
      if (file.year) {
        return file.year.toString() === episode.aired.toString().slice(0, 4)
      }
      return false
    })
    return episode || false
  }

  mapFilesToEpisodes(files: any[], episodes: any[]) {
    const seasons = this.episodesToSeasons(episodes)
    const sortedEpisodes = this.sortEpisodes(episodes)
    // season count
    // const seasonsCount = Object.keys(seasons).length
    const seasonsCountNoSpecial = Object.keys(seasons).filter(
      (season) => season.toString() !== '0',
    ).length
    return files
      .map((file) => {
        if (file.episode && file.season) {
          return {
            ...file,
            fileName: file.name,
            ...episodes.find(
              (episode: any) =>
                episode.episode === file.episode &&
                file.season === episode.seasonNumber,
            ),
          }
        }
        if (file.episode && seasonsCountNoSpecial.toString() === '1') {
          return {
            ...file,
            fileName: file.name,
            ...episodes.find((episode: any) => episode.number === file.episode),
          }
        }
        const episode = this.getEpisodeFromEpisodeNumber(
          file.episode,
          sortedEpisodes,
        )
        if (!episode) {
          const alternativeEpisode = this.getEpisodeByOtherMeans(
            file,
            sortedEpisodes,
          )
          if (alternativeEpisode) {
            return {
              ...file,
              fileName: file.name,
              ...alternativeEpisode,
              seasonNumber: 0,
              season: 0,
            }
          }
          return null
        }
        return {
          ...file,
          fileName: file.name,
          ...episode,
        }
      })
      .filter((episode: any) => episode)
  }
}
