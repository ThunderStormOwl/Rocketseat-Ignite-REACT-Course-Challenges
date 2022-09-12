import { useState } from 'react';
import { SideBar, GenreResponseProps } from './components/SideBar';
import { Content, MovieProps } from './components/Content';
import './styles/global.scss';

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [selectedGenreTitle, setSelectedGenreTitle] = useState("");

  function handleClickButton(id: number, title: string) {
    setSelectedGenreId(id);
    setSelectedGenreTitle(title);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SideBar handleClick={handleClickButton} />
      <Content selectedGenreId={selectedGenreId} selectedGenreTitle={selectedGenreTitle}/>
    </div>
  )
}