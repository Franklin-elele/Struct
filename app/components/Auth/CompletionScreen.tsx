import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";


export default function CompletionScreen({ name }: { name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFinish = () => {
    setLoading(true);
    router.push("/dashboard/home");
  }

  return (
    <div>
      {loading && <Loader variant="page" />}
      <div className="flex flex-col items-center gap-6 py-6 text-center">

        <div className="w-16 h-16 rounded-2xl bg-[#D2DCB6] flex items-center justify-center text-3xl">
          ◈
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#2d3328] tracking-tight">
            You're all set{name ? `, ${name}` : ""}!
          </h2>
          <p className="text-sm text-[#778873] mt-2 max-w-xs">
            Your first structure is ready. Time to stop planning and start executing.
          </p>
        </div>
        <button
          type="button"
          className="w-full py-3 rounded-xl bg-[#2d3328] text-[#F1F3E0] text-sm font-semibold
          shadow-[5px_4px_0px_1px_#a1bc98]
          hover:shadow-[2px_2px_0px_1px_#778873] hover:translate-x-[3px] hover:translate-y-[2px]
          transition-all duration-150"
          onClick={handleFinish}
        >
          Continue to Dashboard →
        </button>
      </div>
    </div>
  );
}