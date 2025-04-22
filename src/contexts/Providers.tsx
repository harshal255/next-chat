'use client';
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ChatProvider } from "./ChatProvider";
import { ThemeProvider } from 'next-themes'


export default function Providers({ children }: { children: ReactNode }) {


    return (
        <ThemeProvider
            attribute="class" // Apply theme as a class on the HTML element
            storageKey="chakra-ui-color-mode" // Custom key for localStorage
            defaultTheme="system" // Default theme (optional)
            enableSystem // Enable system theme detection
        >
            <ChakraProvider>
                {/* user must authenticated */}
                <SessionProvider>
                    <ChatProvider>
                        {children}
                    </ChatProvider>
                </SessionProvider>
            </ChakraProvider>
        </ThemeProvider>
    );
}
