import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase.config";
import { addDoc, collection, getDocs, query } from "firebase/firestore";

const Modal = ({importData})=>{
    const ctx = useContext(context);
    const [transactionData, SetTransactionData] = useState([]);
    const [transaction, setTransaction] = useState({
        name: "",
        amount: 0,
        date: "",
        tag: "",
        type: ""
    });
    const [user] = useAuthState(auth);

    const hideModal = ()=>{
        ctx.dispatch({type: 'HIDE_MODAL'});
    }

    const handleTransaction = (e,msg)=>{
        setTransaction({...transaction, [msg]: e.target.value, type: ctx.state?.optionList[0]=="Salary"?"Income":"Expense"})
    }

    const fetchTransaction = async()=>{
        try {
            const res = query(collection(db, `users/${user?.uid}/transactions`))
            const docsData = await getDocs(res);
            toast.success("Transactions Fetched Successfuly")
            const arr = [];
            console.log({...docsData.docs[0].data(), id: docsData.docs[0].ref})
            docsData.docs.forEach(doc=>arr.push({...doc.data(), id: doc.ref.id}));
            SetTransactionData([...arr]);
        }
        catch(e) {
            console.error(e);
        }
    }

    const addTransaction = async()=>{
        if(transaction.name == '' || transaction.tag =='' || transaction.date=='') {
            toast.error('Please fill all fields');
            return;
        }
        try {
            const ref = await addDoc(collection(db, `users/${user.uid}/transactions`),transaction);
            console.log(ref.id);
            toast.success("Added transaction");
            fetchTransaction();
        }
        catch(e) {
            console.error(e);
            toast.error("Error adding transaction");
        }
        ctx.dispatch({type: "HIDE_MODAL"})
    }

    const calculations = ()=>{
        let income = transactionData.filter(tr=>tr.type=="Income").reduce((acc,curr)=> acc+Number(curr.amount),0);
        let expense = transactionData.filter(tr=>tr.type=="Expense").reduce((acc,curr)=> acc+Number(curr.amount),0);
        let balance = income - expense;
        ctx.dispatch({type:"UPDATE_BALANCE", payload: {income,expense,balance}});
    }

    useEffect(()=>{
        importData.forEach(async(item)=>{
            try {
                const ref = await addDoc(collection(db, `users/${user.uid}/transactions`), item);
                console.log("Added Transaction ID:", ref.id);
            } catch (error) {
                console.error("Error adding transaction from CSV:", error);
            }
        });
        if(importData.length > 0) {
            fetchTransaction();
            toast.success("Successfully Imported")
        }
        
    },[importData])

    useEffect(()=>{
        fetchTransaction();
    },[user?.uid])

    useEffect(() => {
        if(transactionData.length > 0) {
            calculations();
            ctx.dispatch({type: "SET_TRANSACTIONS", payload: transactionData}); 
        }
    }, [transactionData]);
    return (
        <div  style={{display: ctx.state.modalVisibility}} className="modal">
            <div className="modal-wrap">
                <div className="modal-head">
                    <h3>{ctx.state?.optionList[0]=="Salary"?"Add Income":"Add Expense"}</h3>
                    <button onClick={hideModal}>X</button>
                </div>
            
                <div className="modal-form">
                    <div className="modal-field">
                        <p>Name</p>
                        <input onChange={(e)=> handleTransaction(e,'name')} type="text" placeholder="Enter Name" required/>
                    </div>
                    <div className="modal-field">
                        <p>Amount</p>
                        <input onChange={(e)=> handleTransaction(e,'amount')} type="number" placeholder="Enter Amount" required/>
                    </div>
                    <div className="modal-field">
                        <p>Date</p>
                        <input onChange={(e)=> handleTransaction(e,'date')} type="date" placeholder="Enter Date" required/>
                    </div>
                    <div className="modal-field">
                        <p>Tag</p>
                        <select value={transaction.tag} onChange={(e)=> handleTransaction(e,'tag')} name="" id="" required>
                            <option value="">Select Tag</option>
                            { ctx.state?.optionList.map((val,idx)=>{
                                return <option key={idx} value={val}>{val}</option>
                            })}
                        </select>
                    </div>
                    <button onClick={addTransaction} className="form-btns loginbtn">{ctx.state?.optionList[0]=="Salary"?"Add Income":"Add Expense"}</button>
                </div>
            </div>
        </div>
    )
}

export default Modal;