endpoint = 'https://cloud.appwrite.io/v1/databases/led_base/collections/led_coll/documents/led_doc';

params = {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': 'jorrel_led_proj',
    'X-Appwrite-Key': '9f4c8ddd2dc03a7c1b3e91bb5f2ac7ad687af8eb531a4a5a461be7df5268da2d32091a040f4e49a148e3ff6b175b2e379ca28715445c960948eb8971b119aa69b41301318c8a1442d25bdeffc88268978da4014098838a1b6a0518c79ea01fbe581d6fa0efde556ad2b88ff59eeefa259ec2dc77aa336e3835cde528412305a0'
};

setInterval(function() {
    fetch(endpoint, {headers:params})
    .then((data) => data.json())
    .then((info) => {
        console.log(info);
    })
    .catch (error => console.log("Error : " + error))
}, 2000)
