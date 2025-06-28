declare module "recharts" {
  import * as React from "react";

  type NumberOrString = number | string;

  export class ResponsiveContainer extends React.Component<{
    width?: NumberOrString;
    height?: number;
    aspect?: number;
    children?: React.ReactNode;
  }> {}

  export class LineChart extends React.Component<{
    data: any[];
    width?: number;
    height?: number;
    margin?: object;
    children?: React.ReactNode;
  }> {}

  export class Line extends React.Component<{
    type?: string;
    dataKey: string;
    stroke?: string;
    strokeWidth?: number;
    dot?: boolean;
  }> {}

  export class CartesianGrid extends React.Component<{
    stroke?: string;
  }> {}

  export class XAxis extends React.Component<{
    dataKey: string;
    stroke?: string;
  }> {}

  export class YAxis extends React.Component<{
    stroke?: string;
  }> {}

  export class Tooltip extends React.Component {}

  export class Legend extends React.Component {}

  export class BarChart extends React.Component<{
  data: any[];
  width?: number;
  height?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  barCategoryGap?: number | string;
  children?: React.ReactNode;
}> {}


  export class Bar extends React.Component<{
    dataKey: string;
    fill?: string;
    stackId?: string;
  }> {}

  export class PieChart extends React.Component<{
    width?: number;
    height?: number;
    children?: React.ReactNode;
  }> {}

  export class Pie extends React.Component<{
    data: any[];
    dataKey: string;
    nameKey?: string;
    cx?: number | string;
    cy?: number | string;
    outerRadius?: number;
    label?: boolean;
    children?: React.ReactNode;
  }> {}

  export class Cell extends React.Component<{
    fill?: string;
  }> {}

  export class AreaChart extends React.Component<{
    data: any[];
    width?: number;
    height?: number;
    children?: React.ReactNode;
  }> {}

  export class Area extends React.Component<{
    dataKey: string;
    type?: string;
    stroke?: string;
    fill?: string;
  }> {}
}
