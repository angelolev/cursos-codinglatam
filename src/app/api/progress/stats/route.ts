import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { getUserProgressStats, getUserCourseProgress } from '@/utils/progress';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const [stats, courseProgress] = await Promise.all([
      getUserProgressStats(userId),
      getUserCourseProgress(userId)
    ]);

    return NextResponse.json({ 
      stats,
      courseProgress 
    });
  } catch (error) {
    console.error('Error getting progress stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}