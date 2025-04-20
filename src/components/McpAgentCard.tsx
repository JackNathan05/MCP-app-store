
import { Star, User, LogIn, Github } from "lucide-react";
import DeployDropdown from "./DeployDropdown";

type McpAgent = {
  name: string;
  description: string;
  tags: string[];
  stars: number;
  lastUpdated: string;
  author: string;
  github: string;
  demoVideo?: string;
  readme?: string;
};

interface Props {
  agent: McpAgent;
}

const McpAgentCard = ({ agent }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow group hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
      <div className="p-4 grow flex flex-col">
        <div className="flex items-center mb-2 gap-2">
          <div className="font-bold text-lg text-gray-900 group-hover:text-purple-700 transition">
            {agent.name}
          </div>
          <a
            href={agent.github}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-gray-400 hover:text-gray-600"
            title="View on GitHub"
          >
            <Github size={18} />
          </a>
        </div>
        <div className="text-gray-600 text-sm mb-2 line-clamp-3">{agent.description}</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {agent.tags.map(tag => (
            <span
              key={tag}
              className="bg-purple-50 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3 text-xs text-gray-500 mt-auto">
          <span className="flex items-center gap-1">
            <Star className="text-yellow-400" size={16} /> {agent.stars}
          </span>
          <span className="flex items-center gap-1">
            <User size={14} /> {agent.author}
          </span>
          <span className="flex items-center gap-1">
            <LogIn size={14} /> {agent.lastUpdated}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-100 p-3 flex gap-2">
        <DeployDropdown github={agent.github} />
      </div>
    </div>
  );
};

export type { McpAgent };
export default McpAgentCard;
