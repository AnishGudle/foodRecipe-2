import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({})
  const navigate = useNavigate()

  const onHandleChange = (e) => {
    const { name, value, files } = e.target
    const val = name === "ingredients"
      ? value.split(",")
      : name === "file"
        ? files[0]
        : value

    setRecipeData(prev => ({ ...prev, [name]: val }))
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_BASE_URL}/recipe`, recipeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': 'bearer ' + localStorage.getItem("token")
        }
      })
      navigate("/")
    } catch (err) {
      console.error("Error adding recipe:", err)
    }
  }

  return (
    <div className='container'>
      <form className='form' onSubmit={onHandleSubmit}>
        <div className='form-control'>
          <label>Title</label>
          <input type="text" className='input' name="title" onChange={onHandleChange} required />
        </div>
        <div className='form-control'>
          <label>Time</label>
          <input type="text" className='input' name="time" onChange={onHandleChange} required />
        </div>
        <div className='form-control'>
          <label>Ingredients</label>
          <textarea className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} required />
        </div>
        <div className='form-control'>
          <label>Instructions</label>
          <textarea className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} required />
        </div>
        <div className='form-control'>
          <label>Recipe Image</label>
          <input type="file" className='input' name="file" onChange={onHandleChange} required />
        </div>
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  )
}
