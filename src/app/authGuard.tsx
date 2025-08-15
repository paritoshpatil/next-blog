import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userStore } from './userStore';

function useAuth() {
    const router = useRouter();
    const { isLoggedIn, setLoggedIn, user, setUser } = userStore()

    useEffect(() => {
        if (!isLoggedIn || !user) {
            // router.push('/login');
        }
    }, [router]);
}

export default useAuth;
