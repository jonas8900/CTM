export default function MainButton({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`w-40 cursor-pointer h-30 rounded-md hover:bg-blue-700 ${className}`}
    > 
      {children}
    </button>
  );
}
