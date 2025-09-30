import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workflowTemplates } from '@/lib/workflows';

// Temporary bypass authentication for development
export async function GET(request: NextRequest) {
  try {
    // Get workflows from database
    const dbWorkflows = await db.workflow.findMany({
      include: {
        steps: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // If no workflows in database, return template workflows
    if (dbWorkflows.length === 0) {
      return NextResponse.json({
        success: true,
        data: workflowTemplates.map(template => ({
          id: template.id,
          name: template.name,
          description: template.description,
          category: template.category,
          estimatedDuration: template.estimatedDuration,
          isActive: true,
          steps: template.steps.map((step, index) => ({
            id: step.id,
            name: step.name,
            description: step.description,
            type: step.type,
            order: index + 1,
            assigneeRole: step.assigneeRole,
            requiredFields: step.requiredFields || [],
            possibleActions: step.possibleActions || [],
            estimatedDuration: step.estimatedDuration
          }))
        }))
      });
    }

    return NextResponse.json({
      success: true,
      data: dbWorkflows
    });
  } catch (error) {
    console.error('Error fetching flows:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, flowDefinition } = await request.json();

    if (!name || !flowDefinition) {
      return NextResponse.json(
        { error: 'Name and flow definition are required' },
        { status: 400 }
      );
    }

    const flow = await db.requestType.create({
      data: {
        name,
        description,
        flowDefinition: JSON.stringify(flowDefinition),
      },
    });

    return NextResponse.json({ flow });
  } catch (error) {
    console.error('Error creating flow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}