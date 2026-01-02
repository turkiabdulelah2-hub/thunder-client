import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import CartDrawer from "@/components/Store/CartDrawer";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
            <Header />
            <CartDrawer />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
