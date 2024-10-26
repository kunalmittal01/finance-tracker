import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react"
import { toast } from "react-toastify";
import { auth, db, provider } from "../firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = ()=>{
    const navigate = useNavigate()
    const [form, setForm] = useState(false)
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false)
    const onbtnclick = ()=>{
        setForm(!form)
    }
    const createDoc = async(user)=>{
        console.log(user);
        
        setLoading(true);
        if(!user) {
            setLoading(false);
            return;
        };
        const ref = doc(db, "users", user.uid)
        const userData = await getDoc(ref);
        if(!userData.exists()) {
            try {
                await setDoc(ref, {
                    name: user.displayName || "",
                    email: user.email,
                    uid: user.uid,
                    profilePic: user.photoURL || "",
                    createdAt: new Date(),
                })
                setLoading(false)
            }
            catch (error) {
                console.error(error);
                toast.error(error.message);
                setLoading(false);
            }
        }
        else {
            // toast.error('User already exists.');
            setLoading(false);
        }
    }
    const handleForm = (key,e)=>{
        setUserDetails({...userDetails,[key]: e.target.value})
    }

    const signupWithEmailAndPassword = async()=>{
        setLoading(true);
        if(userDetails.name == '' || userDetails.password == '' || userDetails.email == ''|| userDetails.confirmPassword == '') {
            toast.error('Please enter all fields.');
            setLoading(false);
            return;
        }
        if(userDetails.password != userDetails.confirmPassword) {
            toast.error('Passwords do not match.');
            setLoading(false);
            return;
        }
        try {
            const res = await createUserWithEmailAndPassword(auth, userDetails.email, userDetails.password)
            const user = res.user;
            createDoc(user);
            toast.success('User registered successfully.');
            setUserDetails({name: "", email: "", password: "", confirmPassword: ""});
            setLoading(false);
        }
        catch (error) {
            console.error(error);
            toast.error(error.message);
            setLoading(false);
        }
        
    }
    const signInwithEmailAndPassword = async()=>{
        setLoading(true);
        if(userDetails.email == '' || userDetails.password == '') {
            toast.error('Please enter all fields.');
            setLoading(false);
            return;
        }

        try {
            const res = await signInWithEmailAndPassword(auth, userDetails.email, userDetails.password)
            const user = res.user;
            createDoc(user);
            navigate('/dashboard');
            toast.success('User logged in successfully.');
            setUserDetails({name: "", email: "", password: "", confirmPassword: ""});
            setLoading(false);
        }
        catch (error) {
            console.error(error);
            toast.error(error.message);
            setLoading(false);
        }
    }

    const googlepopup = async()=>{
        const res = await signInWithPopup(auth, provider);
        const user = res.user;
        navigate('/home');
        toast.success('User logged in successfully.');
        createDoc(user);
    }

    const signin =()=>{
        return (
            <div className="signin">
                <div className="signup-wraper">
                    <p className="form-head">Log In on <span>Finance.Ly</span></p>
                    <div className="form">
                        <div className="email form-field">
                            <p>Email Address</p>
                            <input disabled={loading} value={userDetails.email} onChange={(e)=>handleForm('email',e)} type="email" placeholder="john.doe@example.com"/>
                        </div>
                        <div className="password form-field">
                            <p>Password</p>
                            <input disabled={loading} value={userDetails.password} onChange={(e)=>handleForm('password',e)} type="password" placeholder="********"/>
                        </div>
                        <button disabled={loading} onClick={signInwithEmailAndPassword} type="submit" className="form-btns signupbtn">{loading?"Loading...":"Log In"}</button>
                        <p className="text-center">or</p>
                        <button disabled={loading} onClick={googlepopup} className="form-btns loginbtn">{loading?"Loading...":"Log In With Google"}</button>
                        <p>Or Don't Have An Account? <button className="clickme" onClick={onbtnclick}>Click Here</button></p>
                    </div>
                </div>
                
            </div>
        )
    }

    return (
        <>
        {
            !form? <div className="signup">
            <div className="signup-wrap">
                <p className="form-head">Sign Up on <span>Finance.Ly</span></p>
                <div className="form">
                    <div className="name form-field">
                        <p>Full Name</p>
                        <input disabled={loading} value={userDetails.name} onChange={(e)=>handleForm('name',e)} type="text" placeholder="John Doe"/>
                    </div>
                    <div className="email form-field">
                        <p>Email Address</p>
                        <input disabled={loading} value={userDetails.email} onChange={(e)=>handleForm('email',e)} type="email" placeholder="john.doe@example.com"/>
                    </div>
                    <div className="password form-field">
                        <p>Password</p>
                        <input disabled={loading} value={userDetails.password} onChange={(e)=>handleForm('password',e)} type="password" placeholder="********"/>
                    </div>
                    <div className="confirm form-field">
                        <p>Confirm Password</p>
                        <input disabled={loading} value={userDetails.confirmPassword} onChange={(e)=>handleForm('confirmPassword',e)} type="password" placeholder="********"/>
                    </div>
                    <button onClick={signupWithEmailAndPassword} className="form-btns signupbtn" type="submit">{loading?"Loading...":"Sign Up"}</button>
                    <p className="text-center">or</p>
                    <button onClick={googlepopup} className="form-btns loginbtn">{loading?"Loading...":"Sign Up With Google"}</button>
                </div>
                <p>Or Already Have An Account? <button className="clickme" onClick={onbtnclick}>Click Here</button></p>
            </div>
        </div>:
        signin()
        }
        </>
    )
}

export default Signup;