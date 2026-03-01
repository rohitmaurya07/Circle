import User from "../models/user.model.js"
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
        const isMatchedPassword =  bcrypt.compareSync(password,findUser.password)
 if (!isMatchedPassword) {
            return res.status(422).json({message: "Invalid Credentials"})
        }
        
        const token = jwt.sign({_id: findUser._id},process.env.JWT_SECRET,{expiresIn: '7d'})

        const {password: pass,...rest} = findUser._doc;

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
        console.log("Error hai bhai login mai", error);
        
        res.status(500).json({success: false,message: "Error while Login!"})
    }
}

export const logoutUser = async(req,res)=>{
    try {
        const options = {
            httpOnly: true,
            secure: true
        }
        res.status(200).clearCookie("token",options).json({
            message: "Logout SuccessFully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something Wrong with Logout"
        })
    }
}

export const profileUser = async(req,res)=>{
    const userId = req.user?._id
    const user = await User.findById(userId).select("-password")
    res.status(200).json({
        success: true,
        user
    })
}

export const uploadProfile = async(req,res)=>{
    const userId = req.user._id
   try {
     const profileImage = req.file?.path;
     if (!profileImage) {
         return res.status(400).json({
         success: false,
         message: "No File Uploaded"
     }) 
     }
     const updateProfileImage =  await User.findByIdAndUpdate(
         userId,
         {profileImage},
         {new: true}
     ).select("-password")
 
      res.status(200).json({
         success: true,
         message: "Profile Image Uploaded",
         user: updateProfileImage
 })
   } catch (error) {
         return res.status(500).json({
            success: false,
            message: "Failed to upload profile image"
   })
}
}
export const allUsers = async(req,res)=>{
    try {
        const users = await User.find()
        res.status(200).json({
        success: true,
        users
    })
    } catch (error) {
            return res.status(500).json({
            success: false,
            message: "Something Wrong with users"
        })
    }
}


export const getProfileById = async(req,res)=>{
    try {
        const userId = req.params.id
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }
        return res.status(200).json({
            success: true,
            user,
            message: "Fetched User SuccessFully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching User"
        })
    }
}