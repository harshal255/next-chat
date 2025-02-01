import { NextResponse } from "next/server";
import os from "os";
export async function GET() {
    const PORT = process.env.PORT || 3000;
    const APP_NAME = "Next Chat Application";

    const banner = `
  ███╗   ██╗███████╗██╗  ██╗████████╗     ██████╗██╗  ██╗ █████╗ ████████╗
  ████╗  ██║██╔════╝██║  ██║╚══██╔══╝    ██╔════╝██║  ██║██╔══██╗╚══██╔══╝
  ██╔██╗ ██║█████╗  ███████║   ██║       ██║     ███████║███████║   ██║   
  ██║╚██╗██║██╔══╝  ██╔══██║   ██║       ██║     ██╔══██║██╔══██║   ██║   
  ██║ ╚████║███████╗██║  ██║   ██║       ╚██████╗██║  ██║██║  ██║   ██║   
  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   ╚═╝        ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   

  🚀 ${APP_NAME} is running! Access it at: http://localhost:${PORT}  
  💬 Real-time chat enabled  
  🖥️ Running on: ${os.hostname()} | ${os.platform()} | ${os.arch()}  
  🔄 Restart to refresh server logs.  
`;
    console.log("\x1b[36m%s\x1b[0m", banner);
    return NextResponse.json({
        hello: APP_NAME,
    })
}