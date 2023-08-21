/* PROJECT BUTTON FUNCTIONS */
function spotify_redirect() {
    window.location.href = "https://jorrelrajan.com/spotifydisplay";
}

function led_redirect() {
    window.location.href = "https://jorrelrajan.com/led";
}


/* NAVIGATION BUTTON FUNCTIONS */
function aboutme() {
    window.location.href = "#";
}

function projects() {
    window.location.href = "#projects";
}



/* ICON BUTTON FUNCTIONS */
function insta() {
    window.location.href = "https://www.instagram.com/_jorrel/";
}

function discord() {
    window.location.href = "https://discord.com/users/304680442349748224";
}

function linkedin() {
    window.location.href = "https://jorrelrajan.com/temp";
}

function email() {
    window.location.href = "mailto:jorrel@princeton.edu";
}

function github() {
    window.location.href = "https://github.com/jorrel1230";
}



const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});


const hiddenElems = document.querySelectorAll(".hidden");
hiddenElems.forEach((el) => observer.observe(el));
