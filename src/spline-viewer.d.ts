import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": {
        url: string;
        loading?: "lazy" | "eager";
        className?: string;
      };
    }
  }
}