import PostForm from '@/components/ui/Forms/PostForm'
import { useGetPostById } from '@/lib/React-Query/queriesAndMutations';
import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom'

const UpdatePost = () => {
  const {id} = useParams();
  // we are getting something back hence {data:post}
  const {data:post,isPending} = useGetPostById(id || '');
  
  if(isPending) return <Loader/>

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/add-post.svg" alt="post" width={28} height={28} />
          <p className="font-bold ">Update Post</p>
        </div>
        <PostForm action="update" post={post}/>
      </div>
    </div>
  )
}

export default UpdatePost
