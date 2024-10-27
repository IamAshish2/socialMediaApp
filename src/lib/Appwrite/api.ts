import { AppwriteException, ID, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
import { account, appWriteConfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user:INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId:newAccount.$id,
            name: newAccount.name,
            email:newAccount.email,
            username:user.username,
            imageUrl:avatarUrl // i have a string return rn 
        })
        
        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}


export async function saveUserToDB(user:{
    accountId:string,
    email:string,
    name:string,
    imageUrl: string, // i might have to set this to string
    username?:string
}) {
    console.log(appWriteConfig.databaseId);
       console.log(appWriteConfig.usersCollectionId);
    try{
       const newUser = await databases.createDocument(
        appWriteConfig.databaseId,
        appWriteConfig.usersCollectionId,
        ID.unique(), // why is this not working
        user
       )
       return newUser;
    }catch(err){
        console.log(err);
    }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    
      const session = await account.createEmailPasswordSession(user.email, user.password);

      if (!session) {
          throw new Error("Failed to create session.");
      }

      
      return session;
  } catch (error) {
      console.log("Sign-In Error:", error);
      return null;
  }
}


// ============================== SIGN OUT
export async function signoutAccount() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log("Sign-out Error:", error);
        return null;
    }
  }
  
  // ============================== GET ACCOUNT
  export async function getAccount() {
    try {
        // First, check if there's an active session.
        const session = await account.getSession('current');
        if (!session) {
            throw new Error('No active session');
        }
        
        // Fetch account details if a session exists.
        const currentAccount = await account.get();
        return currentAccount;
    } catch (error) {
        console.log("Error fetching account:", error);
        return null;
    }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) return null;

    const currentUser = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || !currentUser.documents.length) throw new Error("User not found");

    return currentUser.documents[0];

  } catch (error: any) {
    console.log("Error fetching current user:", error.message || error);
    return null;
  }
}

export async function createNewPost (post:INewPost) {
    try {
        // upload image to storage
        const imagetoUpload = await uploadImageToStorage(post.file[0]);
        
        if(!imagetoUpload){
            throw Error();
            
        }
        // now that we have uploaded the image to our storage , it is time to attach the file to our post
        const uploadedImageFileUrl = await getFilePreview(imagetoUpload.$id);
        if(!uploadedImageFileUrl){
            // if we didn't get a url back , then delete the file from the storage, it is likely corrupted
            deleteFile(imagetoUpload.$id);
            throw Error;
        }

        // convert the tags into an array
        const tags = post.tags?.trim().replace(/(^\s+|\s+$)/g,'').split(',') || [];

        // create a post
        const newPost = await databases.createDocument(
            appWriteConfig.databaseId,
            appWriteConfig.postsCollectionId,
            ID.unique(),
            // submit the entire object of the post
            {
                creator:post.userId,
                caption:post.caption,
                tags:tags,
                imageUrl:uploadedImageFileUrl,
                imageId:imagetoUpload.$id,
                location:post.location
            }
        );
        if(!newPost){
            // delete the imagefile from the storage if we could not create the post 
            await deleteFile(imagetoUpload.$id);
            throw Error;
        }

        return newPost;

    } catch (error) {
        console.log(error);
        
    }
}

export async function uploadImageToStorage(image:File){
   try {
    const promise = await storage.createFile(
        appWriteConfig.storageId,
        ID.unique(),
        image // the file we want to upload
    );
    
    if(!promise){
        throw new Error("Couldnot save to storage");
    }
    return promise;
   } catch (error) {
    console.log(error);
    
   }
}

// get the url of the image that you have stored in the storage
export async function getFilePreview(imageId:string){
    try {
        const imageUrl = await storage.getFilePreview(
            appWriteConfig.storageId,
            imageId
        );
        return imageUrl;
    } catch (error) {
        console.log(error);
        
    }
}

export async function deleteFile(imageId:string){
    try {
        const result = await storage.deleteFile(
            appWriteConfig.storageId,
            imageId
        );
        return result;
    } catch (error) {
        console.log(error);
    }
    
}

export async function getRecentPosts(){
    const  posts = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.postsCollectionId,
        [Query.orderDesc('$createdAt'),Query.limit(20)]
    );
    if(!posts) throw Error;
    return posts;
}

export async function likePost(postId:string,likesArray:string[]){
    try {
        const updatedPost = await databases.updateDocument(
            appWriteConfig.databaseId,
            appWriteConfig.postsCollectionId,
            postId,
            {
                likes: likesArray
            }
        )

        if(!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
        
    }
}

export async function savePost(postId:string,userId:string){
    try {
        const updatedPost = await databases.createDocument(
            appWriteConfig.databaseId,
            appWriteConfig.savesCollectionId,
            ID.unique(),
            {
             user: userId,
             post:postId
            }
        )

        if(!updatedPost) throw Error;
        
        return updatedPost;
    } catch (error) {
        console.log(error);
        
    }
}

export async function deleteSavedPost(savedRecordId: string){
    try {
        const statusCode = await databases.deleteDocument(
            appWriteConfig.databaseId,
            appWriteConfig.savesCollectionId,
           savedRecordId
        )

        if(!statusCode) throw Error;

        return statusCode;
    } catch (error) {
        console.log(error);
        
    }
}

export async function getPostById(postId:string) {
    const result = await databases.getDocument(
        appWriteConfig.databaseId,
        appWriteConfig.postsCollectionId,
        postId
    );
    if(!result) throw Error;
    return result;
}