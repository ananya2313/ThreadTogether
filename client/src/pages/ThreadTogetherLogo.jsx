import PropTypes from "prop-types";

export default function ThreadTogetherLogo({ size = 36, color = "#C8A2C8" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        d="M8 28c0-10.493 9.402-19 21-19s21 8.507 21 19-9.402 19-21 19c-2.88 0-5.63-.5-8.14-1.42L9.5 48.5l2.43-7.02C9.92 38.62 8 33.52 8 28Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="29" cy="28" r="12" fill="url(#tg)" stroke={color} strokeWidth="2" />
      <path d="M18.5 25c4-2.5 8.5-3.5 13-3" stroke="#6F44B5" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M18 29.5c4.8-.7 9.7.2 14.3 2.7" stroke="#6F44B5" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M22 20.8c3.3 2.1 6 5.3 7.7 9.2" stroke="#6F44B5" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M41 36c4.2 2.2 8.4 4.7 8.4 7.6 0 2-1.7 3.2-3.7 3.2-2.6 0-4.2-1.7-4.2-3.6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="tg" x1="17" y1="16" x2="41" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C8A2C8" />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ✅ PropTypes validation
ThreadTogetherLogo.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
