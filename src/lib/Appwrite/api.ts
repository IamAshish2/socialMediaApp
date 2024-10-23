import { ID, Query } from "appwrite";
import { INewUser } from "@/types";
import { account, appWriteConfig, avatars, databases } from "./config";


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
    try{
       const newUser = await databases.createDocument(
        appWriteConfig.databaseId,
        appWriteConfig.usersCollectionId,
        ID.unique(), // why is this not working
       { user}
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
    
    if (!currentAccount) throw new Error("No account found");

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

  