endpoint = 'https://cloud.appwrite.io/v1/databases/64cc7ad959ff6528b257/collections/64cc7ae029b0c05157d8/documents/64cc7bb00ec806007b50';

params = {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': '64cc7a56e91d89cdf429'
};

update = {
    'data': {
        'red': 0,
        'green': 21,
        'blue': 211
    }
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
