import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Use environment variable or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"

export default function EditRecipe() {
  const [recipeData, setRecipeData] = useState({})
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/recipe/${id}`)
        const res = response.data
        setRecipeData({
          title: res.title,
          ingredients: res.ingredients.join(","),
          instructions: res.instructions,
          time: res.time
        })
      } catch (err) {
        console.error("Failed to fetch recipe:", err)
      }
    }
    getData()
  }, [id])

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
      await axios.put(`${API_BASE_URL}/recipe/${id}`, recipeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': 'bearer ' + localStorage.getItem("token")
        }
      })
      navigate("/myRecipe")
    } catch (err) {
      console.error("Failed to update recipe:", err)
    }
  }

  return (
    <div className='container'>
      <form className='form' onSubmit={onHandleSubmit}>
        <div className='form-control'>
          <label>Title</label>
          <input
            type="text"
            className='input'
            name="title"
            onChange={onHandleChange}
            value={recipeData.title || ""}
            required
          />
        </div>
        <div className='form-control'>
          <label>Time</label>
          <input
            type="text"
            className='input'
            name="time"
            onChange={onHandleChange}
            value={recipeData.time || ""}
            required
          />
        </div>
        <div className='form-control'>
          <label>Ingredients</label>
          <textarea
            className='input-textarea'
            name="ingredients"
            rows="5"
            onChange={onHandleChange}
            value={recipeData.ingredients || ""}
            required
          />
        </div>
        <div className='form-control'>
          <label>Instructions</label>
          <textarea
            className='input-textarea'
            name="instructions"
            rows="5"
            onChange={onHandleChange}
            value={recipeData.instructions || ""}
            required
          />
        </div>
        <div className='form-control'>
          <label>Recipe Image</label>
          <input
            type="file"
            className='input'
            name="file"
            onChange={onHandleChange}
          />
        </div>
        <button type="submit">Edit Recipe</button>
      </form>
    </div>
  )
}
