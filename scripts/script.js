'use strict';

window.addEventListener('load', () => {
    console.log('load');
    //Förslagsvis anropar ni era funktioner som skall sätta lyssnare, rendera objekt osv. härifrån
    setupCarousel();
});


//Sökfältet

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

async function loadMovies(searchTerm) {
    const URL = `http://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=2ec75983`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response == "True") {
        displayMovieList(data.Search);
    }
}

function findMovies() {
    let searchTerm = movieSearchBox.value;
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++ ){
        let movieListItem = document.createElement('div');
        console.log(movieListItem);
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');
        let moviePoster = movies[idx].Poster != "N/A" ? movies[idx].Poster : "error.jpg";

        movieListItem.innerHTML = `
            <div class="search-list-thumbnail">
                <img src="${moviePoster}">  
            </div>
            <div class="search-item-info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async() => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch (`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=2ec75983`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        })
    })
}

function displayMovieDetails(details) {
    const movieDetailsContainer = document.getElementById('movieDetails');

    movieDetailsContainer.innerHTML = `
        <div class="movie-poster">
            <img src="${(details.Poster != "N/A") ? details.Poster : "error.jpg"}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <p class="movie-year">Year: ${details.Year}</p>
                <p class="movie-genre">Genre: ${details.Genre}</p>
                <p class="movie-writer">Writer: ${details.Writer}</p>
                <p class="movie-actors">Actors: ${details.Actors} </p>
                <p class="movie-plot">Plot: ${details.Plot}</p>
            </ul>
        </div>
    `;
}


document.addEventListener('DOMContentLoaded', async function () {
    const API_URL = 'https://santosnr6.github.io/Data/movies.json';
    const movieContainer = document.querySelector('[data-movie-container]');

    async function fetchTrailers() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function displayRandomTrailers() {
        const movies = await fetchTrailers();
        const shuffledMovies = shuffleArray(movies);
        const randomTrailers = shuffledMovies.slice(0, 5);

        randomTrailers.forEach(movie => {
            const trailerLink = movie.trailer_link;
            const iframe = document.createElement('iframe');
            iframe.src = trailerLink;
            iframe.classList.add('movie-trailer-iframe');
            iframe.setAttribute('frameborder', '0');
            movieContainer.appendChild(iframe);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    displayRandomTrailers();
});

const movieUrl = "https://santosnr6.github.io/Data/movies.json";
const movieListElement = document.getElementById("movieList");

fetch(movieUrl)
.then(function (response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(function (data) {
    renderMovieTitles(data);
    console.log(data)
})
.catch(function (err) {
    console.warn('Something went wrong.', err);
});

function renderMovieTitles(movies) {
    movieListElement.innerHTML = "";

    const ul = document.createElement("ul");
    ul.classList.add("movie-ul");

    movies.forEach(function(movie) {
        const li = document.createElement("li");

        li.classList.add("movie-item");

        const titleSpan = document.createElement("span");
        
        titleSpan.classList.add("movie-title")


        titleSpan.textContent = movie.title;
        li.appendChild(titleSpan);
        const img = document.createElement("img");

        img.classList.add("movie-img")
        img.src = movie.poster;
        img.alt = movie.title;
        li.appendChild(img); 

        ul.appendChild(li);
    });

    movieListElement.appendChild(ul);
}