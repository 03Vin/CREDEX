import SpendForm from "@/components/SpendForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8 text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          AI Spend Audit
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Discover where you are overspending on AI tools and how to optimize your stack.
        </p>
      </div>

      <SpendForm />

      <footer className="mt-16 text-sm text-zinc-600">
        Powered by Credex • Save money on AI infrastructure
      </footer>
    </div>
  );
}
