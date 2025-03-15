
import { useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
// import { useUserContext } from '@/contexts/UserContext'
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
import { Plus, Download, Delete} from "lucide-react"
import { Button } from "@/components/ui/button"


import { AgentsSetup } from '@/components/agents-setup';
import { ModeToggle } from '@/components/mode-toggle'
import { LoginCard } from "@/components/login";


import ag from '@/assets/ag.png';

import { getAvatarSrc } from '@/components/agents-definition'


// TODO: FUJ! How to get ENV vars from SWA?
// Define environment variables with default values
const BASE_URL = import.meta.env.VITE_BASE_URL || "local";
const ALLWAYS_LOGGED_IN =
  import.meta.env.VITE_ALLWAYS_LOGGED_IN === "true" ? true : false;
const ACTIVATION_CODE = import.meta.env.VITE_ACTIVATON_CODE || "0000";

// console.log('VITE_BASE_URL:', BASE_URL);
// console.log('VITE_ALLWAYS_LOGGED_IN:', ALLWAYS_LOGGED_IN);
// console.log('VITE_ACTIVATON_CODE:', ACTIVATION_CODE);


import { agentsTeam1, agentsTeam2, agentsTeam3, agentsTeam4, agentsTeamFSI1} from '@/components/agents-definition';
import { Footer } from '@/components/Footer'

interface Agent {
  input_key: string;
  type: string;
  name: string;
  system_message: string;
  description: string;
  icon: string;
  index_name: string;
}
interface Team {
  teamId: string;
  name: string;
  agents: Agent[];
  description?: string;
}

export default function Agents() {


  const [isAuthenticated, setIsAuthenticated] = useState(BASE_URL)
  // const { userInfo } = useUserContext();
  
  const [agents, setAgents] = useState<Agent[]>([
    {
      input_key: "0001",
      type: "MagenticOne",
      name: "Coder",
      system_message: "",
      description: "",
      icon: "👨‍💻",
      index_name: ""
    },
    {
      input_key: "0002",
      type: "MagenticOne",
      name: "Executor",
      system_message: "",
      description: "",
      icon: "💻",
      index_name: ""
    },
    {
      input_key: "0003",
      type: "MagenticOne",
      name: "FileSurfer",
      system_message: "",
      description: "",
      icon: "📂",
      index_name: ""
    },
    {
      input_key: "0004",
      type: "MagenticOne",
      name: "WebSurfer",
      system_message: "",
      description: "",
      icon: "🏄‍♂️",
      index_name: ""
    }
  ]);
   // New states for teams and selected team
    const [teams] = useState<Team[]>([
      {
        teamId: 'team-1',
        name: 'MagenticOne Team',
        agents: agentsTeam1,
        description: 'Original MagenticOne Team. Includes Coder, Executor, FileSurfer and WebSurfer.'
      },
      {
        teamId: 'team-2',
        name: 'Team Predictive Maintenance',
        agents: agentsTeam2,
        description: 'Team focused on Predictive Maintenance tasks. Besides default agents includes RAG agent for Emerson Predictive Maintenance Guide and Sentinel Sentinel agent specialized in monitoring sensor streams and detecting trends or anomalies for particular device.'
      },
      {
        teamId: 'team-3',
        name: 'Team Safety & Incident Reporting',
        agents: agentsTeam3,
        description: 'Team focused on Safety & Incident Reporting tasks. Besides default agents includes RAG agent for BSEE Incident Reporting & HSE Compliance Guidelines 2024 and Compliance Sentinel agent, the watchdog for our incident reporting system at Well Site and Trend Analyzer agent, responsible for scrutinizing historical incident data to identify recurring patterns and underlying causes'
      },
      {
        teamId: 'team-4',
        name: 'Team Decision Support on Market Analysis',
        agents: agentsTeam4,
        description: 'Team helping with decision support on comprehensive, data-driven assessment of current market forecasts, commodity price trends, and OPEC announcements.'
      },
      {
        teamId: 'team-5',
        name: 'Team FSI - Loan Upsell',
        agents: agentsTeamFSI1,
        description: 'Team focused on Financial Services Industry tasks. Namely Loan upsell scenario by analyzing financial transaction data for our customer base, focusing on identifying customers with frequent overdrafts, recurring cash flow gaps, and rapid declines in account balances.'
      },
    ]);


  
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


  const addRAGAgent = (name: string, description: string, indexName: string) => {
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
  
  // // Helper functions to get avatar source and fallback
  // const getAvatarSrc = (user: string) => {
  //   switch (user.toLowerCase()) {
  //     case 'user':
  //       return h1;
  //     case 'magenticoneorchestrator':
  //       return lBrain;
  //     case 'coder':
  //       return lPen;
  //     case 'filesurfer':
  //       return lSearch;
  //     case 'websurfer':
  //       return lSearch;
  //     case 'ragagent':
  //       return lSearch;
  //     case 'executor':
  //       return lPen;
  //     case 'taskresult':
  //       return lAi;
  //     default:
  //       return 'https://example.com/default.png';
  //   }
  // };



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
                  <BreadcrumbPage>Library</BreadcrumbPage>
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
          <Separator  />
          {/* Agents setup */}
          {teams.map((team) => (
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
              {/* Chat Interface */}
              <Card className={`md:col-span-2 flex flex-col`}>
                <CardHeader>
                  <CardTitle>{team.name}</CardTitle>
                  <Separator />
                  <div className="space-x-2 container">
                    <p className="text-sm text-muted-foreground inline">{team.description}</p>
                </div>
                </CardHeader>
                <CardContent className="flex-1 h-96">
                  
                  <AgentsSetup
                  agents={team.agents}
                  removeAgent={removeAgent}
                  addAgent={addAgent}
                  addRAGAgent={addRAGAgent}
                  editAgent={editAgent}
                  getAvatarSrc={getAvatarSrc}
                  isCollapsed={false}
                  />
                </CardContent>
                <CardFooter className="flex space-x-2">
           
                </CardFooter>
              </Card>
  
              
            </div> 
          ))}
          
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            {/* Chat Interface */}
            <Card className={`md:col-span-2 flex flex-col`}>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 h-96">
                {/* <Separator className="my-2 invisible" /> */}
  
                <Button size="sm" variant="default" className="">
                  <Plus className="h-4 w-4" />
                  Create new team
                </Button>
                <Separator orientation="vertical" className="mr-2 h-4 invisible" />
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  Download team specification
                </Button>
                <Separator orientation="vertical" className="mr-2 h-4 invisible" />
                <Button variant="destructive" size="sm">
                  <Delete className="h-4 w-4" />
                  Delete team
                </Button>
              </CardContent>
              <CardFooter className="flex space-x-2">
         
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
