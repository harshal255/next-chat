import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: "Here is the dashboard for chat lists"
}

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
        </>
    )
}

export default Layout;
