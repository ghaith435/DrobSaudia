import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
    const session = await auth();

    // Check if user is authenticated and is admin
    if (!session?.user) {
        redirect("/auth/login");
    }

    if ((session.user as any).role !== "ADMIN") {
        redirect("/");
    }

    return <AdminDashboard />;
}
