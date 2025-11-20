export const useMessages = () => {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error("useMessages must be used inside MessageContextProvider");
  return ctx;
}
