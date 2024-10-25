import PostForm from '../../components/ui/Forms/PostForm'

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img src="/assets/icons/add-post.svg" alt="post" width={28} height={28} />
            <p className="font-bold ">Create post</p>
        </div>
        <PostForm/>
      </div>
    </div>
  )
}

export default CreatePost
