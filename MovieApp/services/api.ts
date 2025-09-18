const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NGFjZDAwN2VkMzY2YTBkYmJjZjU4Mjk5ZmZiZmI1ZCIsIm5iZiI6MTc1ODE4OTA1OS41NDksInN1YiI6IjY4Y2JkNjAzZTA0OTVmYmY1N2JkMGMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZydEym7tw2z9YJY5wDwjW_qxkAkk1_zBW_jm7RATh8c";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Common headers for API requests
const getHeaders = () => ({
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  "Content-Type": "application/json",
});

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  production_companies: { id: number; name: string; logo_path: string }[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Genre {
  id: number;
  name: string;
}

export const api = {
  getUpcomingMovies: async (): Promise<Movie[]> => {
    try {
      const response = await fetch(`${BASE_URL}/movie/upcoming`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      return [];
    }
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails | null> => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  },

  getMovieVideos: async (movieId: number): Promise<Video[]> => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}/videos`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error fetching movie videos:", error);
      return [];
    }
  },

  searchMovies: async (query: string): Promise<Movie[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
        {
          headers: getHeaders(),
        }
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    }
  },

  getGenres: async (): Promise<Genre[]> => {
    try {
      const response = await fetch(`${BASE_URL}/genre/movie/list`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      return data.genres || [];
    } catch (error) {
      console.error("Error fetching genres:", error);
      return [];
    }
  },

  getMoviesByGenre: async (genreId: number): Promise<Movie[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/discover/movie?with_genres=${genreId}`,
        {
          headers: getHeaders(),
        }
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      return [];
    }
  },

  getImageUrl: (path: string): string => {
    return `${IMAGE_BASE_URL}${path}`;
  },
};
