
-- Drop existing function if it exists
DROP FUNCTION IF EXISTS init_agent_upvotes();

CREATE OR REPLACE FUNCTION init_agent_upvotes()
RETURNS boolean AS $$
BEGIN
  -- Create table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.agent_upvotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, user_id)
  );

  -- Create index for better query performance
  CREATE INDEX IF NOT EXISTS idx_agent_upvotes_agent_id ON public.agent_upvotes(agent_id);

  -- Always return true on successful execution
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Execute the function once to ensure table exists
SELECT init_agent_upvotes();
