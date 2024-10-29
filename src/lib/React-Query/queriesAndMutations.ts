import {useQuery,useMutation,useQueryClient,useInfiniteQuery} from '@tanstack/react-query'
import { createNewPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, likePost, savePost, searchPosts, signInAccount, signoutAccount, updatePost } from '../Appwrite/api';
import { INewPost, INewUser, IUpdatePost } from '@/types';
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

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: () =>  getRecentPosts()
    }) 
}

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({postId,likesArray}:{postId:string,likesArray:string[]}) => likePost(postId,likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({postId,userId}:{postId:string,userId:string}) => savePost(postId,userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId:string) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery ({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER],
        queryFn: () => getCurrentUser()
    })
}

export const useGetPostById = (postId:string) => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post:IUpdatePost) => updatePost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId:string) => deletePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

// yet to understand
export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey:[QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn : getInfinitePosts,
        getNextPageParam : (lastPage) => {
            if(lastPage && lastPage.documents.length === 0) return null;
            const lastId = lastPage.documents[lastPage?.documents.length - 1].$id;
            return lastId;
        }
    })
}

// yet to understand
export const useSearchPosts = (serachTerm:string) => {
    return useQuery({
        queryKey : [QUERY_KEYS.SEARCH_POSTS,serachTerm],
        queryFn : () => searchPosts(serachTerm),
        enabled : !!serachTerm
    })
}
