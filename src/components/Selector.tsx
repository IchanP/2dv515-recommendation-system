const Selector = <T,>({
  setState,
  children,
}: {
  setState: (value: T) => void;
  children: React.ReactNode;
}) => {
  return (
    <>
      <select
        className="ml-2 pl-2 border p-1"
        onChange={(e) => setState(e.target.value as T)}
      >
        {children}
      </select>
    </>
  );
};

export default Selector;
