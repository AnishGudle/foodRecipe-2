import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import axios from 'axios'

import Home from './pages/Home'
import AddFoodRecipe from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'
import MainNavigation from './components/MainNavigation'

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
console.log("API Base URL:", API_BASE_URL)

// Load all recipes from the backend
const getAllRecipes = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/recipe`)
    return res.data
  } catch (error) {
    console.error("Error fetching all recipes:", error)
    return []
  }
}

// Load recipes created by the logged-in user
const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user?._id) return []
  const allRecipes = await getAllRecipes()
  return allRecipes.filter(recipe => recipe.createdBy === user._id)
}

// Load favorite recipes from localStorage
const getFavRecipes = async () => {
  const fav = JSON.parse(localStorage.getItem("fav")) || []
  return fav
}

// Load a specific recipe by ID and include creator's email
const getRecipe = async ({ params }) => {
  try {
    const recipeRes = await axios.get(`${API_BASE_URL}/recipe/${params.id}`)
    const recipe = recipeRes.data

    const userRes = await axios.get(`${API_BASE_URL}/user/${recipe.createdBy}`)
    return {
      ...recipe,
      email: userRes.data.email
    }
  } catch (error) {
    console.error("Error fetching recipe details:", error)
    return null
  }
}

// Define the app routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe }
    ]
  }
])

// App component
export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
