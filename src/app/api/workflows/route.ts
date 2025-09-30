import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Temporary bypass authentication for development
export async function GET(request: NextRequest) {
  try {
    const workflows = await db.workflow.findMany({
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

    return NextResponse.json({ workflows });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, category, flowDefinition } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const workflow = await db.workflow.create({
      data: {
        name,
        description: description || '',
        category: category || 'General',
        isActive: true,
        flowDefinition: flowDefinition || '{}',
        createdBy: 'temp-user' // Temporary user ID
      },
      include: {
        steps: true
      }
    });

    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}