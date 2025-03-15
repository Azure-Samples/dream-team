import { useState } from 'react'
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
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Card, CardContent, CardFooter} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {  ChartNoAxesCombined, DollarSign, Dot, Loader2, SendHorizonal, ShieldAlert, ShoppingBasket, Soup, Terminal, Volleyball, Wrench} from "lucide-react"
import { Button } from "@/components/ui/button"

// import remarkBreaks from 'remark-breaks'
import { Textarea } from "@/components/ui/textarea"

import { AgentsSetup } from '@/components/agents-setup';
import { MarkdownRenderer } from '@/components/markdown-display';
import { ModeToggle } from '@/components/mode-toggle'
import { LoginCard } from "@/components/login";

import axios from 'axios';

import ag from '@/assets/ag.png';
// import aAif from '@/assets/azure-aif.png';

import { getAvatarSrc, getAvatarFallback } from '@/components/agents-definition'

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// import { agentsTeam1, agentsTeam2, agentsTeam3, agentsTeam4, agentsTeamFSI1 } from '@/components/agents-definition';
import { agentsTeam1 } from '@/components/agents-definition';
import { Footer } from "@/components/Footer";

// Define environment variables with default values
const BASE_URL = import.meta.env.VITE_BASE_URL;
const ALLWAYS_LOGGED_IN =
  import.meta.env.VITE_ALLWAYS_LOGGED_IN === "true" ? true : false;
const ACTIVATION_CODE = import.meta.env.VITE_ACTIVATON_CODE;

console.log('BASE_URL:', BASE_URL);
console.log('ALLWAYS_LOGGED_IN:', ALLWAYS_LOGGED_IN);
// console.log('ACTIVATION_CODE:', ACTIVATION_CODE);

interface ChatMessage {
  user: string;
  message: string;
  time?: string;
  type?: string;
  source?: string;
  content?: string;
  stop_reason?: string;
  models_usage?: string;
  content_image?: string;
  session_id?: string;
  elapsed_time?: number;
}

interface Agent {
  input_key: string;
  type: string;
  name: string;
  system_message: string;
  description: string;
  icon: string;
  index_name: string;
}

