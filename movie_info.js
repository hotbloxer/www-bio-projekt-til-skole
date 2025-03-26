
getMovieInfo();
getMovieSchedule();

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

async function getMovieSchedule() {
    const response = await fetch('Data/spille_tider.json');
    const obj = await response.json();

    const selectedMovie = JSON.parse(sessionStorage.getItem("SelectedMovie"));
    let schedule = obj.Movies.find(movie => movie["Title"] == selectedMovie["Original Title"]);
    let showings = schedule.Program;

    showings.forEach(showing => console.log(showing["Day"]));

    var currentDate = new Date(),
    d = currentDate.getDate(),
    m = currentDate.getMonth(),
    y = currentDate.getFullYear();

    let dates = [];

    for (let i = 0; i < 7; i++) {
        var date = new Date(y, m, d + i);
        console.log(date);
        dates[i] = date;
    }

 
    dates.forEach( date => {
        let times = showings.filter(showing => showing["Day"] == date.getDate());
        console.log(times);

    })

   


}
   



