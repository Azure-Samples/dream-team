import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash, Plus, Edit, Download, Save, Loader2, Lock, Map, AudioWaveform, ChartNoAxesCombined, DollarSign, ShieldAlert, ShoppingBasket, Wrench, Soup, Volleyball, Gamepad2, Terminal } from 'lucide-react';
import { MonitorCog, Globe, File, BookMarked, Bot, Search, DatabaseZap } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTeamsContext, Agent, Team } from '@/contexts/TeamsContext';

// Icon options for selection (updated)
const iconOptions = [
  { value: 'Soup', label: 'Soup', icon: Soup },
  { value: 'Volleyball', label: 'Football', icon: Volleyball },
  { value: 'ChartNoAxesCombined', label: 'Market assessment', icon: ChartNoAxesCombined },
  { value: 'Wrench', label: 'Predictive Maintenance', icon: Wrench },
  { value: 'ShieldAlert', label: 'Safety', icon: ShieldAlert },
  { value: 'DollarSign', label: 'Loan Upsell', icon: DollarSign },
  { value: 'ShoppingBasket', label: 'Retail', icon: ShoppingBasket },
  { value: 'Gamepad2', label: 'Gaming', icon: Gamepad2 },
  { value: 'Terminal', label: 'Generate script', icon: Terminal },
  { value: 'AudioWaveform', label: 'Audio', icon: AudioWaveform },
  { value: 'Map', label: 'Map', icon: Map },
  { value: 'MonitorCog', label: 'Monitor', icon: MonitorCog },
  { value: 'Globe', label: 'Web', icon: Globe },
  { value: 'File', label: 'File', icon: File },
  { value: 'BookMarked', label: 'Bookmark', icon: BookMarked },
  { value: 'Bot', label: 'Bot', icon: Bot },
  { value: 'Search', label: 'Search', icon: Search },
  { value: 'DatabaseZap', label: 'DatabaseZap', icon: DatabaseZap },
];

interface AgentsSetupProps {
  team: Team;
  getAvatarSrc: (user: string) => string;
  isCollapsed: boolean;
  showDetails: boolean;
}

