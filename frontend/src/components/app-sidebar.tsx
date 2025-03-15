import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChartNoAxesCombined,
  DollarSign,
  Frame,
  Map,
  PieChart,
  Settings2,
  ShieldAlert,
  ShoppingBasket,
  SquareTerminal,
  Wrench,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useUserContext } from "@/contexts/UserContext"
import h1 from '@/assets/h1.png'

import { agentsTeam1, agentsTeam2, agentsTeam3, agentsTeam4, agentsTeamFSI1, agentsTeamRetail1 } from '@/components/agents-definition';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onTeamSelect: (team: { teamId: string; agents: any[] }) => void;
  // Removed onUserNameChange prop
}

const data = {
  user: {
    name: "Jon Doe",
    email: "johne@microsoft.com",
    avatar: h1,
  },
  teams: [
    {
      teamId: "team-1",
      name: "MagenticOne",
      logo: AudioWaveform,
      plan: "Original MagenticOne Team",
      agents: agentsTeam1,
    },
    {
      teamId: "team-2",
      name: "Oil & Gas - Predictive Maintenance",
      logo: Wrench,
      plan: "Team focused on Predictive Maintenance tasks",
      agents: agentsTeam2,
    },
    {
      teamId: "team-3",
      name: "Oil & Gas - Safety Compliance",
      logo: ShieldAlert,
      plan: "Team analyzing Safety & Incident Reporting",
      agents: agentsTeam3,
    },
    {
      teamId: "team-4",
      name: "Oil & Gas - Investment research",
      logo: ChartNoAxesCombined,
      plan: "Decision support team through comprehensive, data-driven assessments...",
      agents: agentsTeam4,
    },
    {
      teamId: "team-5",
      name: "FSI - Banking Loan Upsell",
      logo: DollarSign,
      plan: "Loan upsell scenario by analyzing financial transaction ",
      agents: agentsTeamFSI1,
    },
    {
      teamId: "team-6",
      name: "Retail	- Inventory optimization",
      logo: ShoppingBasket,
      plan: "Inventory analysis.",
      agents: agentsTeamRetail1,
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Chat", url: "/" },
        { title: "History", url: "/playground-history" },
      ],
    },
    {
      title: "Agent Teams",
      url: "/agents",
      icon: Bot,
      isActive: true,
      items: [{ title: "Library", url: "/agents" }],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map },
  ],
}

export function AppSidebar({
  onTeamSelect,
  ...sidebarProps
}: AppSidebarProps) {
  const { userInfo } = useUserContext();
  
  // Removed the useEffect for onUserNameChange

  return (
    <Sidebar collapsible="icon" {...sidebarProps}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} onTeamSelect={onTeamSelect} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
}