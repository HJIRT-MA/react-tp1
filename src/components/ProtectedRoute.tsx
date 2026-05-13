import { Navigate, useLocation } from "react-router-dom";
import type React from "react";
import { type RootState } from '../store'; 
import { useSelector } from "react-redux";

interface props {children: React.ReactNode}

export default function ProtectedRoute({children }: props){
    const { user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if(!user){
        return <Navigate to="/login" state={{from: location.pathname}} replace/>
    }

    
    return <>{children}</>

}