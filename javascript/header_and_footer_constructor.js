
function setHeaderAndFooter () {
    let head = document.getElementById("headeren");
    head.innerHTML = constructHeader();
}


function constructHeader () {
    return `
    <div class = round-corners>
        <h1 class = "header-h1 theme-blue">Filmhistorie i verdensklasse</h1>
        <ul class = "list-style">
            <li class = pages-wrapper><a class = "link-display" href="index.html">Forside</a></li>
            <li class = pages-wrapper><a class = "link-display" href="contact.html">Contact</a></li>
            <li class = pages-wrapper><a class = "link-display" href="about.html">About</a></li>
        </ul>
    </div>
      `
}



