import * as z from "zod"

export const signUpValidationSchema = z.object({
    name:z.string().min(2,{message:'The name cannot be this short'}).max(16),
    username: z.string().min(6,{message:'Choose a longer username'}).max(50),
    email:z.string().email({message:"Please provide a valid email address!"}),
    password:z.string().min(8,{message:"Password should be of minimum 8 characters"})
  })


export const signInValidationSchema = z.object({
  email:z.string().email({message:"Please provide a valid email address!"}),
  password:z.string().min(8,{message:"Password should be of minimum 8 characters"})
})