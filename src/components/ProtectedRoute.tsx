import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import type React from "react";


interface props {children: React.ReactNode}

export default function ProtectedRoute({children }: props){
    const {state}= useAuth();
    const location = useLocation();

    if(!state.user){
        return <Navigate to="/login" state={{from: location.pathname}} replace/>
    }

    
    return <>{children}</>

}