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
        button.textContent = "Køb billet";
        image.src = movie["Image"];
        title.textContent = movie["Original Title"];

        movieContent.appendChild(image);
        movieContent.appendChild(title);
        movieContent.appendChild(button);
        movieGrid.appendChild(movieContent);

        // let fig = document.createElement('figure');
        // let img = document.createElement('img');
        // let figcaption = document.createElement('figcaption');

        // figcaption.textContent = movie["Original Title"];
        // img.src = movie["Image"];

        // fig.appendChild(img);
        // fig.appendChild(figcaption);
        // e.appendChild(fig);
        // movieGrid.appendChild(e);
    });
}
