// app/dashboard/page.js
import PregenButton from "@/components/admin/PregenButton";
import { cookies, headers } from "next/headers";

import { redirect } from "next/navigation";

export default function DashboardPage() {
  const cookieStore = cookies();

  const session = cookieStore.get("session");
  const locale =
    headers().get("accept-language")?.split(",")[0].split("-")[0] || "en";

  if (!session || session.value !== "loggedIn") {
    redirect(`/${locale}/admin`);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 sm:p-8 md:p-20 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 sm:gap-8 row-start-2 items-center sm:items-start">
        <div>
          <PregenButton></PregenButton>
        </div>
      </main>
    </div>
  );
}
