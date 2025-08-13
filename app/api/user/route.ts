import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from Clerk
    const clerkUser = await (await clerkClient()).users.getUser(userId);

    // Get or create user in our database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        userSettings: true,
        _count: {
          select: {
            conversations: true,
            usageStats: true,
          },
        },
      },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          name: `${clerkUser.firstName || ""} ${
            clerkUser.lastName || ""
          }`.trim(),
          imageUrl: clerkUser.imageUrl,
          username: clerkUser.username || undefined,
        },
        include: {
          userSettings: true,
          _count: {
            select: {
              conversations: true,
              usageStats: true,
            },
          },
        },
      });

      // Create default user settings
      await prisma.userSettings.create({
        data: {
          userId: user.id,
          theme: "system",
          language: "en",
          defaultModel: "gpt-4o-mini",
          maxTokens: 4000,
          temperature: 0.7,
          enableStreaming: true,
          enableNotifications: true,
          enableAnalytics: true,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, username, bio, imageUrl } = await req.json();

    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(imageUrl && { imageUrl }),
      },
      include: {
        userSettings: true,
        _count: {
          select: {
            conversations: true,
            usageStats: true,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
