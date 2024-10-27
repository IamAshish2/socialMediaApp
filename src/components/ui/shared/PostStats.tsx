import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/React-Query/queriesAndMutations";
import { checkIsLiked, checkIsSaved } from "@/lib/utils";
import { Models } from "appwrite";
import { useState } from "react";
import Loader from "./Loader";

{/* Like, Comment, Save Section */ }
type PostStatsProps = {
    post: Models.Document,
    userId: string
}
const PostStats = ({ post, userId }: PostStatsProps) => {
    const savedPostList = post.save.map(
        (user: Models.Document) => user.user.$id);
    const likesList = post.likes.map((user: Models.Document) => user.$id)
    const [likes, setLikes] = useState(likesList);

    const { mutate: likePost } = useLikePost();
    const { mutate: savePost,isPending:isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isPending:isDeletingSaved} = useDeleteSavedPost();
    const { data: currentUser } = useGetCurrentUser();


    const handleLikePost = (e: React.MouseEvent) => {
        console.log(likesList);

        e.stopPropagation();
        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId);

        if (hasLiked) {
            newLikes = newLikes.filter((id) => id != userId)
        } else {
            newLikes.push(userId)
        }
        setLikes(newLikes);
        likePost({ postId: post.$id, likesArray: newLikes })
    }

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        // comming from currentUser information array
        const savedPostRecord = currentUser?.save
            .find((record: Models.Document) => record.post.$id === post.$id)
        // console.log(savedPostRecord);


        if (savedPostRecord) {
            deleteSavedPost(savedPostRecord.$id);
            return;
        }
        savePost({ postId: post.$id, userId: userId })
    }

    return (
        <>
            {currentUser && (
                <div className="flex justify-between items-center z-20 mt-6">
                    <div className="flex mr-5 gap-2">
                        <img src={`
                         ${checkIsLiked(likes, userId) ?
                                "/assets/icons/liked.svg" :
                                "/assets/icons/like.svg"}`}
                            alt="like"
                            width={20}
                            height={20}
                            onClick={handleLikePost}
                            className="cursor-pointer" />

                        <span className="text-sm">{likes.length}</span>
                    </div>

                    <div className="flex mr-5 gap-2">
                        {isSavingPost || isDeletingSaved ? <Loader/> :  
                        <img src={`${checkIsSaved(savedPostList, currentUser.$id) ? 
                            "/assets/icons/saved.svg" : "/assets/icons/save.svg"}`}
                            alt="like"
                            width={20}
                            height={20}
                            onClick={handleSavePost}
                            className="cursor-pointer" />}
                    </div>
                </div>
            )}
        </>
    )
}

export default PostStats
