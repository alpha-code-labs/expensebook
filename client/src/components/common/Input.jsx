export default function Input({ type, name, placeholder, value, onChange, defaultValue }) {
  const inputValue = value === undefined ? defaultValue : value;

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={inputValue}
      onChange={onChange}
      className="placeholder:text-[#9A9A9A] w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-black outline-none focus:border-[#6A64F1] focus:shadow-md"
    />
  );
}






