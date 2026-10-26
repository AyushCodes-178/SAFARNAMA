import React from 'react';
import {
  IndianRupee,
  PieChart as PieIcon,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PIE_COLORS = ['#1E88E5', '#4CAF50', '#64B5F6', '#2E7D32', '#64748b'];

export default function BudgetView({ activeTrip, onOpenBookings }) {
  if (!activeTrip || !activeTrip.budget) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-xl mx-auto space-y-3">
        <IndianRupee className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800">No Budget Data Available</h3>
        <p className="text-xs text-slate-500">
          Create or open a trip itinerary to view real-time expense calculations and charts.
        </p>
      </div>
    );
  }

  const { budget, destination, travellers, durationDays, itineraryDays, startingCity } = activeTrip;
  const { categories, totalEstimatedCost, costPerPerson, totalAllocatedBudget, remainingBudget, isOverBudget, costSavingTips } = budget;

  // Prepare data for Recharts Pie Chart
  const pieData = [
    { name: 'Transport', value: categories.transport.amount, color: '#1E88E5' },
    { name: 'Accommodation', value: categories.accommodation.amount, color: '#4CAF50' },
    { name: 'Food & Meals', value: categories.food.amount, color: '#10b981' },
    { name: 'Entry Fees & Sights', value: categories.activities.amount, color: '#8b5cf6' },
    { name: 'Buffer & Misc', value: categories.miscellaneous.amount, color: '#64748b' }
  ].filter((item) => item.value > 0);

  // Prepare data for Daily Spending Bar Chart
  const dailyStay = Math.round(categories.accommodation.amount / Math.max(1, durationDays));
  const dailyFood = Math.round(categories.food.amount / Math.max(1, durationDays));
  const dailyLocalTransit = Math.round((categories.transport.amount * 0.35) / Math.max(1, durationDays));

  const dailyBarData = (itineraryDays || []).map((day, idx) => {
    const dayActivitiesCost = (day.activities || []).reduce(
      (sum, act) => sum + (Number(act.cost) || 0) * travellers,
      0
    );

    const intercityPortion =
      idx === 0 || idx === itineraryDays.length - 1
        ? Math.round((categories.transport.amount * 0.65) / 2)
        : 0;

    return {
      day: `Day ${day.dayNumber}`,
      Stay: dailyStay,
      Food: dailyFood,
      Activities: dayActivitiesCost,
      Transit: dailyLocalTransit + intercityPortion,
      Total: dailyStay + dailyFood + dayActivitiesCost + dailyLocalTransit + intercityPortion
    };
  });

  const budgetUsagePercent = Math.min(
    100,
    Math.round((totalEstimatedCost / Math.max(1, totalAllocatedBudget)) * 100)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            <IndianRupee className="w-4 h-4" />
            <span>Financial Estimator & Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trip Budget Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {activeTrip.title || destination?.name} • {durationDays} Days • {travellers} Traveller(s)
          </p>
        </div>

        <button
          onClick={onOpenBookings}
          className="px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Compare Booking Fares</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Over-Budget Alert Banner if applicable */}
      {isOverBudget ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-rose-900 text-sm">
              Estimated Expenses Exceed Allocated Budget by ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}!
            </h4>
            <p className="text-xs text-rose-800 leading-relaxed">
              Your estimated trip total (₹{totalEstimatedCost.toLocaleString('en-IN')}) is higher than your combined budget of ₹{totalAllocatedBudget.toLocaleString('en-IN')}. Review the smart money-saving recommendations below to balance the costs.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-900 text-xs sm:text-sm">
                Budget on Track: ₹{remainingBudget.toLocaleString('en-IN')} Remaining Surplus
              </h4>
              <p className="text-[11px] text-emerald-700">
                You have allocated ₹{totalAllocatedBudget.toLocaleString('en-IN')} with ₹{costPerPerson.toLocaleString('en-IN')} projected per person.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-200/60 text-emerald-900 font-bold text-xs">
            {100 - budgetUsagePercent}% Buffer
          </span>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Allocated */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Allocated Budget
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            ₹{totalAllocatedBudget.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            ₹{(totalAllocatedBudget / travellers).toLocaleString('en-IN')} / person
          </p>
        </div>

        {/* Estimated Cost */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Est. Total Cost
          </span>
          <div className="text-xl sm:text-2xl font-black text-sky-600 mt-1">
            ₹{totalEstimatedCost.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            For {travellers} people over {durationDays} days
          </p>
        </div>

        {/* Per Person */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Est. Cost Per Person
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            ₹{costPerPerson.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            ~₹{Math.round(costPerPerson / durationDays).toLocaleString('en-IN')} / person / day
          </p>
        </div>

        {/* Remaining Surplus or Deficit */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isOverBudget ? 'Budget Deficit' : 'Remaining Balance'}
          </span>
          <div
            className={`text-xl sm:text-2xl font-black mt-1 ${
              isOverBudget ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {isOverBudget ? `-₹${Math.abs(remainingBudget).toLocaleString('en-IN')}` : `₹${remainingBudget.toLocaleString('en-IN')}`}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isOverBudget ? 'Exceeds budget limit' : 'Safe reserve buffer'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-700">
          <span>Budget Utilization</span>
          <span className={isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-900'}>
            ₹{totalEstimatedCost.toLocaleString('en-IN')} / ₹{totalAllocatedBudget.toLocaleString('en-IN')} ({Math.round((totalEstimatedCost / totalAllocatedBudget) * 100)}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isOverBudget ? 'bg-rose-500' : budgetUsagePercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, (totalEstimatedCost / totalAllocatedBudget) * 100)}%` }}
          />
        </div>
      </div>

      {/* Visualizations Grid: Recharts Pie & Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: Category Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-sky-600" />
                  <span>Expense Category Breakdown</span>
                </h3>
                <p className="text-xs text-slate-500">Distribution across major travel pillars</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Estimated Amount']}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div>• Stay & Transit constitute the largest share in Indian road/rail circuits.</div>
            <div>• Entry fees are calculated directly from your selected itinerary attractions.</div>
          </div>
        </div>

        {/* Daily Spending Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Daily Estimated Spending</span>
                </h3>
                <p className="text-xs text-slate-500">Day-by-day cashflow requirements</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                    contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Stay" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="Food" stackId="a" fill="#10b981" />
                  <Bar dataKey="Transit" stackId="a" fill="#1E88E5" />
                  <Bar dataKey="Activities" stackId="a" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            Note: Day 1 and final day incorporate intercity bus/rail fares from {startingCity || 'Bengaluru'}.
          </p>
        </div>
      </div>

      {/* Itemized Categories Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Itemized Cost Assumptions</h3>
          <p className="text-xs text-slate-500">Transparent parameters used in calculation</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Estimation Details</th>
                <th className="py-3 px-4 font-bold text-right">Total (₹)</th>
                <th className="py-3 px-4 font-bold text-right">% of Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {Object.entries(categories).map(([key, cat]) => {
                const pct = Math.round((cat.amount / totalEstimatedCost) * 100) || 0;
                return (
                  <tr key={key} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{cat.name}</td>
                    <td className="py-3 px-4 text-slate-600">{cat.details}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 text-right">
                      ₹{cat.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-right font-medium">{pct}%</td>
                  </tr>
                );
              })}
              <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                <td className="py-3.5 px-4">Grand Total</td>
                <td className="py-3.5 px-4 text-slate-500 font-normal">
                  Comprehensive estimate ({travellers} travellers, {durationDays} days)
                </td>
                <td className="py-3.5 px-4 text-sky-600 text-right text-sm">
                  ₹{totalEstimatedCost.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Practical Cost Saving Suggestions */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <span>Practical Money-Saving Tips for {destination?.name || 'Your Trip'}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-amber-950">
          {(costSavingTips || []).map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-amber-100">
              <span className="font-bold text-amber-700 shrink-0">#{idx + 1}</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
