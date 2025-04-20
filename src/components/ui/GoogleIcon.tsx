
import * as React from "react";

// Minimal Google G icon SVG, best for button/icon use
const GoogleIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className = "", ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      width={24}
      height={24}
      className={className}
      {...props}
    >
      <g>
        <path
          fill="#4285F4"
          d="M21.805 12.227c0-.682-.061-1.364-.184-2.034H12v3.845h5.546a4.733 4.733 0 01-2.053 3.105v2.58h3.319c1.945-1.796 3.064-4.44 3.064-7.496z"
        />
        <path
          fill="#34A853"
          d="M12 22c2.784 0 5.122-.92 6.83-2.504l-3.32-2.579c-.92.619-2.092.982-3.51.982-2.682 0-4.955-1.813-5.765-4.257H2.808v2.671C4.508 19.81 7.058 22 12 22z"
        />
        <path
          fill="#FBBC05"
          d="M6.235 13.642a5.646 5.646 0 010-3.283V7.687H2.808a10.003 10.003 0 000 8.121l3.427-2.166z"
        />
        <path
          fill="#EA4335"
          d="M12 6.579c1.514 0 2.871.521 3.94 1.542l2.949-2.922C17.122 3.745 14.785 2.727 12 2.727c-4.941 0-7.492 2.19-9.192 4.96L6.234 9.983C7.045 7.54 9.318 6.579 12 6.579z"
        />
      </g>
    </svg>
  )
);

GoogleIcon.displayName = "GoogleIcon";
export { GoogleIcon };
