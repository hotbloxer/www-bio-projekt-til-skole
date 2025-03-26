function fillGrid  (id, rows, colums) {
    console.log(2);
    var idTag = document.getElementById(id)
    var constructElement = `
    <div 
    style="display: grid; 
    grid-template-columns: repeat(${colums}, 1fr); 
    grid-template-rows: repeat(${rows}, 1fr); ">
    `;

    for (let r = 0; r<rows; r++) {
        
        for (let c = 0; c < colums; c++) {
            constructElement += constructSeat(0, r, c);
            
        }
    }

    constructElement += "</div>";

    console.log(constructElement);
    idTag.innerHTML = constructElement;
}

//status 0 free, 1 selected, 2 reserved
function constructSeat (status, r,c) {
    let id = "r" + r + "c" + c;
    if (status == 0) {
        return `
        <button onclick = "rowClicked(${id})" id = ${id} class = "seat seat-free"> d</button>
        `   
    }

    if (status == 1) {
        return `
        <button onclick = "rowClicked(${id})" id = ${id} class = "seat seat-selected"> d</button>
        `  
    }

    return `<div class = "seat seat-reserved"> d</div>`
}

function setAvailability (free) {
    
}

function rowClicked (id) {

    console.log( id.id);

    let change = document.getElementById(id.id);

    var rNumber = "";
    var cNumber = "";

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


    change.outerHTML = constructSeat(1, rNumber,cNumber);
    //change.innerHTML = `<div class = "seat seat-reserved"> d</div>`;

}