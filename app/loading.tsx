// app/loading.tsx
// Next.js automatically shows this while any page in the app is loading
// No manual wiring needed — it works for every route automatically

import Loader from "@/app/components/Loader";

export default function Loading() {
  return <Loader variant="page" />;
}