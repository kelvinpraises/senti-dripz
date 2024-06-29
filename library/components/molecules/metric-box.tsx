export interface Metric {
  title: string;
  value: string;
}

const MetricBox = ({ title, value }: Metric) => (
  <div className="bg-white p-4 border border-gray-200 flex-1 min-w-0">
    <h2 className="text-xs font-semibold text-gray-600 mb-1">{title}</h2>
    <p className="text-lg font-bold truncate">{value}</p>
  </div>
);

export default MetricBox;
