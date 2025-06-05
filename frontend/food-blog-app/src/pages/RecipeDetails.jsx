import React from 'react'
import profileImg from '../assets/profile.png'
import food from '../assets/foodRecipe.png'
import { useLoaderData } from 'react-router-dom'

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

export default function RecipeDetails() {
  const recipe = useLoaderData()
  console.log(recipe)

  return (
    <div className='outer-container'>
      <div className='profile'>
        <img src={profileImg} width="50px" height="50px" alt="Profile" />
        <h5>{recipe.email}</h5>
      </div>
      <h3 className='title'>{recipe.title}</h3>
      <img
        src={`${API_BASE_URL}/images/${recipe.coverImage}`}
        width="220px"
        height="200px"
        alt={recipe.title}
      />
      <div className='recipe-details'>
        <div className='ingredients'>
          <h4>Ingredients</h4>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className='instructions'>
          <h4>Instructions</h4>
          <span>{recipe.instructions}</span>
        </div>
      </div>
    </div>
  )
}
