'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import '../globals.css'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { createUser, loginUser } from "../supabase-service"

export default function Page() {
    const [isLogin, setIsLogin] = useState(true);
    const { toast } = useToast()
    const router = useRouter()

    const loginFormSchema = z.object({
        username: z.string().min(5, { message: "username must be at least 5 characters." }).max(50),
        password: z.string().min(8),
        confirmPass: z.string().optional()
    })
        .superRefine(({ confirmPass, password }, ctx) => {
            if (!isLogin && confirmPass !== password) {
                ctx.addIssue({
                    path: ["confirmPass"],
                    code: "custom",
                    message: "The passwords did not match"
                });
            }
        });

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPass: ""
        }
    })

    async function login(username: string, password: string) {
        var response: any = await loginUser(username, password)

        toast({
            title: response?.title,
            description: response?.description,
            variant: response?.success ? "default" : "destructive"
        })

        if(response.success) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(response?.data?.user))
            router.push("/profile")
        }
      
    }

    async function signUp(username: string, password: string) {
        var response = await createUser(username, password)

        toast({
            title: response?.title,
            description: response?.description,
            variant: response?.success ? "default" : "destructive"
        })

        setIsLogin(true)
    }

    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        if (isLogin) {
            // if logging in
            login(values.username, values.password)
        }
        else {
            // if signing up
            signUp(values.username, values.password)
        }
    }

    function toggleLogin(): void {
        setIsLogin(!isLogin);
        form.reset()
    }

    return (
        <main className="w-screen h-screen gradient-bg flex flex-col items-center justify-center">
            <Toaster />
            <div className="p-20 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center">
                <h1 className="text-4xl mb-12"><strong>{isLogin ? "login" : "sign-up"}</strong></h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>username</FormLabel>
                                    <FormControl>
                                        <Input className="w-80" placeholder="example123" {...field} />
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
                                    <FormLabel>password</FormLabel>
                                    <FormControl>
                                        <Input className="w-80" placeholder="********" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {!isLogin &&
                            <FormField
                                control={form.control}
                                name="confirmPass"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>confirm password</FormLabel>
                                        <FormControl>
                                            <Input className="w-80" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }
                        <Button type="submit" className="mr-4">{isLogin ? "login" : "sign-up"}</Button>
                        <br/>
                        <Button className="pl-0 pt-0 mt-0" type="button" variant="link" onClick={toggleLogin}>{isLogin ? "new to next-blog? sign-up instead" : "already have an accunt? login instead"}</Button>
                    </form>
                </Form>
            </div>
        </main>)
}