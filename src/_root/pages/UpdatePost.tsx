import PostForm from '@/components/ui/Forms/PostForm'
import { getPostById } from '@/lib/Appwrite/api';
import { useParams } from 'react-router-dom'

const UpdatePost = () => {
  const {id} = useParams();

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/add-post.svg" alt="post" width={28} height={28} />
          <p className="font-bold ">Update Post</p>
        </div>
        <PostForm />
      </div>
    </div>
  )
}

export default UpdatePost
