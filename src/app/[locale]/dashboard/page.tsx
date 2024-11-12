// app/dashboard/page.js
import PregenButton from "@/components/admin/PregenButton";
import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const cookieStore = cookies();

  const locale =
    headers().get("accept-language")?.split(",")[0].split("-")[0] || "en";

  const token = cookieStore.get("session")?.value;
  try {
    jwt.verify(token as string, process.env.SESSION_SECRET as string);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    // Should probably use a logger here to log the error but w/e
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
