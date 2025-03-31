


console.log("start");

function setUpConfirmation () {

   // loadShowingInfo(selectedMovie, selectedShowing);
  
    let wares = getSessionWareData ();  
    
    let sortedWares = sortWares(wares);

    console.log(sortedWares)

    // construct tickets:
    constructTickets(sortedWares.tickets);


    // construct snacks
    constructSnacks(sortedWares.snacks);

    setMovieImage("film-image" ,selectedMovie.Image);

}

function getSessionWareData () {
    return JSON.parse(sessionStorage.getItem("sessionTickets"));
}

function getSessionRowsAndColumns () {
    return JSON.parse(sessionStorage.getItem("reservedseats"));
}




function sortWares (wares) {
    let snacks = [];
    let tickets = [];
    
    for (let i = 0; i < wares.length; i++) {
        if (wares[i].amount < 1) continue;
        
        if (wares[i].kategori == "billet") tickets.push(wares[i]) ;
        else if (wares[i].kategori == "snack") snacks.push(wares[i]);
       
    }
    return {"snacks": snacks, "tickets": tickets};
}

function constructTickets (tickets) {

    let outHtml = document.getElementById("confirmTickets");

    let constructTicketDisplay = `<div id = "confirmTickets" class = "split_grid">`;

    let rowsAndColumns = getSessionRowsAndColumns();

    for (let i = 0; i < tickets.length; i++) {
        for (let j = 0; j < tickets[i].amount; j++)
        constructTicketDisplay += ticketHTMLString(
            tickets[i].name,
            rowsAndColumns[i].row,
            rowsAndColumns[j].column,
        )
    }
    constructTicketDisplay += "</div>";
    outHtml.outerHTML = constructTicketDisplay;

}

function ticketHTMLString (billetType, row, column) {
    console.log("selectedMovie");
    console.log(selectedMovie);
    return `
    <div class = "default-padding-left">
        <h3>
            ${selectedMovie.Title}
        </h3>
        <p>
        ${billetType}
        </p>
        <p>
        Vises: Sal: ${selectedShowing.Hall}, kl:  ${selectedShowing.Time}
        </p>
        <p>
            plads: række ${row}, sæde ${column} 
        </p>
    </div>
    `
   // Vises: Sal: ${selectedShowing.Hall}, kl:  ${selectedShowing.Time}
}


function constructSnacks (snacks) {
    let outHtml = document.getElementById("confirmSnacks");
    console.log("snacks");
    console.log(snacks);

    let constructSnackDisplay = `<div id = "confirmSnacks" class = "split_grid">`;

    for (let i = 0; i < snacks.length; i++) {
       
            constructSnackDisplay += snackHTMLString(
            snacks[i].name,
            snacks[i].amount,
            snacks[i].title
            )
    }

    constructSnackDisplay += "</div>";
    outHtml.outerHTML = constructSnackDisplay;
}

function snackHTMLString (snackNavn, antal, beskrivelse) {
    return `
        
            <div class = "default-padding-left">
                <h2>
                    ${snackNavn}
                </h2>
                 <p>
                    ${beskrivelse}
                </p>
                <p>
                    antal: ${antal}
                </p>

            </div>
    `
}


function setMovieImage (id, src) {
    let outHTML = document.getElementById(id) 

    outHTML.innerHTML = `
    <img src=" ${src}" alt="Film title billede">
    `

} 