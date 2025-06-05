// import React, { useEffect, useState } from 'react'
// import Modal from './Modal'
// import InputForm from './InputForm'
// import { NavLink } from 'react-router-dom'

// export default function Navbar() {
//   const [isOpen,setIsOpen]=useState(false)
//   let token=localStorage.getItem("token")
//   const [isLogin,setIsLogin]=useState(token ? false : true)
//   let user=JSON.parse(localStorage.getItem("user"))

//   useEffect(()=>{
//     setIsLogin(token ? false : true)
//   },[token])

//   const checkLogin=()=>{
//     if(token){
//       localStorage.removeItem("token")
//       localStorage.removeItem("user")
//       setIsLogin(true)

//     }
//     else{
//       setIsOpen(true)
//     }
//   }

//   return (
//     <>
//         <header>
//             <h2>Food Blog</h2>
//             <ul>
//                 <li><NavLink to="/">Home</NavLink></li>
//                 <li onClick={()=>isLogin && setIsOpen(true)}><NavLink to={ !isLogin ? "/myRecipe" : "/"}>My Recipe</NavLink></li>
//                 <li onClick={()=>isLogin && setIsOpen(true)}><NavLink to={ !isLogin ? "/favRecipe" : "/"}>Favourites</NavLink></li>
//                 <li onClick={checkLogin}><p className='login'>{ (isLogin)? "Login": "Logout" }{user?.email ? `(${user?.email})` : ""}</p></li>
//             </ul>
//         </header>
//        { (isOpen) && <Modal onClose={()=>setIsOpen(false)}><InputForm setIsOpen={()=>setIsOpen(false)}/></Modal>}
//     </>
//   )
// }
import React, { useEffect, useState, useCallback } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLogin(!token)
  }, [])

  const user = JSON.parse(localStorage.getItem("user"))

  const checkLogin = useCallback(() => {
    const token = localStorage.getItem("token")
    if (token) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsLogin(true)
      navigate("/")
    } else {
      setIsOpen(true)
    }
  }, [navigate])

  return (
    <>
      <header>
        <h2>Food Blog</h2>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? "/myRecipe" : "#"}>My Recipe</NavLink>
          </li>
          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? "/favRecipe" : "#"}>Favourites</NavLink>
          </li>
          <li onClick={checkLogin}>
            <p className='login'>
              {isLogin ? "Login" : "Logout"}{user?.email ? ` (${user.email})` : ""}
            </p>
          </li>
        </ul>
      </header>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  )
}
