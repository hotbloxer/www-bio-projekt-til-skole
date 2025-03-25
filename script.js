
loadMovies();

async function loadMovies() {
    const response = await fetch("data/film_liste.json");
    const obj = await response.json();

    let movs = document.getElementById('movies');
    let mov = document.createElement('div');

    obj.movies.forEach(movie => {
        let e = document.createElement('div');
        let img = document.createElement('img');

        e.textContent = movie["Original Title"];
        img.src = movie["Image"];

        mov.appendChild(img);
        mov.appendChild(e);
    });
    
    movs.appendChild(mov);
}



