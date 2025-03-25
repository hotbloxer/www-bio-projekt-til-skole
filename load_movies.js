
loadMovies();

async function loadMovies() {
    const response = await fetch("data/film_liste.json");
    const obj = await response.json();

    let movieGrid = document.getElementById('movies');

    obj.movies.forEach(movie => {
        let e = document.createElement('div');
        let fig = document.createElement('figure');
        let img = document.createElement('img');
        let figcaption = document.createElement('figcaption');

        figcaption.textContent = movie["Original Title"];
        img.src = movie["Image"];

        fig.appendChild(img);
        fig.appendChild(figcaption);
        e.appendChild(fig);
        movieGrid.appendChild(e);
    });
}
