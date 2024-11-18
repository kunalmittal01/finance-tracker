import { useContext, useState } from "react";
import { context } from "../../App";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase.config";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

const Table = ({query})=>{
    const ctx = useContext(context);
    const [user] = useAuthState(auth);

    const deleteTx = async(txId)=>{
        try {
            const docRef = doc(db, `users/${user.uid}/transactions`, txId);
            await deleteDoc(docRef);
            const res = collection(db, `users/${user?.uid}/transactions`)
            const docsData = await getDocs(res);
            ctx.dispatch({type: "UPDATE_TRANSACTION", payload: txId})
            toast.success("Deleted Successfully")
        }
        
        catch (e) {
            console.log(e);
            toast.error("failed to delete")
        }
    }
    const showData = ()=>{
        const data = ctx.state?.transactions.filter((item)=>{
            if(query.dropdown=='all') {
                return item.name.toLowerCase().includes(query.input?.toLowerCase())
            }
            return item.name.toLowerCase().includes(query.input?.toLowerCase()) && item.type.toLowerCase().includes(query.dropdown?.toLowerCase())
        }).map((item, idx) => (
            <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.amount}</td>
                <td>{item.tag}</td>
                <td>{item.date}</td>
                <td>{item.type}</td>
                <td className="delbtn"><button onClick={()=>deleteTx(item.id)}>Delete</button></td>
            </tr>
        ))
        return data;
    }
    return (
        <>
        {ctx.state?.transactions.length !=0?
            <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>tag</th>
                    <th>date</th>
                    <th>type</th>
               </tr>
            </thead>   
               <tbody>
                {
                    showData().length !=0?showData():<div className="empty">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8x0dBHazn5dkcBb5QJqdC-dI7wQFZs2V1Aw&s" alt="" />
                        <p>No Data Available</p>
                    </div>
                }
               </tbody>
        </table>:
        <div className="empty">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8x0dBHazn5dkcBb5QJqdC-dI7wQFZs2V1Aw&s" alt="" />
            <p>No Data Available</p>
        </div>
        }
        </>
    )
}

export default Table;