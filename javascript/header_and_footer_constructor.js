
function setHeaderAndFooter () {
    let head = document.getElementById("headeren");
    let foot = document.getElementById("footer-id");

    
    head.innerHTML = constructHeader();
    foot.innerHTML = constructFooter();
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





function constructFooter () {
    return `
        <h3> Filmhistorie i Danmarks klasse</h3>
        <p>Dansk film på lærredet, hygge i sædet!</p>
        <div class = "footer-grid">

            <a href="about.html">  OM OS</a>
            <a href="contact.html"> KONTATK</1>
            <a href="index.html"> FORSIDE</1>

        </div>
      `
}


