import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import foodImg from '../assets/foodRecipe.png'
import { BsStopwatchFill } from "react-icons/bs"
import { FaHeart } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import axios from 'axios'

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

export default function RecipeItems({ recipes = [] }) {
  const [allRecipes, setAllRecipes] = useState(recipes)
  const [isFavRecipe, setIsFavRecipe] = useState(false)
  const navigate = useNavigate()

  const isMyRecipePage = window.location.pathname === "/myRecipe"
  let favItems = JSON.parse(localStorage.getItem("fav")) ?? []

  useEffect(() => {
    setAllRecipes(recipes)
  }, [recipes])

  const onDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/recipe/${id}`, {
        headers: {
          authorization: "bearer " + localStorage.getItem("token")
        }
      })
      setAllRecipes(prev => prev.filter(recipe => recipe._id !== id))
      const updatedFavs = favItems.filter(recipe => recipe._id !== id)
      localStorage.setItem("fav", JSON.stringify(updatedFavs))
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  const favRecipe = (item) => {
    const isAlreadyFav = favItems.some(recipe => recipe._id === item._id)
    favItems = isAlreadyFav
      ? favItems.filter(recipe => recipe._id !== item._id)
      : [...favItems, item]

    localStorage.setItem("fav", JSON.stringify(favItems))
    setIsFavRecipe(prev => !prev)
  }

  return (
    <div className='card-container'>
      {allRecipes?.map((item, index) => (
        <div key={index} className='card' onDoubleClick={() => navigate(`/recipe/${item._id}`)}>
          <img
            src={`${API_BASE_URL}/images/${item.coverImage || foodImg}`}
            width="120px"
            height="100px"
            alt={item.title}
          />
          <div className='card-body'>
            <div className='title'>{item.title}</div>
            <div className='icons'>
              <div className='timer'><BsStopwatchFill />{item.time}</div>
              {!isMyRecipePage ? (
                <FaHeart
                  onClick={() => favRecipe(item)}
                  style={{ color: favItems.some(res => res._id === item._id) ? "red" : "" }}
                />
              ) : (
                <div className='action'>
                  <Link to={`/editRecipe/${item._id}`} className="editIcon"><FaEdit /></Link>
                  <MdDelete onClick={() => onDelete(item._id)} className='deleteIcon' />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}