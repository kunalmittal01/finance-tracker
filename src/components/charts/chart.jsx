import { Line, Pie } from '@ant-design/charts';
import { useContext } from 'react';
import { context } from '../../App';

const Chart = ()=>{
  const ctx = useContext(context) 
  const d = ctx.state.transactions.sort((a,b)=>new Date(a.date)-new Date(b.date));
  const payload = d.map(item=>{
    return {
      date: item.date,
      amount: Number(item.amount)
    }
  })
  const data = payload
  const spendings = ctx.state.transactions.filter(tx=>tx.type == 'Expense').map(tx=>{
    let obj = {}
      if(!(obj.tag == tx.tag)) {
        obj.tag = tx.tag
        obj.amount = Number(tx.amount)
      }
      else {
        obj.tag = tx.tag
        obj[amount] += Number(tx.amount)
      }
      return obj
  })
  const finalSpendings = spendings.reduce((acc,cur)=>{
    if(!acc[cur.tag]) {
      acc[cur.tag] = Number(cur.amount)
    }
    else {
      acc[cur.tag] += Number(cur.amount)
    }
    return acc;
  },{});

  const config = {
    data,
    height: 400,
    xField: 'date',
    yField: 'amount',
    point: {
      size: 5,
      shape: 'diamond',
    },
    
  };
  console.log(spendings);
  
  const spendingConfig = {
    data: Object.entries(finalSpendings).map(item=>{
      return {
        tag: item[0],
        amount: item[1]
      }
    }),
    width: 400,
    autoFit: true,
    angleField: "amount",
    colorField: "tag",
    // radius: 0.8, // Adjust radius if needed
  }
  let chart;
  let pie;
  return (
    <div className="chart">
      <div className="line">
        <p>Financial Statistics</p>
        <Line {...config} onReady={(chartInstanse)=>(chart=chartInstanse)} />
      </div>
      <div className="pie">
        <p>Total Spendings</p>
        <Pie {...spendingConfig} onReady={(chartInstanse)=>(pie=chartInstanse)} />
      </div>     
    </div>
)

};

export default Chart;