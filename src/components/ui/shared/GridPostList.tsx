import { useUserContext } from "@/context/AuthContext"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"

type GridPostListProps = {
  posts?: Models.Document[],
  showUser?: boolean,
  showStats?: boolean
}

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {

  const { user } = useUserContext();
  console.log(user);

  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img src={post.imageUrl} alt="post" className="h-full w-full object-cover" />
          </Link>

          <div className="absolute bottom-0 flex justify-between p-5 w-full items-center gap-2">
            {showUser && (
              <div className="flex  flex-1 items-center gap-2 justify-start">
                <img src={post.creator.imageUrl} alt="creator" className="h-6 w-6 rounded-full" />
                <p className="line-clamp-1 text-md">{post.creator.name}</p>

              </div>
            )}
            {

              showStats && (<PostStats post={post} userId={user.id} />)
            }
          </div>
        </li>
      ))}
    </ul>
  )
}

export default GridPostList
