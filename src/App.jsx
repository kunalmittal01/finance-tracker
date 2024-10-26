import { useReducer, useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import './App.css'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Header from './components/header/Header'
import { ToastContainer} from 'react-toastify'
import { createContext } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { db } from './firebase.config'
import { collection, deleteDoc, getDocs } from 'firebase/firestore'

export const context = createContext();
function App() {
  const reducerFn = (state, action) => {
    switch (action.type) {
      case "SET_OPTIONS":
        return {...state,modalVisibility: "flex",optionList: state[action.payload].options }
      
      case "HIDE_MODAL":
        return {...state, modalVisibility: "none" }

      case "UPDATE_BALANCE":
        return {...state, currentBalance: action.payload.balance, totalIncome: action.payload.income, totalExpense: action.payload.expense }

      case "SET_TRANSACTIONS":
        return {...state, transactions: [...action.payload], copyTransactions: [...action.payload] }
      
      case "SORT_BY_AMOUNT":
        const trans = state.transactions;
        trans.sort((a, b) => Number(a.amount) - Number(b.amount));
        return {...state, transactions: trans, active: {date: false, amt: true, nosort: false}}

      case "SORT_BY_DATE":
        const t = state.transactions;
        t.sort((a, b) => new Date(a.date) - new Date(b.date));
        return {...state, transactions: t, active: {date: true, amt: false, nosort: false}}

      case "RESET_BALANCE":
        async function reset(){
          try {
              const ref = collection(db, `users/${action.payload}/transactions`)
              const snap = await getDocs(ref);
              const deleteAll = snap.docs.map(doc => deleteDoc(doc.ref))
              await Promise.all(deleteAll)
          }
          catch (error){
            console.error(error);
          }
      }
      reset()
      return {...state, transactions: [], copyTransactions: [], totalIncome: 0, totalExpense: 0,currentBalance: 0}
      case "NO_SORT": 
        return {...state, transactions: [...state.copyTransactions], active: {date: false, amt: false, nosort: true}}
      
      case "UPDATE_TRANSACTION":
        const updatedTransactions = state.transactions.filter(item=>item.id != action.payload);
        const item = state.transactions.filter(item=>item.id == action.payload);
        if(item.type == 'Expense') {
          return {...state, transactions: updatedTransactions, currentBalance: state.currentBalance+Number(item.amount), totalExpense: state.totalExpense-Number(item.amount)}  
        }
        else if(item.type == 'Income') {
          return {...state, transactions: updatedTransactions, currentBalance: state.currentBalance-Number(item.amount), totalIncome: state.totalIncome-Number(item.amount)}
        }
        if(updatedTransactions.length == 0) {
          return {...state, transactions: updatedTransactions, currentBalance: 0, totalIncome: 0, totalExpense: 0}  
        }
        return {...state, transactions: updatedTransactions}  

      default:
        return {...state}
    }
  }

  const [state, dispatch] = useReducer(reducerFn, {
    income: {
      options:['Salary','Freelance','Investment'],
    },
    expenses: {
      options:['Food','Education','Office'],
    },
    modalVisibility: "none",
    currentBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    optionList: [],
    transactions: [],
    copyTransactions: [],
    active: {
      amt: false,
      date: false,
      nosort: true
    }
    }
  )
  return (
    <>
      <ToastContainer />
      <Router>
        <Header />
        <context.Provider value={{ state, dispatch }}>
        <Routes>
          <Route exact path="/" element={<Signup />} />
          <Route exact path="/home" element={<Dashboard />} />
        </Routes>
        </context.Provider>
      </Router>
    </>
  )
}

export default App
