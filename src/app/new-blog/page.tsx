'use client'

import '../globals.css'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import * as z from 'zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { createClient } from '@supabase/supabase-js'
import { toast, useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { useState } from 'react'
import {marked} from 'marked'
const SUPABASE_URL: string = process.env.SUPABASE_URL
    ? process.env.SUPABASE_URL
    : "https://afidlxjfjqerrfjfadwg.supabase.co";
const ANON_KEY: string = process.env.ANON_KEY
    ? process.env.ANON_KEY
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaWRseGpmanFlcnJmamZhZHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMzMzIxNDYsImV4cCI6MjAxODkwODE0Nn0.zBRYE2WRUD5jpOWfIBTcTSIeZIF2RVSeScUSP78IgXw";

const supabase = createClient(SUPABASE_URL, ANON_KEY);

export default function Page() {
    const { toast } = useToast()
    const [content, setContent] = useState("")

    const blogFormSchema = z.object({
        title: z.string().min(1, { message: "title cannot be empty" }).max(100),
        content: z.string().min(1, { message: "content cannot be empty" })
    })

    const form = useForm<z.infer<typeof blogFormSchema>>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
            title: "",
            content: ""
        },
    })

    function onChangeContent(contentValue: string) {
        setContent(contentValue)
        form.setValue('content', contentValue)
    }

    async function onSubmit(values: z.infer<typeof blogFormSchema>) {
        console.log(form.getValues())
        var userObject: any = sessionStorage.getItem('loggedInUser')
        if(userObject) {
            userObject = JSON.parse(userObject)
        }
        
        const { data, error } = await supabase
        .from('blogs')
        .insert([
        { title: values.title, content: values.content, userID: userObject['id'] },
        ])
        .select()

        if(data) {
            toast({
                title: "success💖",
                description: "created post successfully"
            })
        }

        if(error) {
            toast({
                title: "error☹️",
                description: error.message,
                variant: "destructive"
            })
        }
    }

    return <div className="gradient-bg w-screen h-screen flex flex-row items-center justify-center space-x-8">
        <Toaster />
        <div className="editor-window">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>title</FormLabel>
                                <FormControl>
                                    <Input placeholder="title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>content</FormLabel>
                                <FormControl>
                                    <Textarea className='blog-textarea' placeholder="content"  
                                    {...field}
                                    value={content}
                                    onChange={(e) => onChangeContent(e.target.value)} 
                                   />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
        <div className='email-preview w-1/3 border-l-2 border-black pl-8'>
            <div className='blog-preview p-6' dangerouslySetInnerHTML={{ __html: marked(content)}}></div>
        </div>
    </div>
}