export function AgentsSetup({ team, isCollapsed, showDetails }: AgentsSetupProps) {
  const { addAgent, removeAgent, addRAGAgent, editAgent, saveTeam } = useTeamsContext();
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [hasTeamChanged, setHasTeamChanged] = useState<boolean>(false);
  const [isSavingTeam, setIsSavingTeam] = useState<boolean>(false);
  const [editingTaskIdx, setEditingTaskIdx] = useState<number | null>(null);
  const [editingTaskValue, setEditingTaskValue] = useState<string>('');
  const [editingTaskName, setEditingTaskName] = useState<string>('');
  const [editingTaskLogo, setEditingTaskLogo] = useState<string>('');
  const [creatingTask, setCreatingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPrompt, setNewTaskPrompt] = useState('');
  const [newTaskLogo, setNewTaskLogo] = useState('');
  const [newAgentIcon, setNewAgentIcon] = useState<string>(iconOptions[0]?.value || '');
  const [newRAGAgentIcon, setNewRAGAgentIcon] = useState<string>(iconOptions[0]?.value || '');

  // Handler to open dialog for editing a task
  const handleEditTask = (idx: number) => {
    setEditingTaskIdx(idx);
    setEditingTaskValue(team.starting_tasks[idx]?.prompt || '');
    setEditingTaskName(team.starting_tasks[idx]?.name || '');
    setEditingTaskLogo(team.starting_tasks[idx]?.logo || '');
  };

  // Handler to save the edited task (name, prompt, logo)
  const handleSaveTask = () => {
    if (editingTaskIdx !== null) {
      team.starting_tasks[editingTaskIdx] = {
        ...team.starting_tasks[editingTaskIdx],
        name: editingTaskName,
        prompt: editingTaskValue,
        logo: editingTaskLogo,
      };
      setHasTeamChanged(true);
    }
    setEditingTaskIdx(null);
    setEditingTaskValue('');
    setEditingTaskName('');
    setEditingTaskLogo('');
  };

  const handleCreateTask = () => {
    setCreatingTask(true);
    setNewTaskName('');
    setNewTaskPrompt('');
    setNewTaskLogo(iconOptions[0]?.value || '');
  };

  // Handler to save the new task (name, prompt, logo)
  const handleSaveNewTask = () => {
    const newTask = {
      id: crypto.randomUUID(),
      name: newTaskName,
      prompt: newTaskPrompt,
      created: new Date(),
      creator: team.created_by || 'unknown',
      logo: newTaskLogo,
    };
    team.starting_tasks.push(newTask);
    setHasTeamChanged(true);
    setCreatingTask(false);
    setNewTaskName('');
    setNewTaskPrompt('');
    setNewTaskLogo('');
  };

  return (
    <div className="space-y-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 text-sm items-center">
        <h2 className="flex items-center gap-2">
          {team.name}
          {team.protected && <Lock className="inline h-4 w-4 text-muted-foreground" />}
        </h2>
        {hasTeamChanged && !team.protected && (
          <Button variant="destructive" onClick={async () => { 
            setIsSavingTeam(true);
            await saveTeam(team);
            setHasTeamChanged(false);
            setIsSavingTeam(false);
          }}>
            <Save /> Update
          </Button>
        )}
      </div>
      
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        {team.agents.map((agent) => (
          <div key={agent.input_key} className={`rounded-xl bg-muted/50 shadow ${isCollapsed ? 'p-0 duration-300 animate-in fade-in-0 zoom-in-75 origin-bottom-right' : 'p-4'}`}>
            <div className="flex items-center space-x-2">
              <Avatar>
                {/* <AvatarImage src={getAvatarSrc(agent.name)} /> */}
                <AvatarFallback>
                  {iconOptions.find(opt => opt.value === agent.icon)
                        ? React.createElement(iconOptions.find(opt => opt.value === agent.icon)!.icon, { className: 'h-5 w-5' })
                        : null}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{agent.name}</p>
                {!isCollapsed && <p className="text-sm text-muted-foreground">{agent.type}</p>}
              </div>
            </div>
            {!isCollapsed  && (
              <>
                <Separator className="my-2" />
                <div className="flex space-x-2">
                  <Button size="icon" variant="outline" onClick={() => { removeAgent(team.team_id, agent.input_key); setHasTeamChanged(true); }}>
                    <Trash />
                  </Button>
                  {agent.type !== "MagenticOne" && (
                    <Button size="icon" variant="outline" onClick={() => setEditingAgent(agent)}>
                      <Edit />
                    </Button>
                  )}
                  <Button size="icon" variant="outline">
                    <Download />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}

        {!isCollapsed && (
          <div className="rounded-xl bg-muted/50 shadow p-4">
            {/* Add agent dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                  Add agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[80vw] max-h-[100vh]">
                <DialogHeader>
                  <DialogTitle>Add agent</DialogTitle>
                  <DialogDescription>
                    Note: Always use unique name with no spaces. Always fill System message and Description.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" defaultValue="MyAgent1" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea id="description" className="col-span-3" placeholder="Describe the agent capabilities so the orchestrator can use it." />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="system_message" className="text-right">System Message</Label>
                    <Textarea
                      id="system_message"
                      className="col-span-3 font-mono"
                      rows={10}
                      placeholder='In the system message use as last sentence: Reply "TERMINATE" in the end when everything is done.'
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Icon</Label>
                    <div className="col-span-3 flex flex-wrap gap-2 mt-1">
                      {iconOptions.map(opt => (
                        <Button
                          key={opt.value}
                          type="button"
                          variant={newAgentIcon === opt.value ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setNewAgentIcon(opt.value)}
                        >
                          {React.createElement(opt.icon, { className: 'h-5 w-5' })}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      onClick={() => {
                        const name = (document.getElementById('name') as HTMLInputElement).value;
                        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
                        const systemMessage = (document.getElementById('system_message') as HTMLTextAreaElement).value;
                        addAgent(team.team_id, name, description, systemMessage, newAgentIcon, 'Custom');
                        setHasTeamChanged(true);
                        setNewAgentIcon(iconOptions[0]?.value || '');
                      }}
                      variant="default"
                    >
                      Save & Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Separator className="my-4" />
            {/* Add MCP agent dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                  Add MCP agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[80vw] max-h-[100vh]">
                <DialogHeader>
                  <DialogTitle>Add MCP agent</DialogTitle>
                  <DialogDescription>
                    Note: Always use unique name with no spaces. Always fill System message and Description. MCP agents are used for Model Context Protocol tasks.
                  </DialogDescription>

                    <div className="mt-2 text-sm text-muted-foreground">
                      Currently supported tasks are:
                    <ul className="list-disc pl-4">
                      <li><code>data provider</code> - have access to /data folder and servers CSV files as data</li>
                      <li><code>mailer</code> - Sends an email using Azure Communication Services EmailClient.</li>

                    </ul>
                    </div>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mcp_name" className="text-right">Name</Label>
                    <Input id="mcp_name" defaultValue="MyMCPAgent1" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mcp_description" className="text-right">Description</Label>
                    <Textarea id="mcp_description" className="col-span-3" placeholder="Describe the MCP agent capabilities and its intended use." />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mcp_system_message" className="text-right">System Message</Label>
                    <Textarea
                      id="mcp_system_message"
                      className="col-span-3 font-mono"
                      rows={10}
                      placeholder='In the system message use as last sentence: Reply "TERMINATE" in the end when everything is done.'
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Icon</Label>
                    <div className="col-span-3 flex flex-wrap gap-2 mt-1">
                      {iconOptions.map(opt => (
                        <Button
                          key={opt.value}
                          type="button"
                          variant={newAgentIcon === opt.value ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setNewAgentIcon(opt.value)}
                        >
                          {React.createElement(opt.icon, { className: 'h-5 w-5' })}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      onClick={() => {
                        const name = (document.getElementById('mcp_name') as HTMLInputElement).value;
                        const description = (document.getElementById('mcp_description') as HTMLTextAreaElement).value;
                        const systemMessage = (document.getElementById('mcp_system_message') as HTMLTextAreaElement).value;
                        // Use the correct signature for addAgent (type is always 5 args)
                        // To distinguish MCP agent, set type to 'CustomMCP' in the agent object after creation
                        addAgent(team.team_id, name, description, systemMessage, newAgentIcon, 'CustomMCP');
                        setHasTeamChanged(true);
                        setNewAgentIcon(iconOptions[0]?.value || '');
                      }}
                      variant="default"
                    >
                      Save & Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Separator className="my-4" />
            {/* Add RAG agent dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                  Add RAG agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[80vw] max-h-[100vh]">
                <DialogHeader>
                  <DialogTitle>Add RAG agent</DialogTitle>
                  <DialogDescription>
                    <strong>Name</strong> Always use unique name with no spaces. 
                    <br />
                    <strong>Description</strong> is important! - always include what information could be found in the file so the Orchestrator.
                    <br />
                    <strong>Index name</strong> is the name of the index where the files will be indexed.
                    <br />
                    Indexing can take a while depending on the file size and number of files. After you submit the indexing starts.
                    
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" defaultValue="MyRAGAgent1" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea
                      id="description"
                      className="col-span-3"
                      defaultValue=""
                      placeholder="An agent that has access to internal index and can handle RAG tasks, call this agent if you are getting questions on your internal index namely about Contoso company Car policy."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="index_name" className="text-right">Index</Label>
                    <Input id="index_name" className="col-span-3" defaultValue="" placeholder="<your-index-name>" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="file_upload" className="text-right">Knowledge File</Label>
                    <Input
                      id="file_upload"
                      type="file"
                      multiple
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Icon</Label>
                    <div className="col-span-3 flex flex-wrap gap-2 mt-1">
                      {iconOptions.map(opt => (
                        <Button
                          key={opt.value}
                          type="button"
                          variant={newRAGAgentIcon === opt.value ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setNewRAGAgentIcon(opt.value)}
                        >
                          {React.createElement(opt.icon, { className: 'h-5 w-5' })}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      onClick={() => {
                        const name = (document.getElementById('name') as HTMLInputElement).value;
                        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
                        const indexName = (document.getElementById('index_name') as HTMLInputElement).value;
                        const files = (document.getElementById('file_upload') as HTMLInputElement).files;
                        addRAGAgent(team.team_id, name, description, indexName, files, newRAGAgentIcon);
                        setHasTeamChanged(true);
                        setNewRAGAgentIcon(iconOptions[0]?.value || '');
                      }}
                      variant="default"
                    >
                      Store and Index
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="mb-2">
          <Label className="flex items-center gap-2">
            Starting Tasks
            <Button
              size="icon"
              variant="outline"
              className="ml-2"
              onClick={handleCreateTask}
              disabled={team.protected}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </Label>
          <div className="flex flex-col gap-2">
            {team.starting_tasks && team.starting_tasks.length > 0 ? (
              team.starting_tasks.map((task, idx) => (
                <div key={task.id} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  {task.logo && (
                    <span className="flex items-center justify-center">
                      {iconOptions.find(opt => opt.value === task.logo)
                        ? React.createElement(iconOptions.find(opt => opt.value === task.logo)!.icon, { className: 'h-5 w-5' })
                        : null}
                    </span>
                  )}
                  <span className="flex-1 text-sm font-mono"><strong>{task.name}</strong>: {task.prompt}</span>
                  <Button size="icon" variant="outline" onClick={() => handleEditTask(idx)} disabled={team.protected}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => {
                    team.starting_tasks.splice(idx, 1);
                    setHasTeamChanged(true);
                  }} disabled={team.protected}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No starting tasks defined.</span>
            )}
          </div>
        </div>
      )}
      {/* Edit Starting Task Dialog */}
      {editingTaskIdx !== null && (
        <Dialog open={true} onOpenChange={(open) => { if (!open) setEditingTaskIdx(null); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Starting Task</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              {editingTaskLogo && (
                <span className="flex items-center justify-center">
                  {iconOptions.find(opt => opt.value === editingTaskLogo)
                    ? React.createElement(iconOptions.find(opt => opt.value === editingTaskLogo)!.icon, { className: 'h-6 w-6' })
                    : null}
                </span>
              )}
              <span className="font-semibold">Task ID: {team.starting_tasks[editingTaskIdx]?.id}</span>
            </div>
            <div className="mb-2">
              <Label htmlFor="edit-task-name">Task Name</Label>
              <Input
                id="edit-task-name"
                value={editingTaskName}
                onChange={e => setEditingTaskName(e.target.value)}
                className="font-mono"
                autoFocus
              />
            </div>
            <div className="mb-2">
              <Label htmlFor="edit-task-prompt">Prompt</Label>
              <Textarea
                id="edit-task-prompt"
                value={editingTaskValue}
                onChange={e => setEditingTaskValue(e.target.value)}
                rows={5}
                className="font-mono"
              />
            </div>
            <div className="mb-2">
              <Label htmlFor="edit-task-logo">Logo</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {iconOptions.map(opt => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={editingTaskLogo === opt.value ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setEditingTaskLogo(opt.value)}
                  >
                    {React.createElement(opt.icon, { className: 'h-5 w-5' })}
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter className="sm:justify-end mt-2">
              <Button onClick={handleSaveTask} variant="default">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {/* Create Starting Task Dialog */}
      {creatingTask && (
        <Dialog open={true} onOpenChange={(open) => { if (!open) setCreatingTask(false); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Starting Task</DialogTitle>
            </DialogHeader>
            <div className="mb-2">
              <Label htmlFor="new-task-name">Task Name</Label>
              <Input
                id="new-task-name"
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                className="font-mono"
                autoFocus
              />
            </div>
            <div className="mb-2">
              <Label htmlFor="new-task-prompt">Prompt</Label>
              <Textarea
                id="new-task-prompt"
                value={newTaskPrompt}
                onChange={e => setNewTaskPrompt(e.target.value)}
                rows={5}
                className="font-mono"
              />
            </div>
            <div className="mb-2">
              <Label htmlFor="new-task-logo">Logo</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {iconOptions.map(opt => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={newTaskLogo === opt.value ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setNewTaskLogo(opt.value)}
                  >
                    {React.createElement(opt.icon, { className: 'h-5 w-5' })}
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter className="sm:justify-end mt-2">
              <Button onClick={handleSaveNewTask} variant="default" disabled={!newTaskName || !newTaskPrompt}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {/* Edit Agent Dialog */}
      {editingAgent && (
        <Dialog open={true} onOpenChange={(open) => { if (!open) setEditingAgent(null); }}>
          <DialogContent className="max-w-[80vw] max-h-[100vh]">
            <DialogHeader>
              <DialogTitle>Edit agent</DialogTitle>
              <DialogDescription>
                Update the agent details below.
              </DialogDescription>
            </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="edit_name" className="text-right">Name</Label>
                    <Input id="edit_name" defaultValue={editingAgent.name} />
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="edit_description" className="text-right">Description</Label>
                    <Textarea id="edit_description" defaultValue={editingAgent.description} />
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                    <Label htmlFor="edit_system_message" className="text-right">System Message</Label>
                    <Textarea
                        id="edit_system_message"
                        defaultValue={`${editingAgent.system_message}`}
                        className="font-mono"
                        rows={10}
                    />
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <Label className="text-right">Icon</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {iconOptions.map(opt => (
                      <Button
                        key={opt.value}
                        type="button"
                        variant={editingAgent.icon === opt.value ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setEditingAgent({ ...editingAgent, icon: opt.value })}
                      >
                        {React.createElement(opt.icon, { className: 'h-5 w-5' })}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={() => {
                    const name = (document.getElementById('edit_name') as HTMLInputElement).value;
                    const description = (document.getElementById('edit_description') as HTMLTextAreaElement).value;
                    const systemMessage = (document.getElementById('edit_system_message') as HTMLTextAreaElement).value;
                    editAgent(team.team_id, editingAgent.input_key, name, description, systemMessage, editingAgent.icon);
                    setEditingAgent(null);
                    setHasTeamChanged(true);
                  }}
                  variant="default"
                >
                  Save & Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      
      {/* Progress Dialog for saving team */}
      {isSavingTeam && (
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Saving Team</DialogTitle>
            </DialogHeader>
            <div className="py-4">
            <Loader2 className="h-8 w-8 animate-spin" />  Team is being saved...
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}