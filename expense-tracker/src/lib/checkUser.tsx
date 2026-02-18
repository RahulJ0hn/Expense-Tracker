import { currentUser } from "@clerk/nextjs/server";
import db from "./db";

export const checkUser = async () => {
    const user = await currentUser();
    if(!user) {
        return null;
    }

    const email = user.emailAddresses[0].emailAddress;

    // First check by clerkUserId
    const userById = await db.user.findUnique({
        where: { clerkUserId: user.id }
    });
    if (userById) {
        return userById;
    }

    // Check if a user with the same email exists (e.g. from a previous Clerk session)
    const userByEmail = await db.user.findUnique({
        where: { email }
    });
    if (userByEmail) {
        // Update the existing user's clerkUserId to the current one
        const updated = await db.user.update({
            where: { email },
            data: {
                clerkUserId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                imageUrl: user.imageUrl,
            },
        });
        return updated;
    }

    // No existing user found, create a new one
    const newUser = await db.user.create({
        data: {
            clerkUserId: user.id,
            email,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
        }
    });
    return newUser;
}