import { AudioWaveform, ChartNoAxesCombined, DollarSign, Map, ShieldAlert, ShoppingBasket, Wrench } from 'lucide-react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


export interface Agent {
  input_key: string;
  type: string;
  name: string;
  system_message: string;
  description: string;
  icon: string;
  index_name: string;
}

export interface TeamTask {
  id: string;
  name: string;
  prompt: string;
  created: Date;
  creator: string;
  logo?: string; // Optional logo attribute
}

export interface Team {
  id: string;
  team_id: string;
  name: string;
  agents: Agent[];
  description?: string;
  logo: string;
  icon?: string;
  plan: string;
  starting_tasks: TeamTask[];
  status?: string; // Optional status of the team
  protected?: boolean; // Optional flag for protection
  created?: Date; // Optional creation date
  created_by?: string; // Optional creator identifier
}

interface TeamsContextType {
  teams: Team[];
  loading: boolean;
  addAgent: (team_id: string, name: string, description: string, systemMessage: string, icon: string, type?: string) => void;
  addRAGAgent: (
    team_id: string,
    name: string,
    description: string,
    indexName: string,
    files?: FileList | null,
    icon?: string // <-- add icon param (optional for backward compatibility)
  ) => Promise<void>;
  editAgent: (team_id: string, inputKey: string, name: string, description: string, systemMessage: string, icon: string) => void;
  removeAgent: (team_id: string, inputKey: string) => void;
  reloadTeams: () => Promise<void>;
  saveTeam: (team: Team) => Promise<void>; // <-- new function
}

const TeamsContext = createContext<TeamsContextType>({} as TeamsContextType);

export const getTeamLogo = (team: Team): React.ElementType => {
  if (team && team.logo && Object.keys(team.logo).length > 0) {
    switch (team.logo) {
      case 'Map':
        return Map;
      case 'AudioWaveform':
        return AudioWaveform;
      case 'ChartNoAxesCombined':
        return ChartNoAxesCombined;
      case 'DollarSign':
        return DollarSign;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'ShoppingBasket':
        return ShoppingBasket;
      default:
        return Wrench; // Default logo
    }
  }
  else{
    return Wrench;
  }
}

// Define environment variables with default values
const BASE_URL = import.meta.env.VITE_BASE_URL;
const ALLWAYS_LOGGED_IN =
  import.meta.env.VITE_ALLWAYS_LOGGED_IN === "true" ? true : false;

console.log('BASE_URL:', BASE_URL);
console.log('ALLWAYS_LOGGED_IN:', ALLWAYS_LOGGED_IN);

export const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "https://autogen-demo-be2.whiteground-dbb1b0b8.eastus.azurecontainerapps.io";

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Move fetchTeams out so we can reuse it.
  const fetchTeams = async () => {
    setLoading(true);
    console.log("Fetching teams from API...");
    try {
      const response = await axios.get(`${BASE_URL}/teams`);
      const data: Team[] = response.data;
      const initializedTeams: Team[] = data.map((team) => ({
        id: team.id,
        team_id: team.team_id,
        name: team.name,
        agents: team.agents || [],
        description: team.description,
        logo: team.logo,
        icon: team.icon,
        plan: team.plan || "Free",
        starting_tasks: team.starting_tasks
          ? team.starting_tasks.map((task: any) => ({
              id: task.id,
              name: task.name,
              prompt: task.prompt,
              created: new Date(task.created),
              creator: task.creator,
              logo: task.logo,
            }))
          : [],
        status: team.status,
        protected: typeof team.protected === 'string' ? team.protected === 'true' : !!team.protected,
        created: team.created ? new Date(team.created) : undefined,
        created_by: team.created_by,
      }));
      setTeams(initializedTeams);
      // console.log("Fetched teams:", initializedTeams);
      // console.log("Writing teams to sessionStorage:", initializedTeams);
      // Write teams to sessionStorage.
      sessionStorage.setItem('teams', JSON.stringify(initializedTeams));
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  // On initial load, load from session or fetch teams.
  useEffect(() => {
    const storedTeams = sessionStorage.getItem('teams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
      setLoading(false);
    } else {
      console.log("No teams in sessionStorage, fetching from API...");
      fetchTeams();
    }
  }, []);

  // New explicit reload function.
  const reloadTeams = async () => {
    setLoading(true);
    await fetchTeams();
  };

  const saveTeam = async (team: Team): Promise<void> => {
    try {
      await axios.put(`${BASE_URL}/teams/${team.team_id}`, team);
      await reloadTeams();
    } catch (error) {
      console.error("Error saving team:", error);
    }
  };

  const addAgent = (team_id: string, name: string, description: string, systemMessage: string, icon: string, type: string = 'Custom') => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.team_id !== team_id) return t;
        // Generate a new input_key as random GUID
        const newInputKey = crypto.randomUUID();
        const newAgent: Agent = {
          input_key: newInputKey,
          type,
          name,
          system_message: systemMessage,
          description,
          icon,
          index_name: '',
        };
        return { ...t, agents: [...t.agents, newAgent] };
      })
    );
  };

  const editAgent = (team_id: string, inputKey: string, name: string, description: string, systemMessage: string, icon: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.team_id !== team_id) return t;
        const updatedAgents = t.agents.map((agent) =>
          agent.input_key === inputKey
            ? { ...agent, name, description, system_message: systemMessage, icon }
            : agent
        );
        return { ...t, agents: updatedAgents };
      })
    );
  };

  const addRAGAgent = async (
    team_id: string,
    name: string,
    description: string,
    indexName: string,
    files?: FileList | null,
    icon: string = "🤖"
  ): Promise<void> => {
    const team = teams.find((team) => team.team_id === team_id);
    if (!team) {
      console.error(`Team with ID ${team_id} not found.`);
      return;
    }
    if (files && files.length > 0) {
      const temporaryRandomName = Math.random().toString(36).substring(2, 15);
      const newAgent = {
        input_key: temporaryRandomName,
        type: "temporary",
        name: "Processing & Uploading...",
        system_message: "",
        description,
        icon: icon || "⌛",
        index_name: indexName
      };
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.team_id === team_id
            ? { ...team, agents: [...team.agents, newAgent] }
            : team
        )
      );

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
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.team_id === team_id
              ? { ...team, agents: team.agents.filter((agent) => agent.input_key !== temporaryRandomName) }
              : team
          )
        );
      }
    }
    // Add the actual RAG agent
    const newAgent = {
      input_key: (team.agents.length + 1).toString().padStart(4, '0'),
      type: "RAG",
      name,
      system_message: "",
      description,
      icon: icon || "🤖",
      index_name: indexName
    };
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.team_id === team_id
          ? { ...team, agents: [...team.agents, newAgent] }
          : team
      )
    );
  };

  const removeAgent = (team_id: string, inputKey: string) => {
    console.log("removeAgent", team_id, inputKey);
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.team_id === team_id
          ? { ...team, agents: team.agents.filter((agent) => agent.input_key !== inputKey) }
          : team
      )
    );
  };

  return (
    <TeamsContext.Provider value={{ teams, loading, addAgent, addRAGAgent, editAgent, removeAgent, reloadTeams, saveTeam }}>
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeamsContext = () => useContext(TeamsContext);
