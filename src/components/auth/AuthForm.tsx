import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {SubmitHandler, useForm} from "react-hook-form";
import {Icons} from "../global/Icons"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useRouter} from "next/navigation";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {ExclamationTriangleIcon, CheckCircledIcon} from "@radix-ui/react-icons";

type AuthFormProps = React.HTMLAttributes<HTMLDivElement>

type AuthFormLoginState = {
  name: string
  email: string
  password: string
  password_confirm: string
}

const AuthForm = ({className, ...props}: AuthFormProps) => {

  const router = useRouter()
  const supabase = createClientComponentClient()

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [selectedTab, setSelectedTab] = React.useState<string>("login")
  const [error, setError] = useState<any>(null)
  const [success, setSuccess] = useState(false)

  const {register, handleSubmit, watch, formState: {errors}, reset} = useForm<AuthFormLoginState>();

  const handleLogin = async (data: Pick<AuthFormLoginState, "email" | "password">) => {
    setIsLoading(true)
    setError(null)

    const response = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    setIsLoading(false)

    if (response.error) {
      setSuccess(false)
      setError(response.error)
      return
    }

    setError(false)

    router.push("/")
  }

  const handleSignUp = async (data: AuthFormLoginState) => {
    if (data.password !== data.password_confirm) {
      setError({message: "Passwords do not match"})
      return
    }

    setIsLoading(true)
    setError(null)

    const response = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          name: data.name
        }
      },
    })
    setIsLoading(false)

    if (response.error) {
      setSuccess(false)
      setError(response.error)
      return
    }

    setError(false)
    setSuccess(true)
    reset()
    setSelectedTab("login")


    router.refresh()
  }


  const onSubmit: SubmitHandler<AuthFormLoginState> = (data) => {
    if (selectedTab === "login") {
      handleLogin(data).then()
    } else if (selectedTab === "signup") {
      handleSignUp(data).then()
    }
  };

  const renderLoginForm = () => {
    return (
      <>
        <div className="grid gap-1">
          <Label className="mb-1" htmlFor="email">
            Email
          </Label>
          <Input
            required={true}
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            {...register("email")}
          />
        </div>
        <div className="grid gap-1">
          <Label className="mb-1" htmlFor="password">
            Password
          </Label>
          <Input
            required={true}
            id="password"
            placeholder="Your password"
            type="password"
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect="off"
            disabled={isLoading}
            {...register("password")}
          />
        </div>

      </>
    )
  }

  const renderSignUpForm = () => {
    return (
      <>
        <div className="grid gap-1">
          <Label className="mb-1" htmlFor="name">
            Display Name
          </Label>
          <Input
            required={true}
            id="name"
            placeholder="Full name"
            type="text"
            autoCapitalize="none"
            autoComplete="name"
            autoCorrect="off"
            disabled={isLoading}
            {...register("name")}
          />
        </div>
        {renderLoginForm()}
        <div className="grid gap-1">
          <Label className="mb-1" htmlFor="password-confirm">
            Password confirm
          </Label>
          <Input
            required={true}
            id="password-confirm"
            placeholder="Your password (again)"
            type="password"
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect="off"
            disabled={isLoading}
            {...register("password_confirm")}
          />
        </div>
      </>
    )
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <Tabs defaultValue="login" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <ExclamationTriangleIcon className="h-4 w-4"/>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error?.message}
                </AlertDescription>
              </Alert>
            )}

            {(success && !error) && (
              <Alert className="mt-6">
                <CheckCircledIcon className="h-4 w-4"/>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your account has been created!
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="login" className="pt-5 pb-3 space-y-5">{renderLoginForm()}</TabsContent>
            <TabsContent value="signup" className="pt-5 pb-3 space-y-5">{renderSignUpForm()}</TabsContent>
          </Tabs>

          <Button disabled={isLoading} className="w-full py-5 mb-3" type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
            )}
            {selectedTab === "login" ? "Login" : "Sign up"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"/>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
        ) : (
          <Icons.google className="mr-2 h-4 w-4"/>
        )}{" "}
        Continue with Google
      </Button>
    </div>
  )
}

export default AuthForm
