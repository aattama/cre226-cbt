import {useState,useEffect} from 'react'
import RAW from './questions'
const sh=a=>[...a].sort(()=>Math.random()-.5)
const prep=n=>sh(RAW).slice(0,n).map(([q,...r])=>{const a=r.pop(),c=r[a],o=sh(r);return{q,o,a:o.indexOf(c)}})
const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
export default function App(){
  const [qs,setQs]=useState(null),[i,setI]=useState(0),[ans,setAns]=useState({}),[done,setDone]=useState(false),[t,setT]=useState(0),[n,setN]=useState(30)
  useEffect(()=>{if(!qs||done)return
    if(t<=0){setDone(true);return}
    const id=setTimeout(()=>setT(t-1),1000);return()=>clearTimeout(id)},[qs,done,t])
  const start=()=>{const p=prep(n);setQs(p);setI(0);setAns({});setDone(false);setT(p.length*45)}
  if(!qs)return(<div className="card"><h1>CRE 226 CBT Practice</h1>
    <p>Computer &amp; Robotics Graphics. {RAW.length} questions in the bank. Questions and options are shuffled every attempt.</p>
    <p>Number of questions: <select value={n} onChange={e=>setN(+e.target.value)}>
      {[10,20,30,50,RAW.length].filter((v,k,a)=>a.indexOf(v)===k).map(v=><option key={v} value={v}>{v===RAW.length?`All (${v})`:v}</option>)}</select></p>
    <button className="btn" onClick={start}>Start Test</button></div>)
  const score=qs.filter((q,k)=>ans[k]===q.a).length
  if(done)return(<div className="card"><h1>Result</h1>
    <h2>{score} / {qs.length} ({Math.round(score/qs.length*100)}%)</h2>
    {qs.map((q,k)=><div key={k} style={{margin:'16px 0'}}><b>{k+1}. {q.q}</b>
      {q.o.map((o,j)=><div key={j} className={'opt '+(j===q.a?'ok':ans[k]===j?'bad':'')}>{o}</div>)}
      {ans[k]===undefined&&<i>Not answered</i>}</div>)}
    <button className="btn" onClick={()=>setQs(null)}>Back to Start</button></div>)
  const q=qs[i]
  return(<div className="card">
    <div className="bar"><span>Question {i+1}/{qs.length}</span><span>⏱ {fmt(t)}</span></div>
    <h3>{q.q}</h3>
    {q.o.map((o,j)=><button key={j} className={'opt '+(ans[i]===j?'sel':'')} onClick={()=>setAns({...ans,[i]:j})}>{String.fromCharCode(65+j)}. {o}</button>)}
    <div><button className="btn g" disabled={i===0} onClick={()=>setI(i-1)}>Prev</button>
      {i<qs.length-1?<button className="btn" onClick={()=>setI(i+1)}>Next</button>
        :<button className="btn r" onClick={()=>window.confirm('Submit test?')&&setDone(true)}>Submit</button>}</div>
    <div className="nav">{qs.map((_,k)=><button key={k} className={(ans[k]!==undefined?'a ':'')+(k===i?'c':'')} onClick={()=>setI(k)}>{k+1}</button>)}</div>
    <button className="btn r" onClick={()=>window.confirm(`Answered ${Object.keys(ans).length}/${qs.length}. Submit?`)&&setDone(true)}>Submit Now</button>
  </div>)
}
