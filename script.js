function printScrollPercent() {
    var contentElem = document.getElementById("content");
    
    var a = contentElem.scrollTop;
    var b = contentElem.scrollHeight - contentElem.clientHeight;
    var c = a/b;

    console.log(Math.ceil(c*100));

}

//setInterval(printScrollPercent);