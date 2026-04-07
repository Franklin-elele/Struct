// Step 1 — Signup: First Name, Last Name, Email, Password

import InputField from "../Inputs/index";

type SignupData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type Step1Props = {
  data: SignupData;
  onChange: (updated: SignupData) => void;
};

export default function Step1SignupForm({ data, onChange }: Step1Props) {
  const set = (field: keyof SignupData) => (val: string) =>
    onChange({ ...data, [field]: val });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-[#2d3328] tracking-tight">
          Create your account
        </h2>
        <p className="text-sm text-[#778873] mt-1">
          Let's get you set up in a few steps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="First name"
          value={data.firstName}
          onChange={set("firstName")}
          placeholder="John"
          autoComplete="given-name"
        />
        <InputField
          label="Last name"
          value={data.lastName}
          onChange={set("lastName")}
          placeholder="Doe"
          autoComplete="family-name"
        />
      </div>

      <InputField
        label="Email"
        type="email"
        value={data.email}
        onChange={set("email")}
        placeholder="john@example.com"
        autoComplete="email"
      />

      <InputField
        label="Password"
        type="password"
        value={data.password}
        onChange={set("password")}
        placeholder="At least 8 characters"
        autoComplete="new-password"
      />
    </div>
  );
}

export type { SignupData };