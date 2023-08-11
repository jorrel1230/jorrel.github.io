// Wait till Page fully loads
document.addEventListener("DOMContentLoaded", function(){
    // Code here waits to run until the DOM is loaded.
   
    // Init the color picker HTML Elem
    colorPicker = document.getElementById("color_picker");
});


// Database API Data
endpoint = 'https://cloud.appwrite.io/v1/databases/led_base/collections/led_coll/documents/led_doc';
params = {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': 'jorrel_led_proj',
    'X-Appwrite-Key': '9f4c8ddd2dc03a7c1b3e91bb5f2ac7ad687af8eb531a4a5a461be7df5268da2d32091a040f4e49a148e3ff6b175b2e379ca28715445c960948eb8971b119aa69b41301318c8a1442d25bdeffc88268978da4014098838a1b6a0518c79ea01fbe581d6fa0efde556ad2b88ff59eeefa259ec2dc77aa336e3835cde528412305a0'
};

// Vars to hold LED status
var isManual = false;
var isOn = false;
var red = 0;
var green = 0;
var blue = 0;

// Var Holds HTML Elem for color 
let colorPicker;


// Function to toggle whether LED is Manual or song-based
function toggleManual() {
    isManual = !isManual;
    updateDatabase();
}

// Function to toggle whether LED is Manual or song-based
function toggleOn() {
    isOn = !isOn;
    updateDatabase();
}

// Function to update color variables based on color-picker, activates when color changes
function updateColors() {
    curr_colors = hexToRgb(colorPicker.value);
    red = curr_colors.r;
    green = curr_colors.g;
    blue = curr_colors.b;

    updateDatabase();
}



// Function that converts a given hex code (in format #XXXXXX) to rgb values
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}
  
// Takes all current variables and sends them to the database.
function updateDatabase() {

    update = {
        'data': {
            'led_manual': isManual,
            'red': red,
            'green': green,
            'blue': blue,
            'isOn': isOn
        }
    };
    
    data_send = JSON.stringify(update);


    fetch(endpoint, {method: 'PATCH', headers:params, body:data_send})
    .then((data) => data.json())
    .then((info) => {
        console.log(info);
    })
    .catch (error => console.log("Error : " + error))

}





