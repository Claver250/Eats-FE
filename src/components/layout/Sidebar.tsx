import SidebarContent from "./SidebarContent";

export default function Sidebar() {
    return (
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-border bg-surface p-4 lg:block">
        <SidebarContent />
        </aside>
    );
}