
getMovieInfo();

function getMovieInfo() {
    const selectedMovie = JSON.parse(sessionStorage.getItem("SelectedMovie"));
    let contentImg = document.getElementById('content-img');
    let title = document.getElementById('movie-title');
    let director = document.getElementById('director');
    let runtime = document.getElementById('runtime');
    let genre = document.getElementById('genre');

    contentImg.src = selectedMovie["Image"];
    title.textContent = selectedMovie["Original Title"];
    director.textContent = selectedMovie["Directors"];
    runtime.textContent = selectedMovie["Runtime (mins)"];
    genre.textContent = selectedMovie["Genres"];
}
   



