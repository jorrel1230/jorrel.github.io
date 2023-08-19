/* PROJECT BUTTON FUNCTIONS */
function spotify_redirect() {
    window.location.href = "https://jorrelrajan.com/spotifydisplay";
}

function led_redirect() {
    window.location.href = "https://jorrelrajan.com/led";
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
