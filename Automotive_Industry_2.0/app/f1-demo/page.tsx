import type { Metadata } from "next";
import F1ScrollDemo from "@/components/F1ScrollDemo";

export const metadata: Metadata = {
  title: "F1 Pit Stop Challenge | Illuminate Her",
  description: "Experience the speed and strategy of Formula 1 engineering.",
};

export default function F1DemoPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <F1ScrollDemo />
    </main>
  );
}
