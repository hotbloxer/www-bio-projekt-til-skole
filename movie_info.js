
getMovieInfo();

function getMovieInfo() {
    const selectedMovie = JSON.parse(sessionStorage.getItem("SelectedMovie"));
    let contentImg = document.getElementById('content-img');
    let title = document.getElementById('movie-title');
    let director = document.getElementById('director');
    let runtime = document.getElementById('runtime');
    let genre = document.getElementById('genre');
    let description = document.getElementById('description');


    contentImg.src = selectedMovie["Image"];
    contentImg.alt = selectedMovie["Original Title"];
    contentImg.title = selectedMovie["Original Title"];
    title.textContent = selectedMovie["Original Title"];
    director.textContent = 'Instruktør: ' + selectedMovie["Directors"];
    runtime.textContent = 'Spilletid: ' + selectedMovie["Runtime (mins)"] + ' min';
    genre.textContent = 'Genre: ' + selectedMovie["Genres"];
    description.textContent = selectedMovie["Description"];
}
   



