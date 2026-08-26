import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/ui/ChatBot";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark bg-surface text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Floating AI chatbot — visible on every public page */}
      <ChatBot />
    </div>
  );
}
