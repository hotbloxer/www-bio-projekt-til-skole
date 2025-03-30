
loadMovies();

async function loadMovies() {
    const response = await fetch("data/film_liste.json");
    const obj = await response.json();

    movieSearchBar(obj);
    fillMovieGrid(obj.Movies);
    fillHeroSquares(obj);    
}

function movieSearchBar(obj) {
    let searchbar = document.getElementById('search-bar');
    let search = document.createElement('input');
    let button = document.createElement('button');

    button.textContent = "Søg";
    button.onclick = () => {
        let results = [];

        obj.Movies.forEach(movie => {
            const isInTitles = movie["Original Title"].toLowerCase().includes(search.value.toLowerCase());
            const isInGenres = movie["Genres"].toLowerCase().includes(search.value.toLowerCase());
            const isInDirectors = movie["Directors"].toLowerCase().includes(search.value.toLowerCase())
            const isInCast = movie["Cast"].toLowerCase().includes(search.value.toLowerCase());

            if(isInDirectors || isInGenres || isInTitles || isInCast) 
                results.push(movie);
        });

        fillMovieGrid(results);
    }

    searchbar.appendChild(search);
    searchbar.appendChild(button);
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

function fillHeroSquares(obj) {
    let heroSquares = document.getElementsByClassName("hero-content hero-square ");
    let prevIndices = [];
    for(let heroSquare of heroSquares) {
        let index = getRandomInt(obj.Movies.length);
        while (prevIndices.includes(index)) {
            index = getRandomInt(obj.Movies.length);
        }
        prevIndices.push(index);
        
        let movie = obj.Movies[index];
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

