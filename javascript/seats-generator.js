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
            constructElement += constructSeat(true);
        }
    }

    constructElement += "</div>";

    console.log(constructElement);
    idTag.innerHTML = constructElement;
}

function constructSeat (free) {

    if (free) {
        return `<div class = "seat seat-free"> d</div>`
    }
    return `<div class = "seat seat-reserved"> d</div>`
}

