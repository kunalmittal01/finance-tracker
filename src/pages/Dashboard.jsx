import { useContext, useState } from "react";
import Card from "../components/card/cards";
import Modal from "../components/modal/Modal";
import Table from "../components/table/Table";
import { context } from "../App";
import { parse, unparse } from "papaparse";
import Chart from "../components/charts/chart";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase.config";
import { collection } from "firebase/firestore";
import { toast } from "react-toastify";
const Dashboard = ()=>{
    const [user, loading] = useAuthState(auth);
    const [importData, setImportData] = useState([]);
    const [query, setQuery] = useState({
        input: "",
        dropdown: "",
    });
    const ctx = useContext(context)
    const handleQuery = (e,key)=>{
        setQuery({...query, [key]: e.target.value})
    }

    const exportCSV = ()=>{
        var csv = unparse({
            "fields": ["name", "amount", "tag", "date", "type"],
            "data": ctx.state.transactions
        });
        const blob = new Blob([csv],{type: "text/csv;charset=utf-8;"})
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "transactions.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const importCSV = (e)=>{
        e.preventDefault();
        const file = e.target.files[0];
        if(!file) return;
        try {
            parse(file , {
                header: true,
                complete: async(results) => {
                    console.log(results.data);
                    const validData = results.data.filter(item=>
                        item.name &&
                        item.amount &&
                        item.date &&
                        item.tag &&
                        item.type)
                        if(validData.length == 0) {
                            toast.error("No valid data found in CSV.");
                            return;
                        }
                    setImportData(validData)
                }
            })
        }
        catch(error){
            console.log(error);
        }
        finally {
            e.target.files= null;
        }
    }

    return (
        <>
        {
            loading?<p className="loader"><img src="https://www.appcoda.com/content/images/wordpress/2020/08/swiftui-animation-5.gif" alt="" /></p>:
            <div className="dashboard">
                <div className="cards-cont">
                    <Card title="Current Balance" btn="Reset Balance" op="currentBalance"/>
                    <Card title="Total Income" btn="Add Income" op="income"/>
                    <Card title="Total Expenses" btn="Add Expense" op="expenses"/>
                </div>
                <Modal importData={importData} />
                <>
                {
                    ctx.state.transactions.length!=0? <Chart />
                :
                <div className="no-trans">
                    <img src="https://cdn.vectorstock.com/i/500p/83/82/no-data-found-concept-for-websites-landing-pages-vector-48108382.jpg" alt="" />
                    <p>You Have No Transactions Currently.</p>
                </div>
                }
                </>
                <div className="table-wrap">
                    <div className="table-opt">
                        <input onChange={(e)=>handleQuery(e,'input')} type="text" placeholder="Search By Name.."/>
                        <select onChange={(e)=>handleQuery(e,'dropdown')} value={query.dropdown} name="" id="">
                            <option value="all">All</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                    </div>
                    <div className="table-data">
                        <div className="table-fn">
                            <p>My Transactions</p>
                            <div className="sort-btns">
                                <button className={ctx.state.active.nosort?"active":""} onClick={()=> ctx.dispatch({type: "NO_SORT"})}>No Sort</button>
                                <button className={ctx.state.active.amt?"active":""} onClick={()=>ctx.dispatch({type: "SORT_BY_AMOUNT"})}>Sort By Amount</button>
                                <button className={ctx.state.active.date?"active":""} onClick={()=>ctx.dispatch({type: "SORT_BY_DATE"})}>Sort By Date</button>
                            </div>
                            <div className="csv-btns">
                                <button onClick={exportCSV} className="form-btns signupbtn">Export to CSV</button>
                                <label htmlFor="csv-file" className="form-btns loginbtn">Import from CSV</label>
                                <input onChange={importCSV} id="csv-file" type="file" accept=".csv" />
                            </div>
                        </div>
                            <Table query={query} /> 
                    </div>
                </div>
            </div>
        }
            
        </>
        
    )
}

export default Dashboard;