// import React, { useState } from 'react'
// import foodRecipe from '../assets/foodRecipe.png'
// import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'
// import RecipeItems from '../components/RecipeItems'
// import { useNavigate } from 'react-router-dom'
// import Modal from '../components/Modal'
// import InputForm from '../components/InputForm'

// export default function Home() {
//     const navigate = useNavigate()
//     const [isOpen, setIsOpen] = useState(false)

//     const addRecipe = () => {
//         let token = localStorage.getItem("token")
//         if (token)
//             navigate("/addRecipe")
//         else {
//             setIsOpen(true)
//         }
//     }

//     return (
//         <>
//             <section className='home'>
//                 <div className='left'>
//                     <h1>Food Recipe</h1>
//                     <h5>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</h5>
//                     <button onClick={addRecipe}>Share your recipe</button>
//                 </div>
//                 <div className='right'>
//                     <img src={foodRecipe} width="320px" height="300px"></img>
//                 </div>
//             </section>
//             <div className='bg'>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#d4f6e8" fillOpacity="1" d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>
//             </div>
//             {(isOpen) && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => setIsOpen(false)} /></Modal>}
//             <div className='recipe'>
//                 <RecipeItems />
//             </div>
//         </>
//     )
// }
// import React, { useState, useCallback } from 'react'
// import foodRecipe from '../assets/foodRecipe.png'
// import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'
// import RecipeItems from '../components/RecipeItems'
// import { useNavigate } from 'react-router-dom'
// import Modal from '../components/Modal'
// import InputForm from '../components/InputForm'

// export default function Home() {
//   const navigate = useNavigate()
//   const [isOpen, setIsOpen] = useState(false)

//   // Secure way to check token and navigate
//   const addRecipe = useCallback(() => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       navigate("/addRecipe")
//     } else {
//       setIsOpen(true)
//     }
//   }, [navigate])

//   return (
//     <>
//       {/* Optional: Navbar (if used globally you can skip this) */}
//       {/* <Navbar /> */}

//       <section className='home'>
//         <div className='left'>
//           <h1>Food Recipe</h1>
//           <h5>
//             It is a long established fact that a reader will be distracted by
//             the readable content of a page when looking at its layout. The
//             point of using Lorem Ipsum is that it has a more-or-less normal
//             distribution of letters, as opposed to using 'Content here,
//             content here', making it look like readable English.
//           </h5>
//           <button onClick={addRecipe}>Share your recipe</button>
//         </div>
//         <div className='right'>
//           <img
//             src={foodRecipe}
//             width="320px"
//             height="300px"
//             alt="Delicious food preview"
//           />
//         </div>
//       </section>

//       {/* Decorative background SVG */}
//       <div className='bg'>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 1440 320"
//         >
//           <path
//             fill="#d4f6e8"
//             fillOpacity="1"
//             d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
//           ></path>
//         </svg>
//       </div>

//       {/* Modal for login/signup */}
//       {isOpen && (
//         <Modal onClose={() => setIsOpen(false)}>
//           <InputForm setIsOpen={setIsOpen} />
//         </Modal>
//       )}

//       {/* Recipe list section */}
//       <div className='recipe'>
//         <RecipeItems />
//       </div>

//       {/* Optional: Footer (if used globally you can skip this) */}
//       {/* <Footer /> */}
//     </>
//   )
// }
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

import foodRecipe from '../assets/foodRecipe.png'
import Modal from '../components/Modal'
import InputForm from '../components/InputForm'
import RecipeItems from '../components/RecipeItems'

// Use environment variable or fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [recipes, setRecipes] = useState([])

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/recipe`)
      const allRecipes = res.data

      if (location.pathname === "/myRecipe") {
        if (!token) {
          setIsOpen(true)
          return
        }
        setRecipes(allRecipes.filter(recipe => recipe.createdBy === user?._id))
      } else if (location.pathname === "/favRecipe") {
        const favItems = JSON.parse(localStorage.getItem("fav")) || []
        setRecipes(allRecipes.filter(recipe =>
          favItems.some(fav => fav._id === recipe._id)
        ))
      } else {
        setRecipes(allRecipes)
      }
    } catch (err) {
      console.error("Failed to fetch recipes:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [location.pathname])

  const addRecipe = () => {
    if (token) {
      navigate("/addRecipe")
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <section className='home'>
        <div className='left'>
          <h1>Food Recipe</h1>
          <h5>Explore and share your favorite recipes!. Discover delicious recipes from around the world and share your culinary creations with friends and family. Join a community passionate about cooking and flavor.</h5>
          <button onClick={addRecipe}>Share your recipe</button>
        </div>
        <div className='right'>
          <img src={foodRecipe} width="320px" height="300px" alt="food" />
        </div>
      </section>

      <div className='bg'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#d4f6e8" fillOpacity="1"
            d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z">
          </path>
        </svg>
      </div>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}

      <div className='recipe'>
        <RecipeItems recipes={recipes} />
      </div>
    </>
  )
}