// interface Team {
//   teamId: string;
//   name: string;
//   agents: Agent[];
//   description?: string;
// }
export default function App() {

  const wellcomeMessage: ChatMessage = {
    user: 'MagenticOneOrchestrator',
    message: "My team is ready to assist you. Please type your task below to start.",
    // message: sampleMarkdown,
    time: new Date().toISOString(),
    // content: response.data.content,
    source: 'MagenticOneOrchestrator',
    session_id: 'dummy-generated-session-id',
  };

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([wellcomeMessage]);
  // const [chatHistory, setChatHistory] = useState<ChatMessage[]>(debugMessages);

  const [sessionID, setSessionID] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [sessionTime, setSessionTime] = useState('')
  // const [files, setFiles] = useState<{ name: string, size: number, date: string }[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(ALLWAYS_LOGGED_IN)
  // const [fileUpload, setFileUpload] = useState<File | null>(null)
  // const [isFileCardVisible, setIsFileCardVisible] = useState(false)
  // const [isSettingsCardVisible, setIsSettingsCardVisible] = useState(false)
  const [isTyping, setIsTyping] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(agentsTeam1);
  const { userInfo } = useUserContext();

  // Initialize agents from default team (will be updated by sidebar selection)
  // Optionally use an effect to set initial team agents if needed

  const handleTeamSelect = (team: { teamId: string; agents: Agent[] }) => {
    // Update agents based on selected team from sidebar
    setAgents(team.agents);
  }

  const stopSession = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/stop?session_id=${encodeURIComponent(sessionID)}`);
      console.log('Stop session response:', response.data);
      setIsTyping(false);
      setSessionID('');
      setSessionTime('');
      // reload the page
      window.location.reload(); 
      // return response
    } catch (error) {
      console.error('Stop session error:', error);
    }
  };
  
  const addAgent = (name: string, description: string, systemMessage: string) => {
    const newAgent = {
      input_key: (agents.length + 1).toString().padStart(4, '0'),
      type: "Custom",
      name,
      system_message: systemMessage,
      description,
      icon: "🤖",
      index_name: ""
    };
    setAgents([...agents, newAgent]);
  };

  const editAgent = (key: string, name: string, description: string, systemMessage: string) => {
    const updatedAgents = agents.map((agent) =>
      agent.input_key === key
        ? { ...agent, name, description, system_message: systemMessage }
        : agent
    );
    setAgents(updatedAgents);
  };

  const addRAGAgent = async (
    name: string,
    description: string,
    indexName: string,
    files: FileList | null
  ) => {
    if (files && files.length > 0) {
      const temporaryRandomName = Math.random().toString(36).substring(2, 15);
      const newAgent = {
        input_key: temporaryRandomName,
        type: "temporary",
        name: "Processing & Uploading...",
        system_message: "",
        description,
        icon: "⌛",
        index_name: "tmp"
      };
      setAgents([...agents, newAgent]);

      const formData = new FormData();
      formData.append("indexName", indexName);
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
           try {
          const response = await axios.post(`${BASE_URL}/upload`, formData);
          if (response.data.status === "error") {
              console.error('Upload API Error:', response.data.message);
              //TODO handle error -> propagate to UI
              return;
          }
          console.log('Upload response:', response.data);
      } catch (error) {
          console.error('Upload error:', error);
      } finally {
          // Remove the temporary agent after processing
          setAgents(agents.filter((agent) => agent.input_key !== temporaryRandomName));
      }
    }
    const newAgent = {
      input_key: (agents.length + 1).toString().padStart(4, '0'),
      type: "RAG",
      name,
      system_message: "",
      description,
      icon: "🤖",
      index_name: indexName
    };
    setAgents([...agents, newAgent]);
  };

  const removeAgent = (inputKey: string) => {
    setAgents(agents.filter((agent) => agent.input_key !== inputKey));
  };


  // const handleSendMessage = async () => {
  //   if (userMessage.trim()) {
  //     // const newMessage = { user: 'User', message: userMessage };
  //     const newMessage: ChatMessage = {
  //       user: 'User',
  //       message: userMessage,
  //       time: new Date().toISOString(),
  //       // content: response.data.content,
  //       source: 'User',
  //     };
  //     setChatHistory((prev) => [...prev, newMessage]);
  
  //     try {
        
  //       const response = await axios.post('http://localhost:8000/chat', { content: userMessage, agents: JSON.stringify(agents)});
  //       console.log('Response:', response.data);
  //       const aiMessage: ChatMessage = {
  //         user: response.data.source,
  //         message: response.data.content,
  //         time: response.data.time,
  //         // content: response.data.content,
  //         source: response.data.source,
  //         stop_reason: response.data.stop_reason,
  //         models_usage: response.data.models_usage,
  //         content_image: response.data.content_image,
  //       };
  //       console.log('New message:', aiMessage);
  //       // const aiMessage = { user: 'MagenticOneOrchestrator', message: String(newMessage.content).replace(/\n$/, '') };
  //       setChatHistory((prev) => [...prev, aiMessage]);
  //     } catch (error) {
  //       console.error('Chat error:', error);
  //     }
  //     setUserMessage('');
  //   }
  // };

  const handleSendStreamingMessage = async () => {
    if (!userMessage.trim()) return;
    setIsTyping(true);
    const newMessage = { user: 'User', message: userMessage };
    setChatHistory([...chatHistory, newMessage]);
    // Start timer
    const startTime = Date.now();

    // Use updated agents state directly
    const selectedAgents = agents;
    console.log('Using agents:', selectedAgents);

    try {
      const response = await axios.post(`${BASE_URL}/start`, { 
        content: userMessage, 
        user_id: userInfo.email, // Use directly from context
        agents: JSON.stringify(selectedAgents)
      });
      const sessionId = response.data.response;  // Get the session ID from the response
      setSessionID(sessionId);
      const eventSource = new EventSource(`${BASE_URL}/chat-stream?session_id=${encodeURIComponent(sessionId)}&user_id=${encodeURIComponent(userInfo.email)}`);
      eventSource.onmessage = (event) => {
        // console.log('EventSource message:', event.data);
        const data = JSON.parse(event.data);
        if (data.stop_reason) {
          setIsTyping(false);
          // Measure elapsed time and set sessionTime (assumes sessionTime state exists)
          const elapsedTime = Date.now() - startTime;
          const minutes = Math.floor(elapsedTime / 60000);
          const seconds = Math.floor((elapsedTime % 60000) / 1000);
          setSessionTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
          // eventSource.close();
        }


        const aiMessage: ChatMessage = {
          user: data.source,
          message: data.content,
          time: data.time,
          // content: data.content,
          source: data.source,
          stop_reason: data.stop_reason,
          models_usage: data.models_usage,
          content_image: data.content_image,
          session_id: data.session_id,
          elapsed_time: data.elapsed_time,
        };
  
        setChatHistory((prev) => [...prev, aiMessage]);
      };
  
      eventSource.onerror = (error) => {
        setIsTyping(false);
        console.error('EventSource error:', error);
        eventSource.close();
      };
    } catch (error) {
      console.error('Chat error:', error);
    }
    setUserMessage('');
  };

  /// TODO: better login -> MS EntraID
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

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    {!isAuthenticated ? (
      <LoginCard handleLogin={handleLogin} />
    ) : (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar onTeamSelect={handleTeamSelect} /> {/* Remove onUserNameChange prop */}
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
                    AutoGen & MagenticOne demo
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Playground</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto hidden items-center gap-2 md:flex">
     
            {/* if the session end display elapsed time */}
            <div className="flex gap-0 p-0 pt-0 justify-end">
              {sessionTime && !isTyping ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <p className='text-sm text-muted-foreground'>Session {sessionID} completed in {sessionTime}s.</p>
                  <Button variant="secondary" onClick={() => stopSession()}>
                    Run new
                  </Button>
                </div>
              ) : null}
              {isTyping ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <p className='text-sm text-muted-foreground'>Running {sessionID} session...</p>
                  <Loader2 className="lucide lucide-loader2 mr-2 h-4 animate-spin loader-green" />
                  {/* button to stop the session */}
                  <Button variant="destructive" onClick={() => stopSession()}>Stop</Button>
                </div>
              ) : <p className='text-sm text-muted-foreground loader-green'></p>}
            </div>
        
   
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
          <Separator  />
          {/* Agents setup */}
          <AgentsSetup
              agents={agents}
              removeAgent={removeAgent}
              addAgent={addAgent}
              addRAGAgent={addRAGAgent}
              editAgent={editAgent}
              getAvatarSrc={getAvatarSrc}
              isCollapsed={isTyping || (sessionTime) ? true : false}
            />
           {/* if session is running display loader */}
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            {/* Chat Interface */}
            <Card className={`md:col-span-2 h-full flex flex-col`}>
              <CardContent className="flex-1 h-96">
                <Separator className='my-2 invisible'/>
                <div className="space-y-4">
                  {chatHistory.map((message, index) => (
                    <div key={index} className={`flex ${message.user === 'User' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-2 rounded-lg shadow ${message.user === 'User' ? 'group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[70%] bg-primary text-primary-foreground duration-300 animate-in fade-in-0 zoom-in-75 origin-bottom-right' : 'group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[96%] bg-muted text-foreground duration-300 animate-in fade-in-0 zoom-in-75 origin-bottom-left'}`}>
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={getAvatarSrc(message.user)} />
                            <AvatarFallback>{getAvatarFallback(message.user)}</AvatarFallback>
                            {/* <Bot className="ml-autoaspect-square h-full w-full" /> */}
                          </Avatar>
                          <div className="break-all max-w-[100%] message">
                            <p className="text-sm font-semibold">{message.user}</p>
                            <MarkdownRenderer markdownText={message.message} />
                            {/* Display image if available */}
                            {message.content_image && (
                              <img src={`${message.content_image}`} alt="content" className="mt-2 max-w-[625px]" />
                            )}
                            {/* <MarkdownRenderer>{message.message}</MarkdownRenderer> */}
                            <p className="text-xs text-muted-foreground">{message.time && new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit',hour12: false })}</p>
                          </div>
                        </div>
                      </div>
                     {/* <div className='inline'>
                      <time className=" mt-1 block px-1 text-xs opacity-50 duration-500 animate-in fade-in-0">
                        {message.time && new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </time>
                     </div> */}
                    </div>
                  ))}

                  
                  {isTyping ? (
                    <div className="justify-left flex space-x-1">
                      <div className="rounded-lg bg-muted p-3 shadow">
                        <div className="flex -space-x-2.5">
                        <Dot className='lucide lucide-dot h-5 w-5 animate-typing-dot-bounce' />
                        <Dot className='lucide lucide-dot h-5 w-5 animate-typing-dot-bounce [animation-delay:90ms]' />
                        <Dot className='lucide lucide-dot h-5 w-5 animate-typing-dot-bounce [animation-delay:180ms]' />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </CardContent>
                           <CardFooter className="flex flex-col space-y-2">
                <div className="relative w-full">
                  <Textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendStreamingMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="z-10 w-full h-36 grow resize-none rounded-xl border border-input bg-background p-3 pr-24 text-sm ring-offset-background transition-[border] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={handleSendStreamingMessage} 
                    disabled={isTyping}
                    className="absolute bottom-2 right-2"
                  >
                    <SendHorizonal />
                  </Button>
                </div>
                <div className="flex space-x-2">
                <Button variant="outline" className="text-sm bg-muted" onClick={() => setUserMessage("Find me a French restaurant in Dubai with 2 Michelin stars?")}><Soup />Find restaurant...</Button>
                <Button variant="outline" className="text-sm bg-muted" onClick={() => setUserMessage("When and where is the next game of Arsenal, print a link for purchase")}><Volleyball /> Check football game...</Button>
                <Button variant="outline" className="text-sm bg-muted" onClick={() => setUserMessage("Generate a python script and execute Fibonacci series below 1000")}><Terminal />Generate script...</Button>
                <Button variant="outline" className="text-sm bg-muted" onClick={() => setUserMessage("Use advanced financial modelling, scenario analysis, geopolitical forecasting, and risk quantification to produce a comprehensive, data-driven assessment of current market forecasts, commodity price trends, and OPEC announcements. In this process, identify and deeply evaluate the relative growth potential of various upstream investment areas—ranging from unconventional reservoirs to deepwater projects and advanced EOR techniques—across Africa, the Middle East, and Central Europe. Based on publicly available data (e.g., IEA, EIA, and OPEC bulletins), synthesize your findings into specific, country-level recommendations that incorporate ROI calculations, scenario-based risk assessments, and robust justifications reflecting both market and geopolitical considerations. Present the final deliverable as a well-structured table​")}><ChartNoAxesCombined /> Market assessment...</Button>
                </div>
                <div className="flex space-x-2">
                <Button variant="outline" className="text-sm bg-muted" onClick={() => setUserMessage("Analyze the sensor data and historical maintenance logs for the high‑pressure gas compressor (EquipmentID: COMP-001). Using real‑time measurements of temperature, vibration, and pressure, along with the asset’s running hours, detect any early signs of mechanical degradation. After this, correlate these findings with the vendor’s guidelines (downloaded from Emerson’s Predictive Maintenance Guide for Gas Compressors) and the maintenance history. In particular, determine if rising vibration amplitudes, combined with temperature excursions and delayed calibrations, suggest that the compressor is trending toward failure. Based on this analysis, generate a detailed maintenance alert (text only, formatted as Markdown) including a prioritized repair schedule and recommended corrective actions to mitigate downtime.")}><Wrench /> Predictive Maintenance...</Button>
                <Button variant="outline" className="text-sm bg-muted" onClick={() => setUserMessage("Analyze the internal incident reports for the upstream oil and gas facility (Asset: Well Site A-17) to detect compliance gaps. Using real‑time incident data (including near misses, safety violations, and environmental events) along with historical incident outcomes, correlate these findings with the updated BSEE Incident Reporting & HSE Compliance Guidelines 2024. Identify missing data fields or delayed reporting that do not meet the new regulatory requirements and generate a prioritized set of corrective recommendations to enhance incident reporting and overall safety compliance. Your output should include detailed observations on which aspects of the incident logs (e.g., incomplete descriptions, inconsistent outcome classifications) need improvement.​")}><ShieldAlert /> Safety...</Button>
                <Button variant="outline" className="text-sm bg-muted" onClick={() => setUserMessage("Analyze the financial transaction data for our customer base, focusing on identifying customers with frequent overdrafts, recurring cash flow gaps, and rapid declines in account balances. Use this analysis, combined with customer profile details (such as account balance, current loan amount, and credit score), and cross‑reference these findings with the risk thresholds from the Experian Credit Risk Scorecard PDF. Your task is to dynamically generate personalized upsell recommendations for each customer. The recommendations should include suggestions such as higher credit lines or tailored personal loans, with actionable insights based on each customer’s behavior.")}><DollarSign /> Loan upsell...</Button>
                <Button variant="outline" className='text-sm bg-muted' onClick={() => setUserMessage("Analyze the real‑time inventory and sales data for the cinema concessions at Well‑in‑Mall Cinema (Location: Cinema A1). Your task is to identify products that are nearing or falling below their reorder points. Cross‑reference these findings with the recommended restocking strategies outlined in the Microsoft Dynamics 365 Retail Inventory & Supply Chain Optimization Best Practices Guide 2024 (see link above). Additionally, use real‑time supply chain news—retrieved via our web surfer agent—to adjust for any external factors affecting lead times. Based on your analysis, produce a detailed restocking alert report that includes: \n\n - A prioritized list of items needing replenishment. \n\n - Recommended order quantities based on recent sales trends and forecasted demand. \n\n - Actionable recommendations to optimize the supply chain and reduce stockouts..")}><ShoppingBasket /> Retail...</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
    )}
    </ThemeProvider>
  )
}
