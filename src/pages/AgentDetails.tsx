
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Video } from "lucide-react";
import DeployDropdown from "@/components/DeployDropdown";
import { McpAgent } from "@/components/McpAgentCard";
import { AgentFeedback } from "@/components/AgentFeedback";

const slugify = (text: string) => {
  return text.toLowerCase().replace(/\s+/g, "-");
};

// Use the same static AGENTS array as on index
const AGENTS: McpAgent[] = [
  {
    name: "GitHub Issue Summarizer",
    description: "Summarizes GitHub issues and PRs with AI. Supports all public repos, instant summaries via MCP API.",
    tags: ["productivity", "automation", "Node"],
    stars: 118,
    lastUpdated: "2024-04-08",
    author: "alice",
    github: "https://github.com/alice/github-issue-summarizer-mcp",
  },
  {
    name: "OpenAI Chat Proxy",
    description: "Wraps OpenAI GPT API as a compliant MCP agent for easy integration. Caching & auto-retry included.",
    tags: ["dev tools", "Python"],
    stars: 87,
    lastUpdated: "2024-04-09",
    author: "bob",
    github: "https://github.com/bob/openai-mcp-agent",
  },
  {
    name: "Calendar Linker",
    description: "Integrates calendar events with MCP workflows, trigger workflows from meetings.",
    tags: ["automation", "productivity", "Go"],
    stars: 55,
    lastUpdated: "2024-03-31",
    author: "eve",
    github: "https://github.com/eve/calendar-linker-mcp",
  },
  {
    name: "Voice Note Transcriber",
    description: "Transcribe voice notes and messages on the fly with high accuracy. MCP-compatible API.",
    tags: ["education", "automation", "Python"],
    stars: 66,
    lastUpdated: "2024-03-28",
    author: "charlie",
    github: "https://github.com/charlie/voice-transcribe-mcp",
  },
  {
    name: "Slack Automator",
    description: "Automate Slack notifications with MCP triggers and custom workflows. Easy integration with Python.",
    tags: ["dev tools", "automation", "Python"],
    stars: 42,
    lastUpdated: "2024-04-03",
    author: "denise",
    github: "https://github.com/denise/slack-automator-mcp",
  },
];

const getAgentByName = (name: string | undefined) => {
  if (!name) return undefined;
  return AGENTS.find(
    (agent) =>
      agent.name.toLowerCase().replace(/\s+/g, "-") === name.toLowerCase()
  );
};

const AgentDetails = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const agent = getAgentByName(name);

  if (!agent) {
    return (
      <div className="p-10 text-center">
        <button
          className="inline-flex gap-2 mb-4 items-center text-purple-700 hover:underline"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back to MCP App Store
        </button>
        <h1 className="text-2xl font-semibold mb-2">Agent Not Found</h1>
        <p className="text-gray-600">The agent you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <button
          className="inline-flex gap-2 mb-4 items-center text-purple-700 hover:underline"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back to MCP App Store
        </button>
        <div className="bg-white rounded-xl shadow px-8 py-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col gap-3 items-center">
              {/* Agent preview image placeholder */}
              <img
                src={`https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=250&q=80`}
                alt={agent.name}
                className="w-full rounded-md mb-2 object-cover max-h-40"
              />
              <DeployDropdown github={agent.github} />
            </div>
            <div className="md:w-2/3 flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
              <p className="text-gray-600 mb-2">{agent.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {agent.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-purple-50 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-x-4 text-xs text-gray-500 mb-2">
                <span>
                  <span className="font-semibold">Author:</span> {agent.author}
                </span>
                <span>
                  <span className="font-semibold">GitHub:</span>{" "}
                  <a href={agent.github} className="hover:underline text-purple-700" target="_blank" rel="noopener noreferrer">
                    {agent.github}
                  </a>
                </span>
                <span>
                  <span className="font-semibold">Last Updated:</span> {agent.lastUpdated}
                </span>
                <span>
                  <span className="font-semibold">Stars:</span> {agent.stars}
                </span>
              </div>
              {/* Demo video & README action buttons */}
              <div className="flex gap-4 mt-2">
                <button
                  className="inline-flex items-center gap-1 text-purple-700 hover:underline"
                  title="README Preview"
                  disabled
                >
                  <FileText size={18} /> README
                </button>
                <button
                  className="inline-flex items-center gap-1 text-purple-700 hover:underline"
                  title="Demo video"
                  disabled
                >
                  <Video size={18} /> Demo Video
                </button>
              </div>
            </div>
          </div>
          {/* Placeholder README section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FileText size={18} /> README Preview
            </h2>
            <p className="text-gray-600 text-sm">
              README preview or content will be shown here.
            </p>
          </div>
        </div>
      <div className="mt-8">
          <AgentFeedback agentId={slugify(agent.name)} />
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
