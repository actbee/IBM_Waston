import fetch from 'node-fetch';
import imageToBase64 from 'image-to-base64';

function composeBody(ingredients) {
    let mustMatch = [];
    ingredients.forEach(ingredient=> {
        mustMatch.push(
            {
                "match": {
                    "ingredients": ingredient
                }
            }
        )
    });

    return {
        "query": {
            "bool": {
                "must": mustMatch
            }
        }
    }
}


let ingredients = ["potato"];

let body4 = composeBody(ingredients);

// console.log(">>> body4: ", body4.query.bool.must);
// test
let body3 = {
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "ingredients": "wheat flour"
            }
          },
          {
            "match": {
              "ingredients": "sugars"
            }
          }, 
          {
            "match": {
              "ingredients": "salt"
            }
          }, 
          {
            "match": {
              "ingredients": "yogurt"
            }
          }, 
        ]
      }
    }
  }


// test sync
const response = await fetch('http://54.226.153.128:9200/ivy_cook/_search?pretty', {
	method: 'post',
	body: JSON.stringify(body4),
	headers: {'Content-Type': 'application/json'}
});

const data = await response.json();
let hits = data.hits
let counts = hits.value
let hitResult = hits.hits
hitResult.forEach(element => {
    // console.log(element)
});

const fetchP = fetch('http://54.226.153.128:9200/ivy_cook/_search?pretty', {
	method: 'post',
	body: JSON.stringify(body4),
	headers: {'Content-Type': 'application/json'}
});


console.log(">>>>>>>>>>>>> test promise:>>>>>>>>  ");
fetchP.then(res => {
    return res.json()
}).then(res => {
    console.log(res);
    let hits = res.hits;
    let hitResults = hits.hits;
    hitResults.forEach(element=> {
        console.log(element);
    });
});

/*
let encode = imageToBase64("../../carrot.png") // Path to the image
    .then(
        (response) => {
            console.log(response); // "cGF0aC90by9maWxlLmpwZw=="

            return response;
        }
    )
    .catch(
        (error) => {
            console.log(error); // Logs an error if there was one
        }
    );


let encode2 = encodeURIComponent("../../carrot.png");
console.log(encode2);


let classification = encode.then(base64_encode => {
    let request_url = "https://aip.baidubce.com/rest/2.0/image-classify/v1/classify/ingredient";
    let img = base64_encode;
    let params = {
      "image": img
    }
    let access_token = "24.26991ed61b147d86961d1d69eb8daaad.2592000.1655767051.282335-26287716";
    request_url = request_url + "?access_token=" + access_token
    console.log("request_url: " + request_url);
    let headers = {'content-type': 'application/x-www-form-urlencoded'};
    return fetch(request_url, {
	  method: 'post',
	  body: "image="+img,
	  headers: headers
    });
});

classification.then(res => {
  console.log("res: ",  res);
   return res.json();
}).then(res => {
  console.log("res->", res);
});


*/

