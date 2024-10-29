import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

export const checkIsSaved = (saves:string [] , userId: string) => {  
  const hasSaved = saves.map((save) => {
    return save === userId;
  })
  return hasSaved[0];
};

export function formatTime(dateString: string) {
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