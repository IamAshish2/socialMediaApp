import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUpValidationSchema } from "@/lib/validation"
import { Loader } from "lucide-react"
// import { createUserAccount } from "@/lib/Appwrite/api"
import { useToast } from "@/hooks/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/React-Query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { Link, useNavigate } from "react-router-dom"

const SignUpForm = () => {
  const { toast } = useToast();
  // const { checkAuthUser, isLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  // const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpValidationSchema>>({
    resolver: zodResolver(signUpValidationSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpValidationSchema>) {
    // create the user with appwrite api
    const newUser = await createUserAccount(values);
    
    if (!newUser) {
      return toast({
        title: "Sign up failed. Please try again"
      })
    }
    console.log(newUser);

    toast({ title: "Successfully created a new account!" })
    navigate("/sign-in");

    // const session = await signInAccount({
    //   email: values.email,
    //   password: values.password
    // });
    // console.log(session);


    // if (!session) {
    //   return toast({ title: 'Sign in failed. Please try again later' });
    // }

    // const isLoggedIn = await checkAuthUser();
    // if (isLoggedIn) {
    //   form.reset();
    //   navigate('/');
    // } else {
    //   toast({ title: "Sign up failed. Please try again" })
    // }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="text-2xl font-bold h3:bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-5 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-1 font-bold ">Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-1 font-bold ">UserName</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-1 font-bold ">Email</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-1 font-bold ">Password</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your password here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {isCreatingUser ? <div className="flex-center gap-2">
              <Loader />
            </div> : "Sign up"}
          </Button>
          <p className="text-small-regular text-light-2 mt-2 text-center">Already have an account? <Link to="/sign-in" className="text-primary-600 text-small-semibold">Login</Link></p>
        </form>
      </div>
    </Form>
  )
}

export default SignUpForm
