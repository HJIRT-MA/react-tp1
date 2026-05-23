'use server'

import { cookies } from 'next/headers'; 
import { redirect } from 'next/navigation';

export async function login(prevState:any, formData: FormData) {
    const email = formData.get('email') as string; 
    const password = formData.get('password') as string; 


     if (email !== 'admin@taskflow.com' || password !== 'password123') { 
    return { error: 'Email ou mot de passe incorrect' }; 
  } 

  const cookieStrore = await cookies();

  cookieStrore.set('session', JSON.stringify({
    email, name:'admin', role:'admin'

  }), {
    httpOnly: true, 
    secure: false, 
    maxAge: 3600, 
    path: '/',
  });
  redirect('/dashboard');
}


export async function logoutAction() {
    const cookieStrore = await cookies();
    
    cookieStrore.delete('session')
    redirect('/login')
}

