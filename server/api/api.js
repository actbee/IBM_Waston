
const fetch = require('node-fetch');

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


function fetchRecipes(ingredients) {
    
    if (ingredients == null || !Array.isArray(ingredients)) {
        return ;
    }
    let body = composeBody(ingredients);
    const fetchP = fetch('http://54.226.153.128:9200/ivy_cook/_search?pretty', {
	    method: 'post',
	    body: JSON.stringify(body),
	    headers: {'Content-Type': 'application/json'}
    });
    
    return fetchP.then(res => {
        return res.json()
    }).then(res => {
        console.log("res=> ", res);
        let hits = res.hits;
        let hitResults = hits.hits;
        return hitResults.map(element=> {
            return {
                id: element._source.id,
                name: element._source.name,
                url: element._source.url,
                ingredients: element._source.ingredients,
                instructions: element._source.instructions
            }  
        });
    });
}


function getImageContents(imageBase64) {
    let request_url = "https://aip.baidubce.com/rest/2.0/image-classify/v1/classify/ingredient";
    let img = imageBase64;
    let access_token = "24.26991ed61b147d86961d1d69eb8daaad.2592000.1655767051.282335-26287716";
    request_url = request_url + "?access_token=" + access_token;
    request_url = "http://127.0.0.1:5000/objects";
    console.log("request_url: " + request_url);
    let headers = {'content-type': 'application/x-www-form-urlencoded'};
    return fetch(request_url, {
	  method: 'post',
	  body: "image="+img,
	  headers: headers
    }).then(res => {
        return res.json();
    });
}

module.exports = { 
    fetchRecipes
    // getImageContents
 }