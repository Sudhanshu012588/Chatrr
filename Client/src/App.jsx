import Homepage from "./Pages/Homepage"
import Signup from './Pages/Signup'
import Login from "./Pages/Login";
import './App.css'
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ChattPage from "./Pages/ChattPage";
import Dashboard from "./Pages/Dashboard";
function App() {

  return (
    <>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fefefe',
          color: '#333',
          border: '1px solid #e5e7eb',
          padding: '12px 16px',
          borderRadius: '0.75rem',
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ecfdf5',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fee2e2',
          },
        },
      }}
    />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/dashboard" element={<ChattPage/>}/>
          <Route path="/dashboard/admin" element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
