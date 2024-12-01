type InputFieldProps = {
  label: string;
  value: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number";
  disabled?: boolean;
};

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  disabled,
}: InputFieldProps) => (
  <div className="flex flex-col">
    <label className="text-gray-700 text-sm font-semibold mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="border border-gray-300 rounded px-2 py-1 text-gray-800 disabled:bg-gray-100"
    />
  </div>
);

export default InputField;
