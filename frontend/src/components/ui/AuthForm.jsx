import React from 'react'

const AuthForm = ({view,formData,errors,handlerChange,handleSubmit,switchView}) => {

    const renderLoginForm = ()=>(
        <>
            <div>
                        <h2 className='text-content font-bold text-4xl'>Circle</h2>
                        <p className='text-base'>Log into Your Account</p>
                    </div>
                    <div className='flex flex-col gap-3 pt-5 w-56'>
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
                            placeholder='Password'
                            className={`bg-base rounded-2xl p-2 pl-4 text-content outline-0 ${errors.password ? "border-red-600" : "border-gray-700"}`} 
                        />
                        <button className='bg-content text-highlight rounded-2xl p-2  outline-0'>
                            Login
                        </button>
                    </div>
                    <div>
                        <p onClick={()=> switchView("forgetPassword")} className='text-highlight py-4 pl-2'>Forgot Password?</p>
                    </div>
                    <div>
                        <p onClick={()=> switchView("register")} className='text-highlight py-4 pl-2'>Didn't  have Account?</p>
                    </div>
        </>
    )

  return (
    <div>
        <form action="">
            {renderLoginForm()}
        </form>
    </div>
  )
}

export default AuthForm