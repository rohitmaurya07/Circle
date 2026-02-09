import React, { useState } from 'react'
import AuthForm from '../components/ui/AuthForm'
import { useSearchParams } from 'react-router-dom'


const Login = () => {
    const [searchParams] = useSearchParams()
    const [view, setview] = useState("login")
    const [errors, seterrors] = useState('')
    const [formData, setformData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        newPassword: ""
    })

    const validateForm = () => {
        const newErrors = {}
        const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;

        if (view === "login") {
            if (!formData.email) newErrors.email = "Email is required"
            else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid Email"
            if (!formData.password) newErrors.password = "Password is Required"
        } else if (view === "register") {
            if (!formData.username) newErrors.username = "Username is required"
            if (!formData.email) newErrors.email = "Email is required"
            else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid Email"
            if (!formData.password) newErrors.password = "Password is Required"
            else if (!formData.password.length < 6) newErrors.password = "Password is must be 6 Characters"
        } else if (view === "forgotPassword") {
            if (!formData.email) newErrors.email = "Email is required"
            else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid Email"
        } else if (view === "changePassword") {
            if (!formData.newPassword) newErrors.newPassword = "New Password is required"
            else if (!formData.newPassword.length < 6) newErrors.newPassword = "Password is must be 6 Characters"
            if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password is required"
            else if (!formData.confirmPassword.length < 6) newErrors.confirmPassword = "Confirm Password is must be 6 Characters"
        }

        seterrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const token = searchParams.get("token")
    
    const handlerChange = (e) => {
        const { name, value } = e.target
        setformData({ ...formData, [name]: value })
        if (errors[name])
            seterrors({ ...errors, [name]: "" })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validateForm) return

        if (view == "register") {
            console.log("register")
        }
        else if (view == "login") {
            console.log("login")
        }
        else if (view == "forgotPassword") {
            console.log("forgot Password")
        }
        else if (view == "changePassword") {
            console.log("changePassword")
        }

        // Clear after Submit
        setformData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            newPassword: ""
        })
        console.log("Handle Submit")
    }



    const switchView = (newView) => {
        setview(newView)
        seterrors({})
        setformData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            newPassword: ""
        })
    }
    return (
        <div className='bg-base h-screen p-4 flex justify-center items-center w-full'>
            <div className='bg-surface h-[70%] rounded-3xl  md:w-[70%]  flex '>
                {/* Left */}
                <div className="left hidden md:block  md:w-1/2 p-20">
                    <img src="Login.png" alt="" />
                </div>
                {/* Right */}
                <div className="right md:w-1/2 flex flex-col gap-2 justify-center md:pl-20 px-10">

                    <AuthForm
                        view={view}
                        formData={formData}
                        errors={errors}
                        token={token}
                        handlerChange={handlerChange}
                        handleSubmit={handleSubmit}
                        switchView={switchView}
                    />
                    {/* <div>
                        <h2 className='text-content font-bold text-4xl'>Circle</h2>
                        <p className='text-base'>Log into Your Account</p>
                    </div>
                    <div className='flex flex-col gap-3 pt-5 w-56'>
                        <input type="text" placeholder='Username'
                            className=' bg-base rounded-2xl p-2 pl-4 text-content outline-0' />
                        <input type="email" placeholder='Email'
                            className=' bg-base rounded-2xl p-2 pl-4 text-content outline-0' />
                        <input type="password" placeholder='Password'
                            className='bg-base rounded-2xl p-2 pl-4 text-content outline-0' />
                        <button className='bg-content text-highlight rounded-2xl p-2  outline-0'>
                            Login
                        </button>
                    </div>
                    <div>
                        <p className='text-highlight py-4 pl-2'>Forgot Password?</p>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Login