// Step 2 — Structure Title: user names their first structure
import InputField from "../Inputs/index";

type Step2Props = {
  title: string;
  onChange: (val: string) => void;
};

const EXAMPLES = ["Study 6hrs daily", "Build every day", "Stay consistent"];

export default function Step2StructureTitle({ title, onChange }: Step2Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-[#2d3328] tracking-tight">
          Name your first structure
        </h2>
        <p className="text-sm text-[#778873] mt-1">
          A structure is a system you commit to running every day.
          You can have up to 2.
        </p>
      </div>

      <InputField
        label="Structure title"
        value={title}
        onChange={onChange}
        placeholder="e.g. Study Daily"
      />

      {/* Example chips */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-[#778873] font-medium uppercase tracking-wider">
          Need inspiration?
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => onChange(ex)}
              className="px-3 py-1.5 rounded-full text-xs font-medium
                border border-[#D2DCB6] bg-white text-[#4f5c49]
                hover:bg-[#D2DCB6] hover:border-[#A1BC98]
                transition-all duration-150"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}