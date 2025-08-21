export default function SubmitButton({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`py-4 cursor-pointer px-2 rounded-md hover:bg-blue-700 ${className}`}
    > 
      {children}
    </button>
  );
}
