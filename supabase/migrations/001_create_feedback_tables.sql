
-- Create agent_upvotes table
CREATE TABLE IF NOT EXISTS agent_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agent_id, user_id)
);

-- Create agent_comments table
CREATE TABLE IF NOT EXISTS agent_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_upvotes_agent_id ON agent_upvotes(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_comments_agent_id ON agent_comments(agent_id);
