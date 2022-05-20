import React from 'react';
import RecipeListItem from './recipe_item';

function RecipeList(props) {
    return (
        <div className='recipe-screen'>
            <ul className='recipe-list'>
            <div className='recipe-screen-header'>Recipe Results</div>
            <RecipeListItem />
            <RecipeListItem />
            <RecipeListItem />
        </ul>
        </div>
    );
};

export default RecipeList;