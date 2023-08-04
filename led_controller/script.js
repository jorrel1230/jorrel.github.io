endpoint = 'https://cloud.appwrite.io/v1/databases/led/collections/led/documents/doc';

params = {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': '64cd1b0e1bd434ed947c'
};

update = {
    
};

data_send = JSON.stringify(update);

setInterval(function() {
    fetch(endpoint, {method: 'PATCH', headers:params, body:data_send})
    .then((data) => data.json())
    .then((info) => {
        console.log(info);
    })
    .catch (error => console.log("Error : " + error))
}, 2000)
