'use client'
import { useEffect, useState } from 'react'
import '../globals.css'
import { deleteBlogById, getBlogsByUserID, updateBlogByBlogID } from '../supabase-service'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { PlusCircle, Pencil, Eye, Check, Ban, FileX, X } from 'lucide-react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { marked } from 'marked'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { userStore } from '../userStore'



export default function Page() {
    const greetings = ['dude', 'bro', 'man', 'friend', 'skipper', 'champ', 'sport', 'fam', 'bantai', 'bhai']
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    const {user, setUser, setLoggedIn} = userStore()

    const [editContent, setEditContent] = useState("")
    const [editTitle, setEditTitle] = useState("")

    function fetchBlogs() {
        getBlogsByUserID(user['id'])
            .then((response: any) => {
                if(response && response.data && response.data.blogs) {
                    setBlogs(response.data.blogs)
                    setLoading(false)
                }
                else {
                    setUser({username: "", id: ""})
                    setLoggedIn(false)
                    router.push("/login")
                    toast({
                        title: "error😭",
                        description: "there was a problem fetching your blogs, please re-login and try again",
                        variant: "destructive"
                    })
                }
            })
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    function getBlogDisplayContent(content: string) {
        if (content.length > 100) {
            return content.substring(1, 97) + " ..."
        }
        else return content
    }

    function logout() {
        sessionStorage.setItem('loggedInUser', "")
        router.push("/login")
    }

    async function updateBlog(blogID: string) {
        var response: any = await updateBlogByBlogID(blogID, editTitle, editContent)

        toast({
            title: response?.title,
            description: response?.description,
            variant: response?.success ? "default" : "destructive"
        })

        if (response.success) {
            fetchBlogs()
        }
    }

    function getUserName() {
        if(user) {
            return user['username']
        }
        else {
            return greetings[Math.random() * greetings.length]
        }
    }

    async function deleteBlog(id: string) {
        var response: any = await deleteBlogById(id)

        if(response.success) {
            fetchBlogs()
        }

        toast({
            title: response?.title,
            description: response?.description,
            variant: response?.success ? "default" : "destructive"
        })
    }


    return (
        <main className="gradient-bg">
            <Toaster />
            <div className="flex flex-col justify-center items-center p-40">
                <div className="flex flex-row items-center w-full">
                    <h1 className="text-6xl font-normal">hi, <span className="font-bold">{getUserName()}</span></h1>
                </div>
                <div className='mt-10 self-start'>
                    <Link href="/new-blog">
                        <Button className="px-12">create a new blog
                            <PlusCircle className='w-4 ml-2' />
                        </Button>
                    </Link>

                    <h3 className='mb-4 mt-8'>your blogs</h3>
                    <div className='grid grid-cols-4'>
                        {loading && [...Array(3)].map((_, index) => <Skeleton className="w-96 h-60 mr-4 mb-4" key={index.toString()} />)}
                        {
                            blogs.map(blog => {
                                return <Card className="mr-4 mb-4" key={blog['id']}>
                                    <CardHeader>
                                        <CardTitle className='h-8 overflow-hidden text-ellipsis whitespace-nowrap'>{blog['title']}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="min-h-24">
                                        <p>{getBlogDisplayContent(blog['content'])}</p>
                                    </CardContent>
                                    <CardFooter className="justify-end">
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button className="mr-4 self-end" variant="outline" onClick={(e) => { setEditContent(blog['content']); setEditTitle(blog['title']) }}>edit
                                                    <Pencil className="w-4 ml-2" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>edit your blog</DialogTitle>
                                                </DialogHeader>
                                                <Label>title</Label>
                                                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}></Input>
                                                <Label>content</Label>
                                                <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-96">
                                                </Textarea>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button className="mr-2" variant="destructive">
                                                            cancel
                                                            <Ban className="w-4 ml-2" />
                                                        </Button>
                                                    </DialogClose>
                                                    <Button onClick={(e) => updateBlog(blog['id'])}>
                                                        save
                                                        <Check className="w-4 ml-2" />
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger>
                                                <Button className="mr-4 self-end">view
                                                    <Eye className="w-4 ml-2" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        {blog['title']}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="min-h-96 rounded-md" dangerouslySetInnerHTML={{ __html: marked(blog['content']) }}>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger>
                                                <Button className='mr-4 self-end' variant="destructive">
                                                    delete
                                                    <FileX className="w-4 ml-2"/>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogTitle>delete blog</DialogTitle>
                                                <p>are you sure you want to delete <strong>{blog['title']}</strong></p>
                                                <div className="w-full flex flex-row justify-end ">
                                                <DialogClose asChild>
                                                    <Button onClick={() => deleteBlog(blog['id'])}>
                                                        yes
                                                        <Check className="w-4 ml-2"/>
                                                    </Button>
                                                </DialogClose>

                                                <DialogClose asChild>
                                                    <Button variant="destructive" className="ml-2">
                                                        no
                                                        <X className="w-4 ml-2"/>
                                                    </Button>
                                                </DialogClose>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </CardFooter>
                                </Card>

                            })
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}