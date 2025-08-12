import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { userSettings: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.userSettings);
  } catch (error) {
    console.error('Get user settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      theme,
      language,
      defaultModel,
      maxTokens,
      temperature,
      enableStreaming,
      enableNotifications,
      enableAnalytics,
    } = await req.json();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { userSettings: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedSettings = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        ...(theme && { theme }),
        ...(language && { language }),
        ...(defaultModel && { defaultModel }),
        ...(maxTokens && { maxTokens }),
        ...(temperature !== undefined && { temperature }),
        ...(enableStreaming !== undefined && { enableStreaming }),
        ...(enableNotifications !== undefined && { enableNotifications }),
        ...(enableAnalytics !== undefined && { enableAnalytics }),
      }
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Update user settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
