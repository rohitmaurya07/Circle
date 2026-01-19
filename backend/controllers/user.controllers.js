import User from "../models/user.model"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async(req,res)=>{
    const {username, email, password} = req.body

    try {
        if (!username || !email || !password) {
            return res.status(422).json({message: "All Fields are Required"})
        }
        const findUser = await User.findOne({email});
        if (findUser) {
            return res.status(422).json({message: "Email Already Registered"})
        }
        const hashedPassword = await bcrypt.hashSync(password,8)

        const userdata = new User({
            username,
            email,
            password : hashedPassword
        })
        const user = await userdata.save() 

        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn: '5y'})

        const {password: pass,...rest} = user._doc;

        const options = {
            httpOnly: true,
            maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "Strict"
        }

        res.status(201).cookie("token",token,options).json({
            success:true,
            message: "User Registered Successfully",
            user: rest,
        })
    } catch (error) {
        res.status(500).json({success: false,message: "Error with Registration!"})
    }
}
export const loginUser = async(req,res)=>{
    const {email, password} = req.body

    try {
        if (!email || !password) {
            return res.status(422).json({message: "All Fields are Required"})
        }
        const findUser = await User.findOne({email});
        if (!findUser) {
            return res.status(422).json({message: "Invalid Credentials"})
        }
        const isMatchedPassword = await bcrypt.compareSync(password,findUser.password)
 if (!isMatchedPassword) {
            return res.status(422).json({message: "Invalid Credentials"})
        }
        
        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn: '5y'})

        const {password: pass,...rest} = user._doc;

        const options = {
            httpOnly: true,
            maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "Strict"
        }

        res.status(201).cookie("token",token,options).json({
            success:true,
            message: "Login Successfully",
            user: rest,
        })
    } catch (error) {
        res.status(500).json({success: false,message: "Error with Login!"})
    }
}