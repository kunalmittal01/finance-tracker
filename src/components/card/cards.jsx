import { useContext } from "react";
import { context } from "../../App";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase.config";

const Card = (props)=>{
    const [user] = useAuthState(auth)
    const ctx = useContext(context);
    const handleModal = ()=>{
        if(props.title != "Current Balance") {
            ctx.dispatch({type: 'SET_OPTIONS', payload: props.op})
        }
        else {
            ctx.dispatch({type: 'RESET_BALANCE', payload: user?.uid})
        }
    }
    return (
        <div className="card">
            <p>{props.title}</p>
            <p>₹{props.title =="Current Balance"?ctx.state.currentBalance:props.title=="Total Income"?ctx.state.totalIncome:ctx.state.totalExpense}</p>
            <button onClick={handleModal} className="form-btns loginbtn">{props.btn}</button>
        </div>
    )
}

export default Card;