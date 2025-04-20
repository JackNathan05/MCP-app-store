// MCP App Store Directory Page

import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import McpAgentCard, { McpAgent } from "@/components/McpAgentCard";
import TagFilter from "@/components/TagFilter";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { UserMenu } from "@/components/UserMenu";
import { Dashboard } from "lucide-react";

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
  // Add more agents here!
];

const ALL_TAGS = Array.from(
  new Set(AGENTS.flatMap(agent => agent.tags))
).sort();

export default function Index() {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user, loading } = useSupabaseAuth();

  const filteredAgents = useMemo(() => {
    let list = AGENTS;
    if (activeTags.length > 0) {
      list = list.filter(agent =>
        activeTags.every(tag => agent.tags.includes(tag))
      );
    }
    if (search) {
      const lq = search.toLowerCase();
      list = list.filter(
        agent =>
          agent.name.toLowerCase().includes(lq) ||
          agent.description.toLowerCase().includes(lq)
      );
    }
    return list;
  }, [search, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags(curr =>
      curr.includes(tag)
        ? curr.filter(t => t !== tag)
        : [...curr, tag]
    );
  };

  const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center">
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
          MCP App Store
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-2xl">
          Discover, deploy, and interact with open-source MCP agents. Browse by category, tag, or search!
        </p>
      </div>
      <div className="w-full max-w-5xl flex flex-col gap-2 items-center">
        <SearchBar value={search} onChange={setSearch} />
        <TagFilter tags={ALL_TAGS} activeTags={activeTags} onChange={toggleTag} />
      </div>
      <div className="w-full max-w-5xl grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
        {filteredAgents.length === 0 ? (
          <div className="col-span-full text-gray-500 text-center text-lg mt-8">
            No agents found.
          </div>
        ) : (
          filteredAgents.map(agent => (
            <div
              key={agent.name}
              className="cursor-pointer transition hover:scale-[1.02]"
              onClick={() => navigate(`/agent/${slugify(agent.name)}`)}
              tabIndex={0}
              role="button"
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/agent/${slugify(agent.name)}`);
                }
              }}
              aria-label={`View details for ${agent.name}`}
            >
              <McpAgentCard agent={agent} />
            </div>
          ))
        )}
      </div>
      <div className="fixed top-2 right-2 flex gap-2 items-center z-50">
        {!loading && user ? (
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard" className="flex items-center gap-1">
                <Dashboard className="w-4 h-4" /> Dashboard
              </Link>
            </Button>
            <UserMenu />
          </>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link to="/auth">Login / Sign Up</Link>
          </Button>
        )}
      </div>
      <footer className="mt-16 text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} MCP App Store — Open Source under MIT
      </footer>
    </div>
  );
}
