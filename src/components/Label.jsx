export const Label = ({ children, className, ...props }) => (
  <label className={"block text-gray-700 text-sm font-bold mt-4 mb-2 " +
    className} {...props}>
    {children}
  </label>
);
