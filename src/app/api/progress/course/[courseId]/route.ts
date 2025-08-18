import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { getCourseProgress } from '@/utils/progress';

type Params = Promise<{ courseId: string }>;

export async function GET(
  request: NextRequest,
  context: { params: Params }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await context.params;
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' }, 
        { status: 400 }
      );
    }

    const userId = session.user.email;
    const progress = await getCourseProgress(userId, courseId);

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error getting course progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}