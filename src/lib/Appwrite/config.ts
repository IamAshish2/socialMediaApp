import {Client,Account,Databases,Storage,Avatars} from "appwrite"

export const appWriteConfig = {
    url : import.meta.env.VITE_APPWRITE_URL,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId:import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
    postsCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
    usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID
}

export const client = new Client();
client.setEndpoint(appWriteConfig.url);
client.setProject(appWriteConfig.projectId);

export const account = new Account(client);

export const databases = new Databases(client);

export const storage = new Storage(client);

export const avatars = new Avatars(client);