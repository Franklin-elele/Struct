// AuthContainer — shared layout shell for all auth pages (login, signup, etc.)
// Keeps the card-on-background layout consistent across auth flows

type AuthContainerProps = {
  children: React.ReactNode;
};

export default function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="min-h-screen bg-[#F1F3E0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Brand mark */}
        <div className="mb-6 text-center">
          <span className="text-3xl font-bold text-[#778873] tracking-tight">
            Struct.
          </span>
        </div>

        {/* Auth card */}
        <div className="bg-white rounded-2xl border border-[#D2DCB6] shadow-[5px_4px_0px_1px_#d2dcb6] p-6 sm:p-8">
          {children}
        </div>

      </div>
    </div>
  );
}