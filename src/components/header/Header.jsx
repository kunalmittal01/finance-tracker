import { useEffect, useState } from "react";
import { auth, db } from "../../firebase.config";
import {useAuthState} from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const Header = ()=>{
    const navigate = useNavigate()
    const [user,loading] = useAuthState(auth);
    useEffect(()=>{
        if(user) {
            navigate('/home')
        }
        
    },[user,loading]);

    const logOut = async()=>{
        await signOut(auth);
        navigate('/')
    }
    return (
        <div className="header">
            <p>finance.Ly</p>
            <div className="header-wrap">
                {user?
                    <>
                    <div className="user-info">
                        {user?.photoURL && <img src={user?.photoURL} alt=""/> || <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                        <p>Hello <span>{user?.displayName}</span></p>   
                    </div>
                    <div className="logoutbtn"><button onClick={logOut}>Logout</button></div>
                    </>:""
                }
            </div>
        </div>
    )
}

export default Header;