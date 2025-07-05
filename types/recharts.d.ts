declare module 'recharts' {
  import { ComponentType, ReactNode } from 'react';

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children?: ReactNode;
  }

  export interface BarChartProps {
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      left?: number;
      bottom?: number;
    };
    children?: ReactNode;
  }

  export interface PieChartProps {
    children?: ReactNode;
  }

  export interface PieProps {
    data?: any[];
    cx?: string | number;
    cy?: string | number;
    innerRadius?: number;
    outerRadius?: number;
    paddingAngle?: number;
    dataKey?: string;
    children?: ReactNode;
  }

  export interface BarProps {
    dataKey?: string;
    fill?: string;
    radius?: number[];
    name?: string;
    children?: ReactNode;
  }

  export interface CellProps {
    key?: string;
    fill?: string;
  }

  export interface CartesianGridProps {
    strokeDasharray?: string;
    stroke?: string;
  }

  export interface XAxisProps {
    dataKey?: string;
    tick?: any;
    axisLine?: any;
    angle?: number;
    textAnchor?: string;
    height?: number;
    tickFormatter?: (value: any) => string;
  }

  export interface YAxisProps {
    tick?: any;
    axisLine?: any;
    tickFormatter?: (value: any) => string;
  }

  export interface TooltipProps {
    content?: ComponentType<any>;
    contentStyle?: any;
    formatter?: (value: any, name: string) => [string, string];
  }

  export interface LegendProps {
    content?: ComponentType<any>;
  }

  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps>;
  export const BarChart: ComponentType<BarChartProps>;
  export const PieChart: ComponentType<PieChartProps>;
  export const Pie: ComponentType<PieProps>;
  export const Bar: ComponentType<BarProps>;
  export const Cell: ComponentType<CellProps>;
  export const CartesianGrid: ComponentType<CartesianGridProps>;
  export const XAxis: ComponentType<XAxisProps>;
  export const YAxis: ComponentType<YAxisProps>;
  export const Tooltip: ComponentType<TooltipProps>;
  export const Legend: ComponentType<LegendProps>;
}
