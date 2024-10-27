import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite"

import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type Props = {
    post: Models.Document
}

const PostCard = ({ post }: Props) => {

    const { user } = useUserContext();
    const tags = post.tags[0]?.split(' ');

    function timeAgo(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();

        // Calculate the difference in milliseconds
        const diffInMs = now.getTime() - date.getTime();

        // Convert milliseconds to days
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return "Today";
        } else if (diffInDays === 1) {
            return "1 day ago";
        } else {
            return `${diffInDays} days ago`;
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col border border-gray-300 rounded-xl w-[90%] max-w-2xl p-6 shadow-lg ">
                {/* User Section */}
                <div className="flex items-center justify-between p-3 border-b border-gray-200 mb-4">
                    <Link to={`/profile/${post.creator.$id}`}>
                        <div className="flex gap-3 items-center">
                            <img src="/assets/images/profile.png" alt="profilePic" className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="text-lg font-semibold text-light-2">{post.creator.name}</p>
                                <p className="text-sm text-gray-500">{timeAgo(post.$createdAt)} &#8226; {post.location}</p>
                            </div>
                        </div>
                    </Link>
                    {/* Edit Icon - Show only if it's the user's post */}
                    {user.id === post.creator.$id && (
                        <Link to={`/update-post/${post.$id}`} className="text-gray-500 hover:text-gray-700">
                            <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
                        </Link>
                    )}
                </div>

                {/* Caption and Tags */}
                <div className="mt-4 ml-2">
                    {/* Caption */}
                    <p className="text-md text-light-2 font-medium">{post.caption}</p>
                    {/* Tags */}
                    <ul className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag: string) => (
                            <li key={tag} className="text-sm text-indigo-600">#{tag}</li>
                        ))}
                    </ul>
                </div>

                {/* Post Image */}
                <div className="rounded-xl overflow-hidden mt-6">
                    <img src={post.imageUrl} alt="post-image" className="w-full object-cover" />
                </div>

                <PostStats post={post} userId={user.id} />
            </div>
        </div>

    )
}

export default PostCard
