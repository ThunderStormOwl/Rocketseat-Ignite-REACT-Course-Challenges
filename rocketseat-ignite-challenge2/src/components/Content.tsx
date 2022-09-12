import { useState } from 'react';
import { MovieCard } from './MovieCard';
import { Header } from './Header'
import { api } from '../services/api';
import '../styles/content.scss';

export interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface ContentProps {
  selectedGenreId: Number,
  selectedGenreTitle: string
}

export function Content(props : ContentProps) {

  const [movies, setMovies] = useState<MovieProps[]>([]);

  function getMovies(id: Number){
    api.get<MovieProps[]>(`movies/?Genre_id=${id}`).then(response => {
      setMovies(response.data);
    });
  };

  getMovies(props.selectedGenreId);

  return(
    <div className="container">
      <Header title={props.selectedGenreTitle}/>
      <main>
        <div className="movies-list">
          {movies.map(movie => (
            <MovieCard key ={movie.imdbID} title={movie.Title} poster={movie.Poster} runtime={movie.Runtime} rating={movie.Ratings[0].Value} />
          ))}
        </div>
      </main>
    </div>
  )
}
