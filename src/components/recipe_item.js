import React from 'react';
import { NavLink } from 'react-router-dom';

const RecipeListItem = (props) => {
    return (
        <div className='recipe-container'>
            <div className='recipe-name'>Recipe Name</div>
            <div className='recipe-ingredient'>Ingredients</div>
            <div className='recipe-detail'>Recipe Details</div>
        </div>
    );
};

export default RecipeListItem;