import type { SVGProps } from "react";

export type IconName =
  | "check-circle" | "layers" | "help-circle" | "clock" | "x-octagon" | "copy" | "check" | "search" | "menu" | "x"
  | "chevron-down" | "chevron-up" | "chevron-left" | "chevron-right" | "arrow-up" | "arrow-down" | "columns" | "download"
  | "command" | "info" | "alert-triangle" | "trend-up" | "trend-down" | "minus" | "inbox" | "chevrons-up-down";

const PATHS: Record<IconName, string> = {
  "check-circle": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-4-9 3 3 5-6",
  layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5",
  "help-circle": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.5-11a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8M12 17h.01",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2",
  "x-octagon": "M8 3h8l5 5v8l-5 5H8l-5-5V8l5-5Zm1 6 6 6m0-6-6 6",
  copy: "M9 9h11v11H9V9Zm-5 6V4h11",
  check: "m5 12 5 5 9-10",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 5 5",
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "m6 6 12 12M18 6 6 18",
  "chevron-down": "m6 9 6 6 6-6",
  "chevron-up": "m6 15 6-6 6 6",
  "chevron-left": "m15 6-6 6 6 6",
  "chevron-right": "m9 6 6 6-6 6",
  "arrow-up": "M12 19V5m-6 6 6-6 6 6",
  "arrow-down": "M12 5v14m-6-6 6 6 6-6",
  columns: "M4 5h16v14H4V5Zm5 0v14m6-14v14",
  download: "M12 4v11m-5-5 5 5 5-5M5 20h14",
  command: "M9 9V6a3 3 0 1 0-3 3h3Zm0 0h6m-6 0v6m6-6V6a3 3 0 1 1 3 3h-3Zm0 0v6m0 0h3a3 3 0 1 1-3 3v-3Zm0 0H9m0 0v3a3 3 0 1 1-3-3h3Z",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9h.01",
  "alert-triangle": "M12 4 2.5 20h19L12 4Zm0 6v4m0 3h.01",
  "trend-up": "m3 17 6-6 4 4 8-8m0 0h-5m5 0v5",
  "trend-down": "m3 7 6 6 4-4 8 8m0 0h-5m5 0v-5",
  minus: "M5 12h14",
  inbox: "M3 13h5l1 3h6l1-3h5M5 5h14l2 8v6H3v-6l2-8Z",
  "chevrons-up-down": "m8 9 4-4 4 4m0 6-4 4-4-4",
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  /** Provide a label only when the icon stands alone. Otherwise it is hidden from assistive tech. */
  label?: string;
}

export function Icon({ name, size = 16, label, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
