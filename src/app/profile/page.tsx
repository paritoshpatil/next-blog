'use client'
const AVATAR_API_ENDPOINT = "https://ui-avatars.com/api/"
import { useEffect, useState } from 'react'
import '../globals.css'
import { getBlogsByUserID, updateBlogByBlogID } from '../supabase-service'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { PlusCircle, Pencil, Eye, Check, Ban } from 'lucide-react'
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
import {marked} from 'marked'


export default function Page() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    const [editContent, setEditContent] = useState("")
    const [editTitle, setEditTitle] = useState("")

    const [viewContent, setViewContent] = useState("")
    const [viewTitle, setViewTitle] = useState("")

    var userObject: any = sessionStorage.getItem('loggedInUser')
    if (userObject) {
        userObject = JSON.parse(userObject)
    }

    useEffect(() => {
        getBlogsByUserID(userObject.id)
            .then((response: any) => {
                setBlogs(response.data.blogs)
                setLoading(false)
            })
    }, [])


    if (loading) return "<p>loading ... </p>"
    if (!blogs) return "<p> no blogs for current user <p>"


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
        
    }

    return (
        <main className="gradient-bg">
            <Toaster/>
            <div className="flex flex-col justify-center items-center p-40">
                <div className="flex flex-row items-center w-full">
                    <h1 className="text-6xl">hi, {userObject['username']}</h1>
                    <Button className="ml-auto" variant="outline" onClick={logout}>logout</Button>
                </div>
                <div className='mt-10 self-start'>
                    <a href="/new-blog">
                        <Button className="px-12">create a new blog
                            <PlusCircle className='w-4 ml-2' />
                        </Button>
                    </a>

                    <h3 className='mb-4 mt-8'>your blogs</h3>
                    <div className='grid grid-cols-4'>
                        {
                            blogs.map(blog => {
                                return <Card className="mr-4 mb-4">
                                    <CardHeader>
                                        <CardTitle>{blog['title']}</CardTitle>
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
                                                    <DialogDescription>
                                                        you can only change the content, not the title
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}></Input>
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
                                                <div className="min-h-96 bg-white rounded-md" dangerouslySetInnerHTML={{ __html: marked(blog['content'])}}>
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