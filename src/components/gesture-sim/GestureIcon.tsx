
import type React from 'react';
import type { Gesture } from '@/types/simulation'; // Import Gesture type

interface GestureIconProps extends React.SVGProps<SVGSVGElement> {
  gesture: Gesture;
}

const strokeWidth = "2.5"; // Made slightly thicker

// SVG icons with consistent styling
const icons: Record<Gesture, React.FC<React.SVGProps<SVGSVGElement>>> = {
  up: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  down: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  ),
  left: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  right: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  unknown: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Question Mark Icon */}
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17.01h.01" />
       <circle cx="12" cy="12" r="10" />
    </svg>
  ),
};

export const GestureIcon: React.FC<GestureIconProps> = ({ gesture, className = 'w-6 h-6', ...props }) => {
  const IconComponent = icons[gesture] || icons['unknown'];
  // Ensure default classes are applied if className is provided
  const finalClassName = `inline-block ${className}`;
  return <IconComponent className={finalClassName} {...props} />;
};

