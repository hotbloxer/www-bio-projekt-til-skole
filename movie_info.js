
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

            hall.textContent = "Sal " + showing["Hall"];
            time.textContent = showing["Time"];
            button.textContent = "Køb billetter";

            button.onclick = () => {
                sessionStorage.setItem("SelectedShowing", JSON.stringify(showing));
                console.log(JSON.parse(sessionStorage.getItem("SelectedShowing")));
            }

            showingBox.appendChild(hall);
            showingBox.appendChild(time);
            showingBox.appendChild(button);
            dateBox.appendChild(showingBox);
        });

        prog.appendChild(dateBox);
    })
}

function getDates() {
    let dates = [];
    let currentDate = new Date();
    let d = currentDate.getDate();
    let m = currentDate.getMonth();
    let y = currentDate.getFullYear();

    for (let i = 0; i < 7; i++) {
        let date = new Date(y, m, d + i);
        dates[i] = date;
    }

    return dates;
}



