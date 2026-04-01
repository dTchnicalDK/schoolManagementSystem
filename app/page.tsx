import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();
  console.log(session?.user?.id); // cuid from DB
  console.log(session?.user?.role); // "PARENT" (default)
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>welcome home page</h1>
      <Button>Click Here</Button>
    </div>
  );
}
