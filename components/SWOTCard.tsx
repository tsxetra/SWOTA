import React from 'react';

interface SWOTCardProps {
  title: string;
  points: string[];
  icon: React.ReactNode;
  color: 'green' | 'red' | 'blue' | 'yellow';
}

const colorMap = {
  green: {
    border: 'border-t-emerald-500',
    iconBg: 'bg-emerald-100',
    text: 'text-emerald-700',
    icon: 'text-emerald-600',
  },
  red: {
    border: 'border-t-rose-500',
    iconBg: 'bg-rose-100',
    text: 'text-rose-700',
    icon: 'text-rose-600',
  },
  blue: {
    border: 'border-t-sky-500',
    iconBg: 'bg-sky-100',
    text: 'text-sky-700',
    icon: 'text-sky-600',
  },
  yellow: {
    border: 'border-t-amber-500',
    iconBg: 'bg-amber-100',
    text: 'text-amber-700',
    icon: 'text-amber-600',
  },
};

const SWOTCard: React.FC<SWOTCardProps> = ({ title, points, icon, color }) => {
  const styles = colorMap[color];

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border-t-4 ${styles.border}`}>
      <div className={`flex items-center mb-4`}>
        <div className={`p-2 rounded-lg mr-4 ${styles.iconBg}`}>
          {React.cloneElement(icon as React.ReactElement, { className: `h-6 w-6 ${styles.icon}` })}
        </div>
        <h3 className={`text-xl font-bold font-serif ${styles.text}`}>{title}</h3>
      </div>
      <ul className="space-y-3 text-gray-600">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SWOTCard;