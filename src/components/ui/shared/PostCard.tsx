import { Models } from "appwrite"
import { CiHeart } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { MdOutlineInsertComment } from "react-icons/md";

type Props = {
    post: Models.Document
}

const PostCard = ({ post }: Props) => {

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
        <div className="flex flex-col ">
            <div className="flex flex-col border border-gray-600 border-r-2 rounded-s-xl ml-auto mr-auto w-[90%] h-[31rem] p-6">
                {/* user  */}
                <div className="flex items-center gap-2 p-2 ">
                    <img src="/assets/images/profile.png" alt="profilePic" />
                    <div>
                        <p>{post.creator.name}</p>
                        <p className="text-sm text-light-3">{timeAgo(post.$createdAt)} &#8226;  {post.location}</p>
                    </div>
                </div>
                {/* caption */}
                <div className=" text-md w-full p-2 text-pretty">
                    {post.caption}
                </div>
                {/* image */}
                <div className="rounded-xl mt-6 ">
                    <img src={post.imageUrl} alt="post-image" />
                </div>
                {/* like save section */}
                <div className="mt-8 flex justify-between">
                    <div className="flex items-center gap-2">
                        <CiHeart size={26} /> 0 likes
                    </div>
                    <div>
                        <MdOutlineInsertComment  size={26}/>
                    </div>
                    <div>
                        <CiBookmark size={26} />
                    </div>
                </div>

            </div>

        </div>
    )
}

export default PostCard
