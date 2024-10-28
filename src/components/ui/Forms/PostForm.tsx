import { createPostValidationSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Textarea } from "../textarea"
import FileUploader from "../shared/FileUploader"
import { Models } from "appwrite"
import { useCreatePost, useUpdatePost } from "@/lib/React-Query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"


// the post is comming as a prop when updating the post
type PostFormProps = {
    post?: Models.Document, // models from appwrite,
    action: 'create' | 'update'
}

const PostForm = ({ post, action }: PostFormProps) => {
    const { user } = useUserContext();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { mutateAsync: createPost, isSuccess: isCreatingPost } = useCreatePost();
    const { mutateAsync: updatePost, isSuccess } = useUpdatePost();

    const form = useForm<z.infer<typeof createPostValidationSchema>>({
        resolver: zodResolver(createPostValidationSchema),
        defaultValues: {
            caption: post ? post?.caption : "",
            file: [],
            location: post ? post?.location : "",
            tags: post ? post.tags.join(',') : ''
        },
    })

    async function onSubmit(values: z.infer<typeof createPostValidationSchema>) {
        if (post && action === 'update') {
            if (post?.$id) {
                // send a object of type IUPDATEPOST to update the post via tanstack query to api
                const updatedPost = await updatePost({
                    postId: post?.$id,
                    caption: values.caption,
                    imageUrl: post?.imageUrl,
                    imageId: post?.$id,
                    file: values.file,
                    location: values.location,
                    tags: values.tags
                });

                if (!updatedPost) {
                    toast({ title: "sorry! could not update the post at the moment" });
                }
                navigate('/');
            }
        } else {

            // create a new post for the user
            const newPost = await createPost({
                ...values,
                userId: user.id
            });

            if (!newPost && !isCreatingPost) {
                toast({ title: "sorry! could not create a post at the moment" });
            }
            navigate('/');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Title</FormLabel>
                            <FormControl>
                                <Textarea className="shad-text-area custom-scrollbar" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form-message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Photos</FormLabel>
                            <FormControl>
                                <FileUploader
                                    fieldChange={field.onChange}
                                    mediaUrl={post?.imageUrl} />
                            </FormControl>
                            <FormMessage className="shad-form-message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="shad-form_label">Add Location</FormLabel>
                            <FormControl>
                                <input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form-message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="shad-form_label">Add Tag (separated by commma " , ") </FormLabel>
                            <FormControl>
                                <input type="text" className="shad-input" placeholder="Art, Food, Travel" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form-message" />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button type="button" className="shad-button_dark_4">Cancel</Button>
                    <Button type="submit" className="shad-button_primary whitespace-nowrap">Submit</Button>
                </div>

            </form>
        </Form>
    )
}

export default PostForm
