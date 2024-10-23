import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInValidationSchema } from "@/lib/validation"
import { z } from "zod"
import { useSignInAccount } from "@/lib/React-Query/queriesAndMutations"

const SignInForm = () => {
  const { mutateAsync: signInAccount, isSuccess: isLoggedIn } = useSignInAccount();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoggingIn = false;

  const form = useForm<z.infer<typeof signInValidationSchema>>({
    resolver: zodResolver(signInValidationSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  const onSubmit = async (values: z.infer<typeof signInValidationSchema>) => {
    const userSession = await signInAccount({
      email: values.email,
      password: values.password
    });

    if (!userSession) {
      return toast({ title: 'Sign in failed. Please try again later' });
    }

    navigate("/");

  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="text-2xl font-bold h3:bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-5 mt-4">
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
                  <Input type="text" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button className="shad-button_primary" type="submit">
            {isLoggingIn ? <div className="flex-center gap-2">
              <Loader />
            </div> : "Sign In"}
          </Button>
          <p className="text-small-regular text-light-2 mt-2 text-center">Don't have an account? <Link to="/sign-up" className="text-primary-600 text-small-semibold">Sign up</Link></p>
        </form>
      </div>
    </Form>
  )
}

export default SignInForm
