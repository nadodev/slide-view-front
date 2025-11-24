import { ReactNode } from "react";

type PresentationLayoutProps = {
    children: ReactNode;
    className?: string;
};

export function PresentationLayout({ children, className = "" }: PresentationLayoutProps) {
    return (
        <div className={`w-screen h-screen flex items-start justify-center relative ${className}`}>
            {children}
        </div>
    );
}
