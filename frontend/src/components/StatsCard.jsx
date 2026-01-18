import React from 'react';

const StatsCard = ({ title, value, subtext, type = "neutral" }) => {
    let colorClass = "text-white";
    if (type === "success") colorClass = "text-emerald-400";
    if (type === "danger") colorClass = "text-red-400";

    return (
        <div className="card p-4">
            <h4 className="text-slate-400 text-sm font-medium mb-1">{title}</h4>
            <div className={`text-2xl font-bold ${colorClass}`}>
                {value}
            </div>
            {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
        </div>
    );
};

export default StatsCard;
