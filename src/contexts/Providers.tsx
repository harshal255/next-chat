'use client';
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ChatProvider } from "./ChatProvider";



export default function Providers({ children }: { children: ReactNode }) {


    return (
        <ChakraProvider>
            {/* user must authenticated */}
            <SessionProvider>
                <ChatProvider>
                    {children}
                </ChatProvider>
            </SessionProvider>
        </ChakraProvider>
    );
}
