export default function Share(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v.01M12 20v.01M20 12v.01M12 4v.01M6.34 6.34l.01.01M17.66 17.66l.01.01M17.66 6.34l.01.01M6.34 17.66l.01.01" />
    </svg>
  );
}
