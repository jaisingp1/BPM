import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Temporary bypass authentication for development
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const requests = await db.request.findMany({
      where,
      include: {
        requestType: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.request.count({ where });

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requestTypeId, title } = await request.json();

    if (!requestTypeId || !title) {
      return NextResponse.json(
        { error: 'Request type ID and title are required' },
        { status: 400 }
      );
    }

    // Create a simple request for now
    const newRequest = await db.request.create({
      data: {
        requestTypeId,
        title,
        status: 'pending',
        createdById: 'temp-user',
        priority: 'medium'
      },
      include: {
        requestType: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ request: newRequest });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}