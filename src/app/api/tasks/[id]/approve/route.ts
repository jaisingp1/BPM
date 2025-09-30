import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { WorkflowEngine } from '@/lib/workflow-engine';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const task = await db.task.findUnique({
      where: { id: params.id },
      include: { request: true },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.assignedTo !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const workflowEngine = new WorkflowEngine();
    await workflowEngine.executeFlowStep(
      task.requestId,
      'approved',
      { action: 'approve', comments: 'Task approved' },
      user.id
    );

    return NextResponse.json({ message: 'Task approved successfully' });
  } catch (error) {
    console.error('Error approving task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}