'use client';
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
// import io from "socket.io-client";
// 192.168.0.104
//http://192.168.0.104:5000
//https://chat-app-u2cq.onrender.com
// http://localhost:5000

// var socket = io(hostName);

export interface SessionUser {
    id: string;
    name?: string;
    email?: string;
    profilePic?: string;
    about?: string;
    mobileNo?: string;
    otp?: string;
    isOnline?: boolean;
    isDeleted?: boolean;
    lastSeen?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ChatContextType {
    hostName: string,
    isAuthenticated: boolean,
    user: SessionUser | null,
    setUser: React.Dispatch<React.SetStateAction<SessionUser | null>>,
    status: "loading" | "authenticated" | "unauthenticated";
    myChatList: any,
    setMyChatList: any,
    originalChatList: any,
    isChatLoading: any,
    setIsChatLoading: any,
    receiver: any,
    setReceiver: any,
    messageList: any,
    setMessageList: any,
    activeChatId: any,
    setActiveChatId: any,
    fetchData: any,
    isOtherUserTyping: any,
    setIsOtherUserTyping: any,
    isLoading: any,
    setIsLoading: any
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const hostName = "http://localhost:3000";
    const { data: session, status } = useSession();
    console.log({ session });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<SessionUser | null>(null);
    const [receiver, setReceiver] = useState({});
    const [messageList, setMessageList] = useState([]);
    const [activeChatId, setActiveChatId] = useState("");
    const [myChatList, setMyChatList] = useState([]);
    const [originalChatList, setOriginalChatList] = useState([]);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {

        try {
            const response = await fetch(`${hostName}/api/conversation/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch data" + (await response.text()));
            }
            const jsonData = await response.json();
            // console.log({jsonData});
            setMyChatList(jsonData?.conversationList);
            setIsLoading(false);
            setOriginalChatList(jsonData?.conversationList);
        } catch (error) {
            console.log(error);
        }
    };

    console.log({ myChatList });

    //   useEffect(() => {
    //     socket.on("receiver-online", () => {
    //       setReceiver((prevReceiver) => ({ ...prevReceiver, isOnline: true }));
    //     });
    //   }, []);

    //   useEffect(() => {
    //     socket.on("receiver-offline", () => {
    //       setReceiver((prevReceiver) => ({
    //         ...prevReceiver,
    //         isOnline: false,
    //         lastSeen: new Date().toISOString(),
    //       }));
    //     });
    //   }, []);

    useEffect(() => {
        if (session?.user) {
            setUser(session.user as SessionUser);
            setIsAuthenticated(true);
        }
        fetchData();
    }, [session]);

    console.log("user from chat provider", user);

    return (
        <ChatContext.Provider
            value={{
                isAuthenticated,
                user,
                status,
                setUser,
                receiver,
                setReceiver,
                messageList,
                setMessageList,
                activeChatId,
                setActiveChatId,
                myChatList,
                setMyChatList,
                originalChatList,
                fetchData,
                hostName,
                // socket,
                isOtherUserTyping,
                setIsOtherUserTyping,
                isChatLoading,
                setIsChatLoading,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};


export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error(
            "useChat must be used within a ChatProvider"
        );
    }
    return context;
}

