import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";

interface Metric {
  title: string;
  value: string;
}

interface Asset {
  name: string;
  symbol: string;
  iconUrl: string;
  tvl: {
    amount: string;
    usdValue: string;
  };
  volume: {
    amount: string;
    usdValue: string;
  };
  swapFees: string;
}

interface MarketTableProps {
  metrics: Metric[];
  assets: Asset[];
}

const MetricBox: React.FC<Metric> = ({ title, value }) => (
  <div className="bg-white p-4 border border-gray-200 flex-1 min-w-0">
    <h2 className="text-xs font-semibold text-gray-600 mb-1">{title}</h2>
    <p className="text-lg font-bold truncate">{value}</p>
  </div>
);

const MarketTable: React.FC<MarketTableProps> = ({ metrics, assets }) => {
  return (
    <div>
      <div className="flex flex-nowrap overflow-x-auto">
        {metrics.map((metric, index) => (
          <MetricBox key={index} {...metric} />
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset name</TableHead>
            <TableHead>Total value locked (TVL)</TableHead>
            <TableHead>Trading volume (24h)</TableHead>
            <TableHead className="text-right">Swap fees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset, index) => (
            <TableRow key={index}>
              <TableCell className="px-2 flex items-center gap-1 flex-wrap">
                <img
                  src={asset.iconUrl}
                  className="w-8 h-8 max-w-8"
                  alt={asset.name}
                />
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-xs font-medium text-zinc-400">
                    {asset.symbol}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{asset.tvl.amount}</p>
                  <p className="text-xs font-medium text-zinc-400">
                    {asset.tvl.usdValue}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{asset.volume.amount}</p>
                  <p className="text-xs font-medium text-zinc-400">
                    {asset.volume.usdValue}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right">{asset.swapFees}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MarketTable;
