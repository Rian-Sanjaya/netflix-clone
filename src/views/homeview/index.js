import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./style.css"

function HomeView() {
  let api_key = process.env.REACT_APP_API_KEY;

  let img_url = "https://image.tmdb.org/t/p/w500";
  // let original_img_url = "https://image.tmdb.org/t/p/original";
  let genres_list_http = "https://api.themoviedb.org/3/genre/movie/list?";
  let movie_genres_http = "https://api.themoviedb.org/3/discover/movie?";
  // let movie_detail_http = "https://api.themoviedb.org/3/movie";

  let navigate = useNavigate()

  useEffect(() => {
    const main = document.querySelector('.main');

    fetch(genres_list_http + new URLSearchParams({
        api_key: api_key
    }))
    .then(res => res.json())
    .then(data => {
        data.genres.forEach(item => {
            fetchMoviesListByGenres(item.id, item.name);
        })
    });

    const fetchMoviesListByGenres = (id, genres) => {
        fetch(movie_genres_http + new URLSearchParams({
            api_key: api_key,
            with_genres: id,
            page: Math.floor(Math.random() * 3) + 1
        }))
        .then(res => res.json())
        .then(data => {
            makeCategoryElement(`${genres}_movies`, data.results);
        })
        .catch(err =>  console.log(err));
    }

    const makeCategoryElement = (category, data) => {
        main.innerHTML += `
        <div class="movie-list">

            <button class="pre-btn"><img src="img/pre.png" alt=""></button>

            <h1 class="movie-category">${category.split("_").join(" ")}</h1>

            <div class="movie-container" id="${category}">

            </div>

            <button class="nxt-btn"><img src="img/nxt.png" alt=""></button>

        </div>
        `;
        makeCards(category, data);
    }

    const makeCards = (id, data) => {
        const movieContainer = document.getElementById(id);
        data.forEach((item, i) => {
            if(item.backdrop_path === null){
                item.backdrop_path = item.poster_path;
                if(item.backdrop_path === null){
                    return;
                }
            }

            movieContainer.innerHTML += `
            <div class="movie" onclick="location.href = '/${item.id}'">
                <img src="${img_url}${item.backdrop_path}" alt="">
                <p class="movie-title">${item.title}</p>
            </div>
            `;

            if(i === data.length - 1){
                setTimeout(() => {
                    setupScrolling();
                }, 100);
            }
        })
    }
  }, [api_key, genres_list_http, img_url, movie_genres_http])

  const setupScrolling = () => {
    const conainter = [...document.querySelectorAll('.movie-container')];
    const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
    const preBtn = [...document.querySelectorAll('.pre-btn')];

    conainter.forEach((item, i) => {
      let containerDimensions = item.getBoundingClientRect();
      let containerWidth = containerDimensions.width;

      nxtBtn[i].addEventListener('click', () => {
        item.scrollLeft += containerWidth;
      })

      preBtn[i].addEventListener('click', () => {
        item.scrollLeft -= containerWidth;
      })
    })
  }

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

      <header className="main">
        <h1 className="heading">movies</h1>
        <p className="info">Movies move us like nothing else can, whether they're scary, funny, dramatic, romantic or anywhere in-between. So many titles, so much to experience.</p>
        {/* <div class="movie-list">

            <button class="pre-btn"><img src="img/pre.png" alt=""></button>

            <h1 class="movie-category">Popular movie</h1>

            <div class="movie-container">
                <div class="movie">
                    <img src="img/poster.jpg" alt="">
                    <p class="movie-title">movie name</p>
                </div>
            </div>

            <button class="nxt-btn"><img src="img/nxt.png" alt=""></button>

        </div> */}
    </header>
    </>
  )
}

export default HomeView