
interface Props {
  tags: string[];
  activeTags: string[];
  onChange: (tag: string) => void;
}

const TagFilter = ({ tags, activeTags, onChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className={`px-3 py-1 rounded-full border
            text-xs font-medium transition
            ${activeTags.includes(tag)
              ? "bg-purple-600 text-white border-purple-700 shadow"
              : "bg-white border-gray-300 text-gray-600 hover:bg-purple-50 hover:border-purple-400"}
          `}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;

