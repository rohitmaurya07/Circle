import React, { useState } from 'react'


const Login = () => {
    const [view, setview] = useState("second")
    const [errors, seterrors] = useState('')
    const [formData, setformData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        newPassword: ""
    })
    const handlerChange = (e) => {
        const { name, value } = e.target
        setformData({ ...formData, [name]: value })
        if (errors[name])
            seterrors({ ...errors, [name]: "" })
    }
    return (
        <div className='bg-base h-screen p-4 flex justify-center items-center w-full'>
            <div className='bg-surface h-[70%] rounded-3xl w-[70%] flex '>
                {/* Left */}
                <div className="left w-1/2 p-20">
                    <img src="Login.png" alt="" />
                </div>
                {/* Right */}
                <div className="right w-1/2 flex flex-col gap-2 justify-center pl-20">
                    <div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login