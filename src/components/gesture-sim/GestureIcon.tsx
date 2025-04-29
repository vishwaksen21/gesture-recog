
import type React from 'react';
import type { Gesture } from '@/types/simulation'; // Import Gesture type

interface GestureIconProps extends React.SVGProps<SVGSVGElement> {
  gesture: Gesture;
}

const strokeWidth = "2.2"; // Slightly thicker stroke

// Basic SVG arrow icons with adjusted stroke width
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  ),
};

export const GestureIcon: React.FC<GestureIconProps> = ({ gesture, className = 'w-6 h-6', ...props }) => {
  const IconComponent = icons[gesture] || icons['unknown'];
  return <IconComponent className={className} {...props} />;
};
