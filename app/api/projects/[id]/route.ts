import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ 
    where: { id: Number(id) } 
  });
  
  if (!project) return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const { name } = await request.json();
  
  const project = await prisma.project.update({ 
    where: { id: Number(id) }, 
    data: { name } 
  });
  
  return NextResponse.json(project);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  
  await prisma.project.delete({ 
    where: { id: Number(id) } 
  });
  
  return new NextResponse(null, { status: 204 });
}

