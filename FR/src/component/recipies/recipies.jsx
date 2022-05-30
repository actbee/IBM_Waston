export function getRecipies(ingredients) {
    console.log("ingredients: ", ingredients);
    let options = {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({"ingredients": ingredients})
    };

    let recipies = [];
    return fetch("http://localhost:8081/search", options).then(res => res.json())
    .then(res => {
      console.log("res", res);
      console.log(res.hits);
      let num = Math.min(5, res.hits);
      res.search.forEach(hit => {
          if (num > 0) {
            recipies.push(hit);
          }
          num --;
      });
      console.log("recipies: ", recipies);
      this.setState(
        {recipies: recipies}
      );
    });
  }
