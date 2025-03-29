
const selectedMovie = JSON.parse(sessionStorage.getItem("SelectedMovie"));
const selectedShowing = JSON.parse(sessionStorage.getItem("SelectedShowing"));

function loadShowingInfo(selectedMovie, selectedShowing) {
    let title = document.getElementById('film-title');
    let runtime = document.getElementById('runtime');

    
    title.textContent = selectedMovie["Original Title"];
    runtime.textContent = "Spilletid: " + selectedMovie["Runtime (mins)"] + " min\n";

}

// indeledende funktion kaldt fra hjemmeside

console.log({selectedMovie, selectedShowing});

function constructCinemaSal() {
    //  fetchData("sal4");
    fetchData("sal" + selectedShowing["Hall"]);
    loadShowingInfo(selectedMovie, selectedShowing);
}

// fetch data opretter også hele salen
// oprettelsen blev nødt til at sket i .then (data) delen, for at undgå asuny mareridt
function fetchData (sal) {
    fetch("data/sal_data.json")
    .then(res => res.json())
    .then(data =>  {

        let val = Object.values(data.find(item => item[sal]));
        fillGrid("seats", val[0].columns, val[0].rows);

    })
    .catch(e => {
        console.log(e);
    })
}

// denne udfylder alle sæderne i biografen
function fillGrid  (id, columns, rows) {

    var idTag = document.getElementById(id)
    var constructElement = `
    <div 
    style="display: grid; 
    grid-template-columns: repeat(${rows}, 1fr); 
    grid-template-rows: repeat(${columns}, 1fr); ">
    `;

    let seatsSelected = getListOfReservedSeats();

    for (let r = 0; r<rows; r++) {
        
        for (let c = 0; c < columns; c++) {

            let isThisSeatSelected = 0;
            console.log(seatsSelected);

            
            if (isEntryInList(seatsSelected, r,c)) {
                isThisSeatSelected = 1
            }

            constructElement += constructSeat(isThisSeatSelected, r, c);
        }
    }

    constructElement += "</div>";
    idTag.innerHTML = constructElement;
}


// denne opretter det specifikke sæde i salen
//status 0 free, 1 selected, 2 reserved
function constructSeat (status, r,c) {
    let id = "r" + r + "c" + c;
    if (status == 0) {
        return `
        <button onclick = "seatClicked(${id})" id = ${id} class = "seat seat-free"> d</button>
        `   
    }

    if (status == 1) {
        return `
        <button onclick = "seatClicked(${id})" id = ${id} class = "seat seat-selected"> d</button>
        `  
    }
    return `<div class = "seat seat-reserved"> d</div>`
}



// registre hvilket sæde der er blevet valgt
function seatClicked (id) {

    let change = document.getElementById(id.id);

    var rNumber = "";
    var cNumber = "";


    // seperer tallene fra id.
    // fx c2r5 bliver c = 2, og r = 5
    for (let char of id.id) {
        if (char === 'c') {
            foundC = true;
        } else if (char === 'r') {
            foundC = false;
        } else if (!isNaN(char)) {
            if (foundC) {
                cNumber += char;
            } else {
                rNumber += char;
            }
        }
    }

    if (seatCanBeSelected(rNumber, cNumber)) {
        setReserveSeat(rNumber, cNumber)
        change.outerHTML = constructSeat(1, rNumber,cNumber);
    }
}



// denne funktion tjekker der er valgt for mange pladser i forhold til bestilte billetter 
function seatCanBeSelected (r, c) {
    let totalTickets = calcualteTotalSum().tickets;
    let seatsSelected = getListOfReservedSeats();

    if (seatsSelected.length < 1) {
        return true;
    }

    // check om entry allerede eksistere i liste
    if (isEntryInList(seatsSelected, r, c)) {
        return false;
    }
   
    // check om der er valgt nok billetter
    if (totalTickets > seatsSelected.length) {
        return true;
    }

    return false;
}

function isEntryInList (seatsSelected, r,c) {
    for (let i = 0; i < seatsSelected.length; i++) {
        if (seatsSelected[i].row == r && seatsSelected[i].column == c) {
            return true;
        }
    }
    return false;
}


function setReserveSeat (r, c) {
    let newReservedSeat = {"row": r, "column": c}
    let oldReservedList = getListOfReservedSeats();

    oldReservedList.push(newReservedSeat);

    sessionStorage.setItem("reservedseats", JSON.stringify(oldReservedList) )
}



function getListOfReservedSeats () {
    let reservedSeats = JSON.parse(sessionStorage.getItem("reservedseats"));
    console.log(reservedSeats);
    if (reservedSeats != null) {
        return reservedSeats;
    }
    return [];
}


