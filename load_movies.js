
loadMovies();

async function loadMovies() {
    const response = await fetch("data/film_liste.json");
    const obj = await response.json();
    let movies = obj.Movies;

    movieSearchBar(movies);
    fillMovieGrid(movies);
    fillHeroSquares(movies);    
}

function movieSearchBar(movies) {
    let searchbar = document.getElementById('search-bar');
    let searchInput = document.createElement('input');
    let searchButton = document.createElement('button');
    let resetButton = document.createElement('button');

    searchInput.placeholder = "titel, instruktør år, medvirkende";
    searchButton.textContent = "Søg";
    searchButton.onclick = () => {
        let searchResults = movies.filter(movie => {
            const isInTitles = movie["Original Title"].toLowerCase().includes(searchInput.value.toLowerCase());
            const isInGenres = movie["Genres"].toLowerCase().includes(searchInput.value.toLowerCase());
            const isInDirectors = movie["Directors"].toLowerCase().includes(searchInput.value.toLowerCase())
            const isInCast = movie["Cast"].toLowerCase().includes(searchInput.value.toLowerCase());
            const isYear = movie["Year"] === Number(searchInput.value);

            return isInDirectors || isInGenres || isInTitles || isInCast || isYear;
        });

        fillMovieGrid(searchResults);
    }

    resetButton.textContent = "Nulstil søgning";
    resetButton.onclick = () => {
        fillMovieGrid(movies);
        searchInput.value = '';
    }

    searchbar.appendChild(searchInput);
    searchbar.appendChild(searchButton);
    searchbar.appendChild(resetButton);
}

function fillMovieGrid(movies) {
    let movieGrid = document.getElementById('all-movies');
    movieGrid.innerHTML = '';

    movies.forEach(movie => {
        let movieContent = fillMovieContent(movie);
        movieGrid.appendChild(movieContent);
    });
}

function fillMovieContent(movie) {
    let movieContent = document.createElement('div');
    let image = document.createElement('img');
    let title = document.createElement('div');
    let button = document.createElement('button');
    
    movieContent.className = "movie-content";

    image.src = movie["Image"];
    image.alt = movie["Original Title"];
    image.title = movie["Original Title"];

    title.textContent = movie["Original Title"];
    
    button.textContent = "Vælg film";
    button.onclick = () => selectMovie(movie);

    movieContent.appendChild(image);
    movieContent.appendChild(title);
    movieContent.appendChild(button);

    return movieContent;
}

function fillHeroSquares(movies) {
    let heroSquares = document.getElementsByClassName("hero-content hero-square ");
    let prevIndices = [];
    
    for(let heroSquare of heroSquares) {
        let index = getRandomInt(movies.length);
        while (prevIndices.includes(index)) {
            index = getRandomInt(movies.length);
        }
        prevIndices.push(index);
        
        let movie = movies[index];
        fillHeroSquare(heroSquare, movie);
    }
}

function fillHeroSquare(heroSquare, movie) {
    let bigPic = document.createElement('div');
    let img = document.createElement('img');
    let heroAction = document.createElement('div');
    let title = document.createElement('h1');
    let button = document.createElement('button');

    img.src = movie["Big Image"]; 
    img.alt = movie["Original Title"];
    img.title = movie["Original Title"];

    heroAction.className = "hero-action";
    title.textContent = movie["Original Title"];

    button.textContent = "Vælg film";
    button.onclick = () => selectMovie(movie);

    bigPic.appendChild(img);
    heroAction.appendChild(title);
    heroAction.appendChild(button);

    heroSquare.appendChild(bigPic);
    heroSquare.appendChild(heroAction);
}

function selectMovie(movie) {
    sessionStorage.setItem("SelectedMovie", JSON.stringify(movie));
    window.location = "movieinfo.html";
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

