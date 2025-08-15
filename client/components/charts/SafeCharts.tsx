import React from 'react';
import { 
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  ResponsiveContainer as RechartsResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell as RechartsCell
} from "recharts";

// Global warning suppression - more targeted approach
React.useLayoutEffect = React.useLayoutEffect || React.useEffect;

// Suppress only the specific defaultProps warnings
const originalError = console.error;
const originalWarn = console.warn;

const suppressSpecificWarnings = () => {
  console.warn = (message, ...args) => {
    if (typeof message === 'string' && 
        (message.includes('defaultProps will be removed') || 
         message.includes('Support for defaultProps'))) {
      return;
    }
    originalWarn(message, ...args);
  };
  
  console.error = (message, ...args) => {
    if (typeof message === 'string' && 
        (message.includes('defaultProps will be removed') || 
         message.includes('Support for defaultProps'))) {
      return;
    }
    originalError(message, ...args);
  };
};

// Apply suppression globally for Recharts
suppressSpecificWarnings();

// Export Recharts components directly with proper defaults
export const LineChart = RechartsLineChart;
export const Line = RechartsLine;

// Axis components with proper defaults but maintaining Recharts structure
export const XAxis = React.forwardRef<any, any>(({ 
  stroke = "hsl(var(--muted-foreground))",
  fontSize = 12,
  ...props 
}, ref) => (
  <RechartsXAxis 
    ref={ref}
    stroke={stroke} 
    fontSize={fontSize} 
    {...props} 
  />
));

export const YAxis = React.forwardRef<any, any>(({ 
  stroke = "hsl(var(--muted-foreground))",
  fontSize = 12,
  ...props 
}, ref) => (
  <RechartsYAxis 
    ref={ref}
    stroke={stroke} 
    fontSize={fontSize} 
    {...props} 
  />
));

export const CartesianGrid = React.forwardRef<any, any>(({ 
  strokeDasharray = "3 3",
  stroke = "hsl(var(--border))",
  ...props 
}, ref) => (
  <RechartsCartesianGrid 
    ref={ref}
    strokeDasharray={strokeDasharray} 
    stroke={stroke} 
    {...props} 
  />
));

export const ResponsiveContainer = RechartsResponsiveContainer;
export const PieChart = RechartsPieChart;
export const Pie = RechartsPie;
export const Cell = RechartsCell;

// Set display names for better debugging
XAxis.displayName = 'XAxis';
YAxis.displayName = 'YAxis';
CartesianGrid.displayName = 'CartesianGrid';
