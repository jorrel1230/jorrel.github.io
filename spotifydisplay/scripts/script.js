// Constants to Pass
var client_id = "53af47fd3eda4b02b278a45d3f6d319d";
var client_secret = "b3a5fc175b1a4033b88e61f1a477b69c"
var redirect_uri = "http://localhost:8000/spotifydisplay.html"  //"https://jorrelrajan.com/spotifydisplay/spotifydisplay";
var scope = "user-read-currently-playing";

// Init Color Picker
const color_thief = new ColorThief();
dom_color = [4, 170, 109];              // THIS STORES THE SELECTED COLOR!! USEFUL FOR LEDS
dom_color_orig = to_rgb([4, 170, 109]);

var isSamePicture = false; // Boolean to check if same pic
var oldPicURL = '';
var isManual = false;

// Database Params
endpoint = 'https://cloud.appwrite.io/v1/databases/led_base/collections/led_coll/documents/led_doc';
db_params = {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': 'jorrel_led_proj',
    'X-Appwrite-Key': '9f4c8ddd2dc03a7c1b3e91bb5f2ac7ad687af8eb531a4a5a461be7df5268da2d32091a040f4e49a148e3ff6b175b2e379ca28715445c960948eb8971b119aa69b41301318c8a1442d25bdeffc88268978da4014098838a1b6a0518c79ea01fbe581d6fa0efde556ad2b88ff59eeefa259ec2dc77aa336e3835cde528412305a0'
};

function to_rgb(values) {
    return 'rgb(' + values.join(', ') + ')';
}

function get_brightness(rgb_arr) {
    return (0.299*rgb_arr[0] + 0.587*rgb_arr[1] + 0.114*rgb_arr[2]);
}


function spotify_auth() {
    console.log("Spotify Auth Start");
    let oauth2Endpoint = "https://accounts.spotify.com/authorize";

    let form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);

    let params = {
        "client_id" : client_id,
        "redirect_uri" : redirect_uri,
        "response_type": "token",
        "scope" : scope,
        "show_dialog": true
    };

    for (var p in params) {
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }
    console.log(form);
    document.body.appendChild(form);
    form.submit();

    console.log("Spotify Auth Done");
}

function start_loop() {

    console.log("Pull Token Start");
    
    var url_with_auth = location.href;

    let auth_start_pos = url_with_auth.indexOf('access_token');
    url_with_auth = url_with_auth.slice(auth_start_pos + 13);

    let auth_end_pos = url_with_auth.indexOf('&');
    url_with_auth = url_with_auth.slice(0, auth_end_pos);

    let params = {'access_token' : url_with_auth}

    if (Object.keys(params).length > 0) {
        localStorage.setItem('auth_info', JSON.stringify(params));
    }

    // Hides Access Token from url
    window.history.pushState({}, document.title, "/spotifydisplay/spotifydisplay");
    console.log("Pull Token Done");
    document.getElementById("butt1").remove();
    document.getElementById("butt2").remove();

    console.log("Loop Start..");
    
    // Read Auth from storage
    let info = JSON.parse(localStorage.getItem('auth_info'));

    console.log(info['access_token']);

    fetch("https://api.spotify.com/v1/me/", {
        headers:{
            "Authorization": `Bearer ${info['access_token']}`
        }
    })
    .then((data) => data.json())
    .then((info) => {
        document.getElementById("username").textContent = "Logged in as:  " + info.display_name;
    })
    .catch (error => console.log(error))


    setInterval(inner_loop, 750, info);
    setInterval(update_datetime, 2500)
}


