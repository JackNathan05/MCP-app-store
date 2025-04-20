
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar = ({ value, onChange }: Props) => (
  <div className="relative w-full max-w-xs mb-4">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      <Search size={18} />
    </span>
    <input
      type="text"
      className="w-full pl-9 pr-3 py-2 rounded-md bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none text-sm"
      placeholder="Search agents..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default SearchBar;

