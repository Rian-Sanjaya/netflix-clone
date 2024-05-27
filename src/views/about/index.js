/* eslint-disable jsx-a11y/heading-has-content */
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./style.css"

function About() {
  // let api_key = "e4621b68dcd1fa1de4a66cfd0664dc28";
  let api_key = process.env.REACT_APP_API_KEY

  let img_url = "https://image.tmdb.org/t/p/w500";
  let original_img_url = "https://image.tmdb.org/t/p/original";
  let genres_list_http = "https://api.themoviedb.org/3/genre/movie/list?";
  let movie_genres_http = "https://api.themoviedb.org/3/discover/movie?";
  let movie_detail_http = "https://api.themoviedb.org/3/movie";

  let location = useLocation()
  let navigate = useNavigate()

  useEffect(() => {
    let movie_id = location.pathname;

    fetch(`${movie_detail_http}${movie_id}?` + new URLSearchParams({
        api_key: api_key
    }))
    .then(res => res.json())
    .then(data => {
        setupMovieInfo(data);
    })

    const setupMovieInfo = (data) => {
      const movieName = document.querySelector('.movie-name');
      const genres = document.querySelector('.genres');
      const des = document.querySelector('.des');
      const title = document.querySelector('title');
      const backdrop = document.querySelector('.movie-info');

      title.innerHTML = movieName.innerHTML = data.title; 
      genres.innerHTML = `${data.release_date.split('-')[0]} | `;
      for(let i = 0; i < data.genres.length; i++){
        genres.innerHTML += data.genres[i].name + formatString(i, data.genres.length);
      }

      if(data.adult === true){
        genres.innerHTML += ' | +18';
      }

      if(data.backdrop_path === null){
        data.backdrop_path = data.poster_path;
      }

      des.innerHTML = data.overview.substring(0, 200) + '...';

      backdrop.style.backgroundImage = `url(${original_img_url}${data.backdrop_path})`;
    }

    const formatString = (currentIndex, maxIndex) => {
      return (currentIndex === maxIndex - 1) ? '' : ', ';
    }

    fetch(`${movie_detail_http}${movie_id}/credits?` + new URLSearchParams({
      api_key: api_key
    }))
    .then(res => res.json())
    .then(data => {
      const cast = document.querySelector('.starring');
      for(let i = 0; i < 5; i++){
        cast.innerHTML += data.cast[i].name + formatString(i, 5);
      }
    })

    fetch(`${movie_detail_http}${movie_id}/videos?` + new URLSearchParams({
        api_key: api_key
    }))
    .then(res => res.json())
    .then(data => {
      let trailerContainer = document.querySelector('.trailer-container');

      let maxClips = (data.results.length > 4) ? 4 : data.results.length;

      for(let i = 0; i < maxClips; i++){
        trailerContainer.innerHTML += `
        <iframe src="https://youtube.com/embed/${data.results[i].key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
      }
    })

    fetch(`${movie_detail_http}${movie_id}/recommendations?` + new URLSearchParams({
      api_key: api_key
    }))
    .then(res => res.json())
    .then(data => {
      let container = document.querySelector('.recommendations-container');
      for(let i = 0; i < 16; i++){
        if(data.results[i].backdrop_path === null){
          i++;
        }
        container.innerHTML += `
        <div class="movie" onclick="location.href = '/${data.results[i].id}'">
          <img src="${img_url}${data.results[i].backdrop_path}" alt="">
          <p class="movie-title">${data.results[i].title}</p>
        </div>
        `;
      }
    })
  }, [api_key, genres_list_http, img_url, original_img_url, movie_genres_http, movie_detail_http, location.pathname])

  return (
    <>
      <nav className="navbar">
          <img src="img/logo.png" className="logo" alt="" onClick={() => navigate("/")} />
          <div className="join-box">
              <p className="join-msg">unlimited tv shows & movies</p>
              <button className="btn join-btn">join now</button>
              <button className="btn">sign in</button>
          </div>
      </nav>

      <div className="movie-info">
        <div className="movie-detail">
          <h1 className="movie-name"></h1>
          <p className="genres"></p>
          <p className="des"></p>
          <p className="starring"><span>Starring:</span></p>
        </div>
      </div>

      <div className="trailer-container">
        <h1 className="heading">Video Clip</h1>
        {/* <iframe src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
      </div>

      <div className="recommendations">
        <h1 className="heading">More Like This</h1>
        <div className="recommendations-container">
          <div className="movie">
            <img src="img/poster.jpg" alt="" />
            <p className="movie-title">movie name</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default About