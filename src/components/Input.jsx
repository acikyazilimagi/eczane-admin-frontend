export const Input = ({ className, ...props }) => (
  <input
    className={"shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " + className}
    {...props}/>
);
