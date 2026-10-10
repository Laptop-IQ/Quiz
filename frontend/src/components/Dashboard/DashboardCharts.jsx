import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { BarChart3, Target } from "lucide-react";

// Split out of the Dashboard page so the heavy chart library loads AFTER the stats are on screen.
const DashboardCharts = ({ trend, byTech }) => (
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="dashboard-card"><div className="mb-4 flex items-center gap-3"><span className="icon-chip"><BarChart3 size={17}/></span><div><h3 className="section-title">Score trend</h3><p className="section-sub">Your progress across attempts</p></div></div><ResponsiveContainer width="100%" height={250}><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff10"/><XAxis dataKey="name" tick={{fontSize:12,fill:'#94a3b8'}}/><YAxis domain={[0,100]} tick={{fontSize:12,fill:'#94a3b8'}} tickFormatter={v=>`${v}%`}/><Tooltip contentStyle={{background:'#0f172a',border:'1px solid #ffffff18',borderRadius:12,color:'#fff'}} formatter={v=>`${v}%`}/><Line type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={3} dot={{r:3,fill:'#22d3ee'}}/></LineChart></ResponsiveContainer></div>
        <div className="dashboard-card"><div className="mb-4 flex items-center gap-3"><span className="icon-chip"><Target size={17}/></span><div><h3 className="section-title">Accuracy by technology</h3><p className="section-sub">Where you perform best</p></div></div><ResponsiveContainer width="100%" height={250}><BarChart data={byTech}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff10"/><XAxis dataKey="name" tick={{fontSize:12,fill:'#94a3b8'}}/><YAxis domain={[0,100]} tick={{fontSize:12,fill:'#94a3b8'}} tickFormatter={v=>`${v}%`}/><Tooltip contentStyle={{background:'#0f172a',border:'1px solid #ffffff18',borderRadius:12,color:'#fff'}} formatter={v=>`${v}%`}/><Bar dataKey="accuracy" fill="#3b82f6" radius={[7,7,0,0]}/></BarChart></ResponsiveContainer></div>
      </div>
);

export default DashboardCharts;