// constructs tickets display from the JSON "tickets_data.json"
function makeTickets () {

    let ticketDisplay = document.getElementById("ticket-display");
    let ticketDisplayConstructor = "";
    standardPris = 150;


    fetch("data/tickets_data.json")
    .then(res => res.json())
    .then(data => {
        
        var ticketSessionData =  [];

        for (let i = 0; i < data.tickets.length; i++) {  

            // get key for current data
            let ticketKey = Object.keys(data.tickets[i]);

            // get value from current data
            let ticket = Object.values(data.tickets[i])[0];

            //check for data i session for tickets
            let amountOfTickets = getAmountOfTicketsOrdered(ticketKey);

            // beregn pris med discount
            let price = (standardPris - (ticket.discount / 100 * standardPris));

            
            // push ticket information til session ticket dataArray
            let collectInfo = {"name": ticketKey[0], "amount": amountOfTickets, "price": price };

            // saml infromationer om biletter til sessiondata
            ticketSessionData.push( collectInfo);       
            
            ticketDisplayConstructor += constructTicket(
                ticket.title,
                price,
                ticket.beskrivelse,
                ticketKey[0],
                amountOfTickets);
        }

        setSessionTicketData(ticketSessionData);

        ticketDisplay.innerHTML = ticketDisplayConstructor;

        UpdateCheckout() 
    })
    .catch(e => {
        console.log(e);
    })
}


function UpdateCheckout () {

    let sumAndTickets = calcualteTotalSum ();

    let sum = document.getElementById("totalSum");
    let ticketsBought = document.getElementById("ticketsBought");

    sum.outerHTML = `<p id = totalSum>samlet pris: ${sumAndTickets.sum}</p>`
    ticketsBought.outerHTML = `<p id = ticketsBought>antal billetter: ${sumAndTickets.tickets}</p>`
}


// sætter dataen for valgte biletter i sessionStorage
function setSessionTicketData(data) {
    sessionStorage.setItem("sessionTickets", JSON.stringify(data));
}


// opdatere antallet af bestilte biletter
function changeTicketSessionData (id, newStatus) {
    let oldValue = getSessionticketData();
  

    for (let i = 0; i< oldValue.length; i++) {
        if (oldValue[i].name == id) {
            oldValue[i].amount = newStatus;
        }
    }

    setSessionTicketData(oldValue);
 
} 

function getSessionticketData () {
    return JSON.parse(sessionStorage.getItem("sessionTickets"));
}



function constructTicket (title, pris, beskrivelse, id, amount) {
    return `                        
    <div class = ticket-display-template>
        <div>
            <p>${title}</p>
            <p>Pris ${pris}dkk </p>
        </div>
        
        <button onclick = "ticketClicked(sub${id})" id = sub${id} class = "subtract-button square justify-content-center">
                <p class = "remove-margin">-</p> 
        </button>
        <div class = "center">
            <p id = amount${id}>${amount}</p>
        </div>
        
        <button onclick = "ticketClicked(add${id})" id = add${id} class = "add-button square justify-content-center"> 
            <p  class = "remove-margin">+</p> 
        </button>   
    </div>
    `
}



function addOrRemoveTicket (id, adding) {
    let ticketsOrdered = getAmountOfTicketsOrdered(id);
    console.log (ticketsOrdered);
    if (adding) {
        ticketsOrdered ++;
    }
    else {
        if (ticketsOrdered > 0) {
            ticketsOrdered --;
        }
        else {
            return;
        }
    }

    changeTicketSessionData(id, ticketsOrdered);
    redrawAmountOrdered(id, ticketsOrdered);

    UpdateCheckout();
}


function redrawAmountOrdered (id, newAmount) {

    let amountOverride = document.getElementById("amount" + id);
    amountOverride.outerHTML = `<p id = amount${id}>${newAmount}</p>`;
    
}

function ticketClicked (id) {
    let command = "";
    let idNumber = "";

    for (let i = 0; i < id.id.length; i++) {
        if (i < 3) {
            command += id.id[i];
        }
        else {
            idNumber += id.id[i];
        }
    }

    if (command == "add") {
        addOrRemoveTicket(idNumber, true);
    }

    else {
        addOrRemoveTicket(idNumber, false);
    }
}


function getAmountOfTicketsOrdered (idNumber) {

    let ticketDataFromSessionData = getSessionticketData();

    if (ticketDataFromSessionData != null) {

        for (let i = 0; i < ticketDataFromSessionData.length; i++) {

            if (ticketDataFromSessionData[i].name == idNumber)
            {
                return ticketDataFromSessionData[i].amount;  
            }
        }
        return ticketDataFromSessionData;
        
    }
    else {

        return 0;
    }
}


function calcualteTotalSum () {
    let sessionTicketData = getSessionticketData();
    let sum = 0;
    let tickets = 0;
    if (sessionTicketData == null) {
        return {"sum": sum, "tickets": tickets};
    }

    for (let i = 0; i< sessionTicketData.length; i++) {
        let currentTickets = sessionTicketData[i];

        sum += currentTickets.price * currentTickets.amount;
        tickets += currentTickets.amount;

    }
    return {"sum": sum, "tickets": tickets};
}


