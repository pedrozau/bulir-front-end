import { Routes, Route } from "react-router-dom"
import Login from "./pages/LoginPage"
import Home from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import NotFoundPage from "./pages/NotFoundPage"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import { ServicesPage } from "./pages/ServicesPage"
import { ProfilePage } from "./pages/ProfilePage"


function App() {


  return (
    <>
    <AuthProvider>
     <Routes>
      <Route path="/" element={<ProtectedRoute element={<Home/>}/>} />
      <Route path="/services" element={<ProtectedRoute element={<ServicesPage/>}/>} />
      <Route path="/profile" element={<ProtectedRoute element={<ProfilePage/>}/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="*" element={<NotFoundPage/>}></Route>
     </Routes>
     </AuthProvider>
    </>
  )
}

export default App
