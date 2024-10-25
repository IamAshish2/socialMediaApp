import {
    useQuery,useMutation,useQueryClient,useInfiniteQuery
} from '@tanstack/react-query'
import { createNewPost, createUserAccount, signInAccount, signoutAccount } from '../Appwrite/api';
import { INewPost, INewUser } from '@/types';
import { QUERY_KEYS } from './queryKeys';


export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    });
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: 
            {
                email:string,
                password:string
            }) => signInAccount(user)
    });
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn:() => signoutAccount()
    })
}

export const useCreatePost = () => {
    // to be able to query all existing posts
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            post:INewPost
        ) => createNewPost(post),
        // currently to my understanding => 
        // to ensure we always get fresh posts from our server, we invalidate the recent queries so
        // react-query has to call the server again to get fresh posts !!
        onSuccess: () => {
            queryClient.invalidateQueries({
                // validates our typos [QUERY_KEYS.GET_RECENT_POSTS] ((instead of doing  queryKey:'getRecentPosts'))
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS] 
            })
        }
    })
}