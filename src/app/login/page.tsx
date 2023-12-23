'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import '../globals.css'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

export default function Page() {
    const [isLogin, setIsLogin] = useState(true);
    const { toast } = useToast()

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

    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        console.log(values)

        if (isLogin) {
            // if logging in
            fetch('/api/auth/login', {
                method: "POST",
                body: JSON.stringify({
                    "username": values.username,
                    "password": values.password
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.success) {
                        toast({
                            title: "success ✅",
                            description: data.message
                        })
                    }
                    else {
                        toast({
                            title: "error ❌",
                            description: data.message,
                            variant: "destructive"
                        })
                    }
                })
                .catch(err => {
                    toast({
                        title: "error",
                        description: err,
                        variant: "destructive"
                    })
                })
        }
        else {
            // if signing up
            fetch('/api/auth/create-user', {
                method: "POST",
                body: JSON.stringify({
                    "username": values.username,
                    "password": values.password
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        toast({
                            title: "success ✅",
                            description: data.message
                        })

                        setIsLogin(true)
                    }
                    else {
                        toast({
                            title: "error",
                            description: data.message,
                            variant: "destructive"
                        })
                    }
                })
                .catch(err => {
                    toast({
                        title: "error",
                        description: err,
                        variant: "destructive"
                    })
                })
        }
    }

    function toggleLogin(): void {
        setIsLogin(!isLogin);
        form.reset()
    }

    return (
        <main className="w-screen h-screen gradient-bg flex flex-col items-center justify-center">
            <Toaster />
            <div className="w-1/4 h-3/5 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center">
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
                                        <Input className="w-80" placeholder="********" {...field} />
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
                        <Button type="button" variant="outline" onClick={toggleLogin}>{isLogin ? "sign-up instead" : "login instead"}</Button>
                    </form>
                </Form>
            </div>
        </main>)
}