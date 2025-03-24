
loadMovies();

async function loadMovies() {
    const response = await fetch("data/film_liste.json");
    const obj = await response.json();
    let ul = document.createElement('ul');

    let movs = document.getElementById("movies");

    obj.movies.forEach(movie => {
        let li = document.createElement('li');
        li.textContent = movie.Title;

        ul.appendChild(li);
    });
    
    movs.appendChild(ul);
}



