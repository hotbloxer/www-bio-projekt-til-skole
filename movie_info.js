
const selectedMovie = JSON.parse(sessionStorage.getItem("SelectedMovie"));
getMovieInfo(selectedMovie);
getMovieSchedule(selectedMovie);

function getMovieInfo(selectedMovie) {
    let contentImg = document.getElementById('content-img');
    let age = document.getElementById('age');
    let title = document.getElementById('movie-title');
    let director = document.getElementById('director');
    let runtime = document.getElementById('runtime');
    let genre = document.getElementById('genre');
    let cast = document.getElementById('cast');
    let year = document.getElementById('year');
    let description = document.getElementById('description');


    contentImg.src = selectedMovie["Big Image"];
    contentImg.alt = selectedMovie["Original Title"];
    contentImg.title = selectedMovie["Original Title"];
    age.textContent = "Aldersgrænse: " + selectedMovie["Age"];
    title.textContent = selectedMovie["Original Title"];
    director.textContent = 'Instruktør: ' + selectedMovie["Directors"];
    runtime.textContent = 'Spilletid: ' + selectedMovie["Runtime (mins)"] + ' min';
    genre.textContent = 'Genre: ' + selectedMovie["Genres"];
    cast.textContent = 'Medvirkende: ' + selectedMovie["Cast"];
    year.textContent = 'År: ' + selectedMovie["Year"];
    description.textContent = selectedMovie["Description"];
}

async function getMovieSchedule(selectedMovie) {
    const response = await fetch('Data/spille_tider.json');
    const obj = await response.json();

    let schedule = obj.Movies.find(movie => movie["Title"] === selectedMovie["Original Title"]);
    let showings = schedule.Program;
    let dates = getDates();

    dates.forEach(date => {
        let showingsOnDate = showings.filter(showing => showing["Day"] == date.getDate());  
        let prog = document.getElementById('program');
        let dateBox = document.createElement('div');
        let dateDisplay = document.createElement('p');
        
        dateDisplay.textContent = date.getDate() + "/" + date.getMonth();
        dateBox.appendChild(dateDisplay);
        
        showingsOnDate.forEach(showing => {
            let showingBox =document.createElement('div');
            let hall = document.createElement('p');
            let time = document.createElement('p');
            let button = document.createElement('button');

            showingBox.className = 'display-date';
            hall.textContent = "Sal " + showing["Hall"];
            time.textContent = showing["Time"];
            button.textContent = "Køb billetter";

            button.onclick = () => {
                sessionStorage.setItem("SelectedShowing", JSON.stringify(showing));
                console.log(JSON.parse(sessionStorage.getItem("SelectedShowing")));
                window.location = 'seat-selection.html';
            }

            showingBox.appendChild(hall);
            showingBox.appendChild(time);
            showingBox.appendChild(button);
            dateBox.appendChild(showingBox);
        });

        prog.appendChild(dateBox);
    });
}

function getDates() {
    let dates = [];
    let currentDate = new Date();
    let d = currentDate.getDate();
    let m = currentDate.getMonth();
    let y = currentDate.getFullYear();

    for (let i = 0; i < 7; i++) {
        let date = new Date(y, m + 1, d + i);
        dates[i] = date;
    }

    return dates;
}