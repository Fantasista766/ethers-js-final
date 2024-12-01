type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void; // Сделаем необязательным, так как у кнопок с `type="submit"` может не быть обработчика
  isLoading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // Добавляем поддержку атрибута type
};

const Button = ({
  children,
  onClick,
  isLoading,
  disabled,
  type = "button",
}: ButtonProps) => (
  <button
    type={type} // Передаем тип кнопки
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
