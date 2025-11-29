import { ReactNode } from "react";
import { useTheme } from "../../../stores/useThemeStore";

type PresentationLayoutProps = {
    children: ReactNode;
    className?: string;
    hasNavbar?: boolean;
};

export function PresentationLayout({ children, className = "", hasNavbar = false }: PresentationLayoutProps) {
    const { isDark } = useTheme();
    
    const bgColor = isDark 
        ? 'bg-[#0a0a0a]' 
        : 'bg-gradient-to-br from-slate-100 to-slate-200';
    
    return (
        <div 
            className={`fixed inset-0 flex flex-col overflow-hidden ${bgColor} transition-colors duration-300 ${className}`}
            style={{ 
                top: hasNavbar ? '60px' : 0,
                height: hasNavbar ? 'calc(100vh - 60px)' : '100vh'
            }}
        >
            {children}
        </div>
    );
}
