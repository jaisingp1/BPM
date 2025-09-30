import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Temporary bypass authentication for development
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, category, flowDefinition } = await request.json();
    const workflowId = params.id;

    const updatedWorkflow = await db.workflow.update({
      where: { id: workflowId },
      data: {
        name,
        description,
        category,
        flowDefinition: flowDefinition || '{}'
      },
      include: {
        steps: true
      }
    });

    return NextResponse.json(updatedWorkflow);
  } catch (error) {
    console.error('Error updating workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflowId = params.id;

    // Delete workflow steps first
    await db.workflowStep.deleteMany({
      where: { workflowId }
    });

    // Delete workflow
    await db.workflow.delete({
      where: { id: workflowId }
    });

    return NextResponse.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}