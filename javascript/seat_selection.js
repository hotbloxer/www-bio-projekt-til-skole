// tracker om der er valgt lige så mange sæder som biletter
var canContinueToConfirmation = false;

// bruges til at tracke om der er for mange valgte biletter
var totalAvailableTickets = 0;

const selectedMovie = JSON.parse(sessionStorage.getItem("SelectedMovie"));
const selectedShowing = JSON.parse(sessionStorage.getItem("SelectedShowing"));

function loadShowingInfo(selectedMovie, selectedShowing) {
    let title = document.getElementById('film-title');
    let runtime = document.getElementById('runtime');

    title.textContent = selectedMovie["Original Title"];
    runtime.textContent = "Spilletid: " + selectedMovie["Runtime (mins)"] + " min\n";
}

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

        totalAvailableTickets = val[0].columns * val[0].rows;

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

    let seatsSelected = getListOfSelectedSeats();

    for (let r = 0; r<rows; r++) {
        
        for (let c = 0; c < columns; c++) {

            let isThisSeatSelected = 0;

            
            if (isEntryAlreadySelected(seatsSelected, r,c)) {
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

  
    let seatsSelected = getListOfSelectedSeats();





    // check om entry allerede eksistere i listen over selected seats
    if ( isEntryAlreadySelected(seatsSelected,  rNumber, cNumber)) {
        // unselect pressed seat
        unselectSeat( rNumber, cNumber);
        change.outerHTML = constructSeat(0, rNumber,cNumber);
    }

    else 
            // check om der er bestilt nok biletter konta pladser
            if (selectedSeatsAreLessThanTicketsOrdered(seatsSelected, rNumber, cNumber)) {
                selectSeat(rNumber, cNumber)
                change.outerHTML = constructSeat(1, rNumber,cNumber);
            } 

  

}



// denne funktion tjekker der er valgt for mange pladser i forhold til bestilte billetter 
function selectedSeatsAreLessThanTicketsOrdered (seatsSelected, r, c) {
    let  totalTickets = calcualteTotalSum().tickets;

    // check om der er valgt nok billetter
    if (totalTickets > seatsSelected.length) {

        if (seatsSelected.length +1 == totalTickets) {
            canContinueToConfirmation = true;
        }

        return true;
    }

    canContinueToConfirmation = true;
    return false;
}

function isEntryAlreadySelected (seatsSelected, r,c) {

    if(seatsSelected[0] == null) {
        return false;
    }

    for (let i = 0; i < seatsSelected.length; i++) {
        if (seatsSelected[i].row == r && seatsSelected[i].column == c) {
            return true;
        }
    }
    return false;
}


function selectSeat (r, c) {
    let newSelectedSeat = {"row": r, "column": c}
    let selectedSeatList = getListOfSelectedSeats();

    selectedSeatList.push(newSelectedSeat);

    sessionStorage.setItem("reservedseats", JSON.stringify(selectedSeatList) )
}

function unselectSeat (r, c) {
    let selectedSeatList = getListOfSelectedSeats();

    if (selectedSeatList < 1) return;

    for (let i = 0; i < selectedSeatList.length; i++) {
        if (   selectedSeatList[i].row    == r
            && selectedSeatList[i].column == c
        )
        {
            selectedSeatList.splice(i,1);

            sessionStorage.setItem("reservedseats", JSON.stringify(selectedSeatList) )
            return;
        }
    }
}


function getListOfSelectedSeats () {
    let reservedSeats = JSON.parse(sessionStorage.getItem("reservedseats"));
    if (reservedSeats != null) {
        return reservedSeats;
    }
    return [];
}

// constructs tickets display from the JSON "tickets_data.json"
function makeTicketsAndSnackDisplay () {

    let ticketDisplay = document.getElementById("ticket-display");
    let outputHTMLContainer = "";
    let outputSessionContainer = "";

    fetch("data/tickets_data.json")
    .then(res => res.json())
    .then(data => {
        
        // fill tickets og snacks over to separate gange, og kæd outputtet sammen
        // en for html replacement koden, og en for session data koden
        let outputHolder = fillTicketsFromDATA (data.tickets)
        outputHTMLContainer = outputHolder.httpData;
        outputSessionContainer = outputHolder.sessionData;
        
        outputHolder = fillSnacksFromData (data.snacks)
        outputHTMLContainer += outputHolder.httpData;
 
        // dette kode sætter 2 arrays af objeckter sammen. concat virker åbenbart kun med rene string arrays
        Array.prototype.push.apply(outputSessionContainer, outputHolder.sessionData);
 
        setSessionWareData (outputSessionContainer);

        ticketDisplay.innerHTML = outputHTMLContainer;
        UpdateCheckout() 
    })
    .catch(e => {
        console.log(e);
    })
}

function fillTicketsFromDATA (ticketData) {
    
    let standardPris = 150;
    var ticketSessionData =  [];
    let ticketDisplayConstructor = "";

    for (let i = 0; i < ticketData.length; i++) {  

        //check for data i session for tickets
        let amountOfTickets = getAmountOfWaresOrdered(ticketData[i].type);

        let price = (standardPris - (ticketData[i].discount / 100 * standardPris));
        
        // push ticket information til session ticket dataArray
        let collectInfo = {
            "kategori":ticketData[i].kategori, 
            "name": ticketData[i].type, 
            "amount": amountOfTickets, 
            "price": price };

        // saml infromationer om biletter til sessiondata
        ticketSessionData.push(collectInfo);       
        
        ticketDisplayConstructor += constructTicket(
            ticketData[i].title,
            price,
            ticketData[i].beskrivelse,
            ticketData[i].type,
            amountOfTickets);
    }
    
    
    return {"httpData" : ticketDisplayConstructor, "sessionData": ticketSessionData};
}

function fillSnacksFromData (snackData) {
    let snackConstruct = "";
    let snackSessionData = [];
    for (let i = 0; i< snackData.length; i++) {

        //check for data i session for snacks
        let amountOfSnacks = getAmountOfWaresOrdered(snackData[i].type);

        // push ticket information til session ticket dataArray
        let collectInfo = {
            "kategori":snackData[i].kategori, 
            "name": snackData[i].type, 
            "amount": amountOfSnacks, 
            "price": snackData[i].pris, 
            "title": snackData[i].title };

        // saml infromationer om biletter til sessiondata
        snackSessionData.push(collectInfo);  

        snackConstruct += constructSnack(
            snackData[i].title,
            snackData[i].pris,
            snackData[i].beskrivelse,
            snackData[i].type,
            amountOfSnacks);
    }

    return {"httpData" : snackConstruct, "sessionData": snackSessionData};
 

}


function UpdateCheckout () {

    let sumAndTickets = calcualteTotalSum ();

    let sum = document.getElementById("totalSum");
    let ticketsBought = document.getElementById("ticketsBought");

    sum.outerHTML = `<p id = totalSum>samlet pris: ${sumAndTickets.sum}</p>`
    ticketsBought.outerHTML = `<p id = ticketsBought>antal vare: ${sumAndTickets.tickets + sumAndTickets.snacks}</p>`
}


// sætter dataen for valgte biletter i sessionStorage
function setSessionWareData(data) {
    sessionStorage.setItem("sessionTickets", JSON.stringify(data));
}

function getSessionWareData () {
    return JSON.parse(sessionStorage.getItem("sessionTickets"));
}

function isTicket (id) {
    let sessionData = getSessionWareData();
 
    for (let i = 0; i< sessionData.length; i++) {

        if (sessionData[i].name == id) {
            return sessionData[i].kategori == "billet";
        }
    }
}

// opdatere antallet af bestilte biletter
function changeTicketSessionData (id, newStatus) {
    let oldValue = getSessionWareData();

    totalOrderedTickets = 0;
 
    for (let i = 0; i< oldValue.length; i++) {

        if (oldValue[i].name == id) {
            oldValue[i].amount = newStatus;
        }
    }
    setSessionWareData(oldValue);
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


function constructSnack (name, pris, beskrivelse, id, amount) {
    return `                        
    <div class = ticket-display-template>
        <div>
            <p>${name}</p>
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
    
    totalTicketsAdded = calcualteTotalSum().tickets;
    sessionWares = getSessionWareData();
    
    if (totalTicketsAdded >= totalAvailableTickets && adding && isTicket(id)) {
        alert("Der er ikke flere biletter til rådighed");
        return;
    }
    
    let ticketsOrderedOfThisKind = getAmountOfWaresOrdered(id);



    if (adding) {
        ticketsOrderedOfThisKind ++;
    }
    else {
        if (ticketsOrderedOfThisKind > 0) {
            ticketsOrderedOfThisKind --;
            removeSelectedSeatWhenRemovingTickets(ticketsOrderedOfThisKind);
        }
        else {
            return;
        }
    }

    changeTicketSessionData(id, ticketsOrderedOfThisKind);
    redrawAmountOrdered(id, ticketsOrderedOfThisKind);

    UpdateCheckout();
}

function removeSelectedSeatWhenRemovingTickets (totalTicketsOrdered) {
    let listOfSelectedSeats = getListOfSelectedSeats();

    if (listOfSelectedSeats.length < 1) return;
    if (totalTicketsOrdered >= listOfSelectedSeats.length) return;
    
    // remove first entry in list
    unselectSeat(listOfSelectedSeats[0].row, listOfSelectedSeats[0].column);

    let idOfSeat = "r"+listOfSelectedSeats[0].row + "c" + listOfSelectedSeats[0].column;
    let change = document.getElementById(idOfSeat);

    change.outerHTML = constructSeat(0, listOfSelectedSeats[0].row, listOfSelectedSeats[0].column);
}


function redrawAmountOrdered (id, newAmount) {

    let amountOverride = document.getElementById("amount" + id);
    amountOverride.outerHTML = `<p id = amount${id}>${newAmount}</p>`;
    
}

function ticketClicked (id) {
    let command = "";
    let idNumber = "";

    // separer ved at checke første bogstaver
    // command kan være add eller sub
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



function getAmountOfWaresOrdered (idNumber) {
    let ticketDataFromSessionData = getSessionWareData();
    


    if (ticketDataFromSessionData != null) {

        for (let i = 0; i < ticketDataFromSessionData.length; i++) {

            if (ticketDataFromSessionData[i].name == idNumber)
            {
                
                return ticketDataFromSessionData[i].amount;  
            }
        }
        return 0;
        
    }
    else {

        return 0;
    }
}


function calcualteTotalSum () {
    let sessionWareData = getSessionWareData();
    let sum = 0;
    let tickets = 0;
    let snacks = 0;
    if (sessionWareData == null) {
        return {"sum": sum, "tickets": tickets};
    }

    for (let i = 0; i< sessionWareData.length; i++) {
        let currentWares = sessionWareData[i];

        if (currentWares.kategori == "snack") {
            snacks += currentWares.amount;
        }
        if (currentWares.kategori == "billet") {
            tickets += currentWares.amount;
        }

        sum += currentWares.price * currentWares.amount;

    }
    return {"sum": sum, "tickets": tickets, "snacks": snacks};
}

function goToConfirmation () {


    console.log("confirm");
    console.log(canContinueToConfirmation);


    if (canContinueToConfirmation){
        window.location = "confirmation.html";
    }

    else {
        alert("Du har ikke valgt nok pladser");
    }
    
}


