
loadMovies();

async function loadMovies() {
    const response = await fetch("data/film_liste.json");
    const obj = await response.json();

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
