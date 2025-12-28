declare module "react-native-svg" {
  import * as React from "react";
  import { ViewProps } from "react-native";

  export interface SvgProps extends ViewProps {
    width?: number | string;
    height?: number | string;
    children?: React.ReactNode;
  }

  export interface CircleProps {
    cx?: number | string;
    cy?: number | string;
    r?: number | string;
    stroke?: string;
    strokeWidth?: number | string;
    strokeDasharray?: string | number[];
    strokeDashoffset?: number;
    strokeLinecap?: "butt" | "round" | "square";
    fill?: string;
  }

  export const Circle: React.ComponentType<CircleProps>;
  const SvgComponent: React.ComponentType<SvgProps>;
  export default SvgComponent;
}
