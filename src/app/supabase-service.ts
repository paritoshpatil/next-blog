import { createClient } from "@supabase/supabase-js";
import { pbkdf2Sync, randomBytes } from "crypto";

const SALT_ROUNDS: number = 5

const SUPABASE_URL: string = process.env.SUPABASE_URL
    ? process.env.SUPABASE_URL
    : "https://afidlxjfjqerrfjfadwg.supabase.co";

const ANON_KEY: string = process.env.ANON_KEY
    ? process.env.ANON_KEY
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaWRseGpmanFlcnJmamZhZHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMzMzIxNDYsImV4cCI6MjAxODkwODE0Nn0.zBRYE2WRUD5jpOWfIBTcTSIeZIF2RVSeScUSP78IgXw";

const supabase = createClient(SUPABASE_URL, ANON_KEY);

var userObject: any;

function fetchUserFromSession() {
    userObject = sessionStorage.getItem('loggedInUser')
    if(userObject) {
        userObject = JSON.parse(userObject)
    }
}

export async function getUser(ID: string) {

}

export function isUserLoggedIn() {
    fetchUserFromSession()
    if(!userObject) return false
    if(userObject.id) return true
    return false
}

export async function createUser(username: string, password: string) {
    var password_salt = randomBytes(8).toString('hex')
    var password_hash = pbkdf2Sync(password, password_salt, SALT_ROUNDS, 64, "sha512").toString('hex');

    const { data, error } = await supabase
        .from("user")
        .insert([{ username: username, password_hash: password_hash, password_salt: password_salt}])
        .select();

    if (data) {
        return({
            success: true,
            title: "success💖",
            description: "new user has been created, please login with the new account to continue"
        })            
    }

    if (error) {
        return({
            success: false,
            title: "error☹️",
            description: error.message,
        })
    }
}

export async function loginUser(username: string, password: string) {
    const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("username", username);
    
    if(!data || data.length < 1) {
        return({
            success: false,
            title: "error👎",
            description: "this user does not exist, please sign-up"
        })
    }

    if(data) {
        var currentHash = pbkdf2Sync(password, data[0].password_salt, SALT_ROUNDS, 64, 'sha512').toString('hex')
        if(currentHash == data[0].password_hash) {
            return {
                success: true, 
                title: "success💖",
                description: "logged in successfully",
                data: {
                    user: {
                        id: data[0].id,
                        username: username
                    }
                }
            }
        }
        else {
            return {
                success: false, 
                title: "error👎",
                description: "username or password is incorrect"
            } 
        }
    }

    if(error) {
        return {
            success: false,
            title: "error☹️",
            description: error['message'] ? error['message'] : "this user does not exist"
        }
    }
}

export async function getAllBlogs() {
    let { data, error } = await supabase
    .from('blogs')
    .select("*")  
            
    if(data) {
        return {
            success: true,
            data: {
                blogs: data
            }
        }
    }

    if(error) {
        return {
            success: false,
            title: "error☹️",
            description: error.message
        }
    }
}

export async function updateBlogByBlogID(blogID: string, title: string, content: string,) {
    debugger;
    const { data, error } = await supabase
    .from('blogs')
    .update({ title: title, content: content })
    .eq('id', blogID)
    .select()

    if(data) {
        return {
            success: true,
            title: "success ✅",
            description: "blog updated successfully"
        }
    }

    if(error) {
        return {
            success: false,
            title: "error☹️",
            description: error.message
        }
    }
        
}

export async function getBlogsByUserID() {
    fetchUserFromSession()
    let { data, error } = await supabase
    .from('blogs')
    .select("*")  
    .eq('userID', userObject['id'])
            
    if(data) {
        return {
            success: true,
            data: {
                blogs: data
            }
        }
    }

    if(error) {
        return {
            success: false,
            title: "error☹️",
            description: error.message
        }
    }
}

export async function createNewBlog(title: string, content: string) {
    fetchUserFromSession()
    const { data, error } = await supabase
        .from('blogs')
        .insert([
        { title: title, content: content, userID: userObject['id'] },
        ])
        .select()
        
        if(data) {
            return {
                success: true,
                title: "success😍",
                description: "new blog created successfully"
            }
        }
    
        if(error) {
            return {
                success: false,
                title: "error☹️",
                description: error.message
            }
        }
}

export type ResponseObject = {
    success: boolean,
    title: string, 
    description: string, 
    data: object
}