function inner_loop(auth_info) {

    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers:{
            "Authorization": `Bearer ${auth_info['access_token']}`
        }
    })
    .then((data) => data.json())
    .then((info) => {
        //console.log(info)

        song_name = info.item.name;
        artist_name = info.item.artists[0].name;
        album_name = info.item.album.name;
        progress_ms = info.progress_ms;
        duration_ms = info.item.duration_ms;
        isPlaying = info.is_playing;

        album_url_pic = info.item.album.images[0].url;
        isSamePicture = album_url_pic === oldPicURL;
        oldPicURL = album_url_pic;
        if (!isSamePicture) {
            document.getElementById("album_img").src = album_url_pic;
            setTimeout(grab_colors, 1000);
        }


        document.getElementById("song_title").textContent = song_name;
        document.getElementById("album_title").textContent = album_name;
        document.getElementById("artist_name").textContent = artist_name;

        var bar = document.getElementById("progress_bar");
        var prog = (progress_ms/duration_ms)*100;
        bar.style.width = prog + "%";
        bar.style.backgroundColor = dom_color;

        var disk_anim = document.getElementById("img_container");
        if (isPlaying) {
            disk_anim.style.animationPlayState = "running";
        } else {
            disk_anim.style.animationPlayState = "paused";
        }
        
    })
    .catch (error => console.log("No Song Playing / Error: \n" + error))

}


const days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months_of_year = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function update_datetime() {
    const date_obj = new Date();

    document.getElementById("date").textContent = days_of_week[date_obj.getDay()] + ", " + 
    months_of_year[date_obj.getMonth()] + " " + date_obj.getDate();

    var hour = date_obj.getHours();
    var min = date_obj.getMinutes().toString();
    var ampm = "AM";
    if (min.length < 2) {
        min = '0' + min;
    }

    if (hour > 12) {
        hour -= 12;
        ampm = "PM";
    }

    if (hour == 0) {
        hour += 12;
    }

    document.getElementById("time").textContent = hour + ":" + min + " " + ampm;
    //console.log(hour + ":" + min + " " + ampm)
}

function grab_colors() {
    var img = document.getElementById("album_img");
    img.crossOrigin = "Anonymous";
    color_arr = [];
    if (img.complete) {
        color_arr = color_thief.getColor(img);
    } else {
        image.addEventListener('load', function() {
            colorThief.getColor(img);
        });
    }


    dom_color_orig = color_arr;

    var lum = get_brightness(color_arr);
    if (lum > 175) {
        for (var i = 0; i < 3; i++)
        {
            color_arr[i] = Math.round(Math.max(0, color_arr[i] / 1.65));
        }
    } else if (lum < 50) {
        for (var i = 0; i < 3; i++)
        {
            color_arr[i] = Math.round(Math.min(255, color_arr[i] * 1.65));
        }
    }
    
    dom_color = to_rgb(color_arr);
    updateDatabase(dom_color_orig);
}

// Takes all current variables and sends them to the database.
function updateDatabase(colorsRGB) {

    fetch(endpoint, {headers:db_params})
    .then((data) => data.json())
    .then((info) => {
        isManual = info.led_manual;
        console.log(isManual);
    })
    .catch (error => console.log("Error : " + error))

    if (!isManual) {
        update = {
            'data': {
                'red': colorsRGB[0],
                'green': colorsRGB[1],
                'blue': colorsRGB[2]
            }
        };
        
        data_send = JSON.stringify(update);

        fetch(endpoint, {method: 'PATCH', headers:db_params, body:data_send})
        .then((data) => data.json())
        .then((info) => {
            console.log(info);
        })
        .catch (error => console.log("Error : " + error))
    } else {
        console.log("Auto LED is being Overriden")
    }
}






//INITS FOR STARTUP
document.addEventListener("DOMContentLoaded", function() {
    // Your code that should run after DOMContentLoaded event here
    // This code will execute after the DOM has fully loaded

    //INITIALIZING DATE: THIS WILL NOT UPDATE CONTINIOUSLY.
    const date_obj = new Date();

    document.getElementById("date").textContent = days_of_week[date_obj.getDay()] + ", " + 
    months_of_year[date_obj.getMonth()] + " " + date_obj.getDate();

    var hour = date_obj.getHours();
    var min = date_obj.getMinutes().toString();
    var ampm = "AM";
    if (min.length < 2) {
        min = '0' + min;
    }

    if (hour > 12) {
        hour -= 12;
        ampm = "PM";
    }

    if (hour == 0) {
        hour += 12;
    }

    document.getElementById("time").textContent = hour + ":" + min + " " + ampm;

    setTimeout(grab_colors, 50);

  });

