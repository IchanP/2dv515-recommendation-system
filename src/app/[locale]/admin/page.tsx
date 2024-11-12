import AdminLogin from "@/components/admin/AdminLogin";

const Admin = () => {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 sm:p-8 md:p-20 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 sm:gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center">
          <AdminLogin></AdminLogin>
        </div>
      </main>
    </div>
  );
};

export default Admin;
