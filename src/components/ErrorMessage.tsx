const ErrorMessage = ({ text }: { text: string | null }) => {
  return (
    <>
      {text && (
        <p className="text-red-500 font-bold text-sm text-center mt-2">
          {text}
        </p>
      )}
    </>
  );
};

export default ErrorMessage;
