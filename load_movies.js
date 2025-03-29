
loadMovies();

async function loadMovies() {
    const response = await fetch("data/film_liste.json");
    const obj = await response.json();

    fillMovieGrid(obj);
    fillHeroActions(obj);    
}

function fillMovieGrid(obj) {
    let movieGrid = document.getElementById('all-movies');

    obj.Movies.forEach(movie => {
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
        button.onclick = () => {
            sessionStorage.setItem("SelectedMovie", JSON.stringify(movie));
            window.location = "movieinfo.html";
        } 

        movieContent.appendChild(image);
        movieContent.appendChild(title);
        movieContent.appendChild(button);
        movieGrid.appendChild(movieContent);
    });
}

function fillHeroActions(obj) {
    let heroSquares = document.getElementsByClassName("hero-content hero-square ");
    // console.log(heroSquares);

    for(let heroSquare of heroSquares) {
        let index = getRandomInt(obj.Movies.length);
        
        let bigPic = document.createElement('div');
        let img = document.createElement('img');
        let heroAction = document.createElement('div');
        let title = document.createElement('h1');
        let button = document.createElement('button');
        let description = document.createElement('p');

        img.src = obj.Movies[index]["Image"];
        heroAction.className = "hero-action";
        title.textContent = obj.Movies[index]["Original Title"];
        // description.textContent = obj.Movies[index]["Description"];
        button.textContent = "Vælg film";

        button.onclick = () => {
            sessionStorage.setItem("SelectedMovie", JSON.stringify(obj.Movies[index]));
            window.location = "movieinfo.html";
        }

        bigPic.appendChild(img);
        heroAction.appendChild(title);
        heroAction.appendChild(button);

        // heroAction.appendChild(description);
        heroSquare.appendChild(bigPic);
        heroSquare.appendChild(heroAction);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

