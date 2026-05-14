import { NextResponse } from 'next/server'; 
import fs from 'fs'; 
import path from 'path'; 
  
const DB_PATH = path.join(process.cwd(), 'db.json'); 
  
function readDB() { 
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); 
  return data; 
} 
  
function writeDB(data: any) { 
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); 
} 

type RouteParams = { params: { id: string } };


export async function GET({ params }: RouteParams) { 
  const db = readDB(); 
  const project = db.projects.find((p: any) => p.id === params.id);

  if (!project) {
    return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
  }

  return NextResponse.json(project); 
} 

export async function PUT(request: Request, { params }: RouteParams) {
    const body = await request.json(); 
    const db = readDB(); 

    
    const projectIndex = db.projects.findIndex((p: any) => p.id === params.id);

    if (projectIndex === -1) {
        return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
    }

    
    db.projects[projectIndex] = {
        ...db.projects[projectIndex],
        name: body.name,
        color: body.color 
    };
    
    writeDB(db); 
    
    return NextResponse.json(db.projects[projectIndex], { status: 200 }); 
}


export async function DELETE(request: Request, { params }: RouteParams) {
    const db = readDB(); 

    const projectExists = db.projects.some((p: any) => p.id === params.id);

    if (!projectExists) {
        return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
    }
    
    db.projects = db.projects.filter((p: any) => p.id !== params.id);
    
    writeDB(db);

    return NextResponse.json({ message: 'Projet supprimé avec succès' }, { status: 200 });
}