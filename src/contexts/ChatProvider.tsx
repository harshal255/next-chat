'use client';
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext } from "react";
// import io from "socket.io-client";
// 192.168.0.104
//http://192.168.0.104:5000
//https://chat-app-u2cq.onrender.com
// http://localhost:5000

// var socket = io(hostName);

interface ChatContextType {
    hostName: string,
    isAuthenticated: boolean,
    user?: object,
    status: "loading" | "authenticated" | "unauthenticated";
}

const ChatContext = createContext<ChatContextType | undefined>({
    hostName: "http://localhost:3000",
    isAuthenticated: false,
    user: {},
    status:"unauthenticated"
});

export function ChatProvider({ children }: { children: ReactNode }) {
    const hostName = "http://localhost:3000";
    const { data: session,status } = useSession();
    const user = session?.user;
    const isAuthenticated = !!session?.user;
    console.log({ session })
    // const [receiver, setReceiver] = useState({});
    // const [messageList, setMessageList] = useState([]);
    // const [activeChatId, setActiveChatId] = useState("");
    // const [myChatList, setMyChatList] = useState([]);
    // const [originalChatList, setOriginalChatList] = useState([]);
    // const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    // const [isChatLoading, setIsChatLoading] = useState(false);
    // const [isLoading, setIsLoading] = useState(true);

    // const fetchData = async () => {
    //     try {
    //         const response = await fetch(`${hostName}/conversation/`, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "auth-token": localStorage.getItem("token"),
    //             },
    //         });
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch data" + (await response.text()));
    //         }
    //         const jsonData = await response.json();
    //         setMyChatList(jsonData);
    //         setIsLoading(false);
    //         setOriginalChatList(jsonData);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

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

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const token = localStorage.getItem("token");
    //             if (token) {
    //                 const res = await fetch(`${hostName}/auth/me`, {
    //                     method: "GET",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         "auth-token": token,
    //                     },
    //                 });
    //                 const data = await res.json();
    //                 setUser(data);
    //                 console.log("user fetched");
    //                 setIsAuthenticated(true);
    //                 //   socket.emit("setup", await data._id);
    //             }
    //         } catch (error) {
    //             console.log(error);
    //             setIsAuthenticated(false);
    //             setUser({});
    //             localStorage.removeItem("token");
    //             localStorage.removeItem("user");
    //         }
    //     };

    //     fetchUser();
    //     fetchData();
    // }, []);

    return (
        <ChatContext.Provider
            value={{
                isAuthenticated,
                user,
                status,
                // setUser,
                // receiver,
                // setReceiver,
                // messageList,
                // setMessageList,
                // activeChatId,
                // setActiveChatId,
                // myChatList,
                // setMyChatList,
                // originalChatList,
                // // fetchData,
                hostName,
                // // socket,
                // isOtherUserTyping,
                // setIsOtherUserTyping,
                // isChatLoading,
                // setIsChatLoading,
                // isLoading,
                // setIsLoading,
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

