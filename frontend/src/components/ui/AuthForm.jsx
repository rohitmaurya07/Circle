import React from 'react'

const AuthForm = ({ view, formData, errors,token, handlerChange, handleSubmit, switchView }) => {

    const renderLoginForm = () => (
        <>
            <div className=''>
                <h2 className='text-content  font-bold text-4xl'>Circle</h2>
                <p className='text-base'>Log into Your Account</p>
            </div>
            <div className='flex flex-col gap-3 pt-5 w-72 pr-5'>
                {/* Email */}

                <input
                    type="email"
                    name='email'
                    value={formData.email}
                    onChange={handlerChange}
                    placeholder='Email'
                    className={`bg-base rounded-2xl p-2 pl-4 text-content outline-0 ${errors.email ? "border-red-600" : "border-gray-700"}`}
                />
                <p className='text-red-500'>{errors.email || ""}</p>
                <input
                    type="password"
                    name='password'
                    value={formData.password}
                    onChange={handlerChange}
                    placeholder='Password'
                    className={`bg-base rounded-2xl p-2 pl-4 text-content outline-0 ${errors.password ? "border-red-600" : "border-gray-700"}`}
                />
                <button className='bg-content text-highlight rounded-2xl p-2  outline-0'>
                    Login
                </button>
            </div>
            <div>
                <p onClick={() => switchView("forgetPassword")} className='text-highlight py-4 pl-2'>Forgot Password?</p>
            </div>
            <div>
                <p onClick={() => switchView("register")} className='text-highlight py-4 pl-2 '>Didn't  have Account?
                    <span onClick={() => switchView("register")} className='text-content cursor-pointer p-2'>Register</span>
                </p>
            </div>
        </>
    )
    const renderRegisterForm = () => (
        <>
            <div>
                <h2 className='text-content font-bold text-4xl'>Circle</h2>
                <p className='text-base'>Create Your Account</p>
            </div>
            <div className='flex flex-col gap-2 pt-5 w-56'>
                {/* Username */}

                <input
                    type="text"
                    name='username'
                    value={formData.username}
                    onChange={handlerChange}
                    placeholder='Username'
                    className={`bg-base rounded-2xl p-2 pl-4 text-content outline-0 ${errors.username ? "border-red-600" : "border-gray-700"}`}
                />
                <p className='text-red-500'>{errors.username || ""}</p>
                {/* Email */}

                <input
                    type="email"
                    name='email'
                    value={formData.email}
                    onChange={handlerChange}
                    placeholder='Email'
                    className={`bg-base rounded-2xl p-2 pl-4 text-content outline-0 ${errors.email ? "border-red-600" : "border-gray-700"}`}
                />
                <p className='text-red-500'>{errors.email || ""}</p>
                {/* Password */}
                <input
                    type="password"
                    name='password'
                    value={formData.password}
                    placeholder='Password'
                    className={`bg-base rounded-2xl p-2 pl-4 text-content outline-0 ${errors.password ? "border-red-600" : "border-gray-700"}`}
                />
                <p className='text-red-500'>{errors.password || ""}</p>

                <button className='bg-content text-highlight rounded-2xl p-2  outline-0'>
                    Login
                </button>
            </div>
            <div>
                <p onClick={() => switchView("forgetPassword")} className='text-highlight py-4 pl-2'>Forgot Password?</p>
            </div>
            <div>
                <p  className='text-highlight py-4 pl-2'>Already  have Account?
                    <span onClick={() => switchView("login")} className='text-content cursor-pointer p-2'>Log in</span></p>
            </div>
        </>
    )
    const renderForgetPasswordForm = () => (
        <>
            <div>
                <h2 className='text-content font-bold text-4xl'>Circle</h2>
                <p className='text-base'>Reset Your Password</p>
            </div>
            <div className='flex flex-col gap-2 pt-5 w-56'>
                
                {/* Email */}

                <input
                    type="email"
                    name='email'
                    value={formData.email}
                    onChange={handlerChange}
                    placeholder='Email'
                    className={`bg-base rounded-2xl p-2 pl-4 text-content outline-0 ${errors.email ? "border-red-600" : "border-gray-700"}`}
                />
                <p className='text-red-500'>{errors.email || ""}</p>
                

                <button className='bg-content text-highlight rounded-2xl p-2  outline-0'>
                    Send Reset Link
                </button>
            </div>
            
            <div>
                <p  className='text-highlight py-4 pl-2'>Already  have Account?
                    <span onClick={() => switchView("login")} className='text-content cursor-pointer p-2'>Log in</span></p>
            </div>
        </>
    )
    const renderPasswordChangeForm = () => (
        <>
            <div>
                <h2 className='text-content font-bold text-4xl'>Circle</h2>
                <p className='text-base'>Reset Your Password</p>
            </div>
            <div className='flex flex-col gap-2 pt-5 w-56'>
                
                {/* Password */}

                <input
                    type="password"
                    name='newPassword'
                    value={formData.newPassword}
                    onChange={handlerChange}
                    placeholder='New Password'
                    className={`bg-base rounded-2xl p-2 pl-4 text-content outline-0 ${errors.newPassword ? "border-red-600" : "border-gray-700"}`}
                />
                <p className='text-red-500'>{errors.newPassword || ""}</p>
                {/* confirm Password */}

                <input
                    type="password"
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handlerChange}
                    placeholder='Confirm Password'
                    className={`bg-base rounded-2xl p-2 pl-4 text-content outline-0 ${errors.newPassword ? "border-red-600" : "border-gray-700"}`}
                />
                <p className='text-red-500'>{errors.newPassword || ""}</p>
                

                <button className='bg-content text-highlight rounded-2xl p-2  outline-0'>
                    Change Password
                </button>
            </div>
            
        </>
    )
    const renderTokenError = () => (
        <>
            <div>
                <h2 className='text-content font-bold text-4xl'>Circle</h2>
                <p className='text-base'>Invalid or Expired Token</p>
            </div>
            <div className='flex flex-col gap-2 pt-5 w-56'>        

                <button onClick={() => switchView("login")} className='bg-content text-highlight rounded-2xl p-2  outline-0'>
                    Log in
                </button>
            </div>
            
        </>
    )
    const renderForm = ()=>{
        switch (view) {
        case "login":
            return renderLoginForm()
        case "register":
            return renderRegisterForm()
        case "forgetPassword":
            return renderForgetPasswordForm()
        case "changePassword":
            return token ? renderPasswordChangeForm() : renderTokenError()
        case "tokenError":
            return renderTokenError()
        default:
            return renderLoginForm()
    }
    }
    

    return (
        <div>
            <form action="">
                {renderForm()}
                {/* {renderTokenError()} */}
            </form>
        </div>
    )
}

export default AuthForm