import AiChat from "@/components/ai-chat";
import { ModeSwitcher } from "@/components/mode-switcher";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <header className="flex justify-end p-4">
        <ModeSwitcher />
      </header>
      <AiChat />
    </div>
  );
}
