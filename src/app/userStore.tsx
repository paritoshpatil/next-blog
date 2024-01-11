import { create } from 'zustand'

export interface User {
    username: string
    id: string
}

export interface UserStore {
    user: User
    isLoggedIn: boolean
    setUser: (user: User) => void
    setLoggedIn: (isLoggedIn: boolean) => void
}

export const userStore = create<UserStore>((set) => ({
    user: {username: "", id: ""},
    isLoggedIn: false,
    setUser: (user: User) => set({user}),
    setLoggedIn: (isLoggedIn: boolean) => set({isLoggedIn})
}))