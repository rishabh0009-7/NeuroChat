import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export const getCurrentUser = async () => {
  try {
    const { userId } = await auth();
    if (!userId) return null;
    
    return await clerkClient.users.getUser(userId);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const getUserByClerkId = async (clerkId: string) => {
  try {
    return await clerkClient.users.getUser(clerkId);
  } catch (error) {
    console.error("Error getting user by clerk ID:", error);
    return null;
  }
};