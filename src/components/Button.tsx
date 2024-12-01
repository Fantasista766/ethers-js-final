type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

const Button = ({ children, onClick, isLoading, disabled }: ButtonProps) => (
  <button
    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${
      isLoading ? "cursor-wait" : ""
    }`}
    onClick={onClick}
    disabled={disabled || isLoading}
  >
    {isLoading ? "Загрузка..." : children}
  </button>
);

export default Button;
