import { useState, useEffect } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { useUserContext } from '@/contexts/UserContext'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Loader2, Eye, Trash } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// import { format } from 'date-fns'
import { ModeToggle } from '@/components/mode-toggle'
import { LoginCard } from "@/components/login"


import axios from 'axios'

import ag from '@/assets/ag.png';
// import aAif from '@/assets/azure-aif.png';

import { getAvatarSrc, getAvatarFallback, Agent } from '@/components/agents-definition'
// New imports for the dialog UI. Adjust the import path as needed.
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MarkdownRenderer } from '@/components/markdown-display';
import { Footer } from '@/components/Footer'

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://autogen-demo-be2.whiteground-dbb1b0b8.eastus.azurecontainerapps.io";
const ALLWAYS_LOGGED_IN =
  import.meta.env.VITE_ALLWAYS_LOGGED_IN === "true" ? true : false;
const ACTIVATION_CODE = import.meta.env.VITE_ACTIVATON_CODE || "0000";

export default function PlaygroundHistory() {
  const [isAuthenticated, setIsAuthenticated] = useState(BASE_URL)
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  // New state for dialog display.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  // New state to store the selected conversation data
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const { userInfo } = useUserContext();

  // Updated function to fetch conversation details
  const handleShowDetails = async (userId: string, sessionId: string) => {
    try {
      setSelectedSessionId(sessionId);
      setIsConversationLoading(true);
      
      const response = await axios.post(`${BASE_URL}/conversations/user`, {
        user_id: userId,
        session_id: sessionId
      });
      
      setSelectedConversation(response.data[0]);
      setDialogOpen(true);
      // console.log('Conversation details:', response.data[0]);
    } catch (error) {
      console.error("Failed to fetch conversation details:", error);
    } finally {
      setIsConversationLoading(false);
    }
  }
  


    async function fetchHistory(userId: string) {
      try {
        setIsHistoryLoading(true);
        console.log('Fetching for:', userId);
        const response = await axios.post(`${BASE_URL}/conversations`, { 
                user_id: userId,
              });
        console.log('Response:', response.data);
        setHistoryItems(response.data);
        setIsHistoryLoading(false);
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    }
    
  

  const handleLogin = (email: string, password: string) => {
    console.log('Logging in with:', email)
    if (password === ACTIVATION_CODE || ALLWAYS_LOGGED_IN) {
      setIsAuthenticated(true)
    } else {
      console.log('Invalid activation code')
    }
  }

  // const handleLogout = () => {
  //   setIsAuthenticated(false)
  // }

  const handleDeleteSession = async (user_id:string, sessionId: string) => {
    try {
      await axios.post(`${BASE_URL}/conversations/delete?session_id=${sessionId}&user_id=${user_id}`);
      // Remove the deleted session from the state
      setHistoryItems(prev => prev.filter(item => item.session_id !== sessionId ));
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const handleTeamSelect = (team: { teamId: string; agents: Agent[] }) => {
    // Update agents based on selected team from sidebar
    // setAgents(team.agents);
    console.log('Selected team:', team);
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {!isAuthenticated ? (
        <LoginCard handleLogin={handleLogin} />
      ) : (
        <SidebarProvider defaultOpen={true}>
          <AppSidebar onTeamSelect={handleTeamSelect} />
          {(() => {
            useEffect(() => {
              if (userInfo.email) {
                fetchHistory(userInfo.email);
              }
            }, [userInfo.email]);
            return null;
          })()}
          <SidebarInset>
            <header className="flex sticky top-0 bg-background h-14 shrink-0 items-center gap-2 border-b px-4 z-10 shadow">
              <div className="flex items-center gap-2 px-4 w-full">
                {/* <img src={banner} alt="Banner" className="h-64" /> */}
                {/* <SidebarTrigger />   */}
                {/* <Bot className="h-8 w-8" /> */}
                <img src={ag  } alt="Banner" className="h-8" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        AutoGen &amp; MagenticOne demo
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>History</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto hidden items-center gap-2 md:flex">
          
        
                  {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
                  <ModeToggle />
                  {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
                  {/* {isAuthenticated ? (
                    <Button variant="outline" onClick={handleLogout}>
                      <LogOut />Log out
                    </Button>
                  ) : null} */}
                    
                </div>
              </div>
            </header>
            {/* Main content */}
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Separator />
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                {/* Chat Interface */}
                <Card className="md:col-span-2 flex flex-col">
                  <CardHeader>
                    <CardTitle>Agentic Workflows History</CardTitle>
                    <div className="space-x-2 container text-center">
                      <p className="text-sm text-muted-foreground inline">Quick actions:</p>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                  </CardHeader>
                  {isHistoryLoading ? (
                    <CardContent className="flex-1 h-96 overflow-auto">
                      <Loader2 className="lucide lucide-loader2 mr-2 h-4 animate-spin" />
                    </CardContent> 
                  ) : (
                    <CardContent className="flex-1 h-96 overflow-auto">
                      <Separator />
                      <div className="space-y-4">
                        {/* Show history */}
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[30%]">ID</TableHead>
                              {/* <TableHead>Name</TableHead> */}
                              <TableHead className="w-[30%]">User</TableHead>
                              <TableHead className="w-[20%]">Date &amp; Time</TableHead>
                              {/* <TableHead>Runtime</TableHead> */}
                              <TableHead className="text-right w-[10%]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {historyItems.map(item => (
                              <TableRow key={item.session_id}>
                                <TableCell className="font-medium">{item.session_id}</TableCell>
                                {/* <TableCell>{item.name}</TableCell> */}
                                <TableCell>{item.user_id}</TableCell>
                                <TableCell>{item.timestamp}</TableCell>
                                {/* <TableCell>{item.runtime}</TableCell> */}
                                <TableCell className="text-right">
                                  <Button variant="outline" size="icon" onClick={() => handleShowDetails(item.user_id,item.session_id)}>
                                    <Eye />
                                  </Button>
                                  &nbsp;&nbsp;
                                  <Button variant="destructive" size="icon" onClick={() => handleDeleteSession(item.user_id,item.session_id)}>
                                    <Trash  />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  )}
                  <CardFooter className="flex space-x-2" />
                </Card>
              </div>
            </div>
            <Footer />

                        {/* Dialog for displaying history details */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent  className="max-w-fit">
                <DialogHeader>
                  <DialogTitle>History Details</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[600px] w-[1200px] rounded-md border p-4">
                <div className='w-full sm:w-full  sm:max-w-lg'>
                  Displaying details for session ID: <strong>{selectedSessionId}</strong>
                </div>
                <div className="mt-4">
                  {isConversationLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedConversation && selectedConversation.messages && 
                        selectedConversation.messages
                          .filter((message: any) => message.source)
                          .map((message: any, index: any) => (
                          
                          <div key={index} className={`flex ${message.source.toLowerCase() === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-2 rounded-lg shadow ${message.source.toLowerCase() === 'user' ? 'group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[70%] bg-primary text-primary-foreground duration-300 animate-in fade-in-0 zoom-in-75 origin-bottom-right' : 'group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[96%] bg-muted text-foreground duration-300 animate-in fade-in-0 zoom-in-75 origin-bottom-left'}`}>
                              <div className="flex items-center space-x-2">
                                <Avatar>
                                  <AvatarImage src={getAvatarSrc(message.source)} />
                                  <AvatarFallback>{getAvatarFallback(message.source)}</AvatarFallback>
                                </Avatar>
                                <div className="break-all max-w-[100%] message">
                                  <p className="text-sm font-semibold">{message.source}</p>
                                  <MarkdownRenderer markdownText={message.content} />
                                  {message.content_image && (
                                    <img src={`${message.content_image}`} alt="content" className="mt-2 max-w-[625px]" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      {!selectedConversation?.messages?.length && (
                        <p>No messages available for this conversation.</p>
                      )}
                    </div>
                  )}
                </div>
                </ScrollArea>
                <DialogFooter>
                  <Button onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SidebarInset>
        </SidebarProvider>
      )}
    </ThemeProvider>
  )
}