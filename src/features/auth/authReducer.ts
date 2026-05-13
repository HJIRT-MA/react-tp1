export interface User{
    id: string;
    email:string;
    name:string;
}

export interface AuthState{
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export type AuthAction = 
| { type:'LOGIN_START' } 
| { type:'LOGIN_SUCCESS'; payload:User & {token: string}}
| { type:'LOGIN_FAILURE'; payload: string}
| { type:'LOGOUT'};

export const initialState: AuthState ={
  user: null,
  token: null,
  loading: false,
  error: null,
}

export function authReducer(state: AuthState, action: AuthAction ){
  switch(action.type){
    case 'LOGIN_START':
      return {user: null ,token: state.token, loading: true, error: null};
    case 'LOGIN_SUCCESS':
       return { 
    user: action.payload,
    token: action.payload.token|| null,  // NOUVEAU 
    loading: false, 
    error: null 
  }; 
    case 'LOGIN_FAILURE':
      return {user: null, token : null , loading: false, error: action.payload}
    case 'LOGOUT':
      return initialState;
    default:
      return state;
      }
  
}

