
-- Drop existing function if it exists
DROP FUNCTION IF EXISTS init_agent_upvotes();

CREATE OR REPLACE FUNCTION init_agent_upvotes()
RETURNS boolean AS $$
DECLARE
  table_exists boolean;
BEGIN
  -- Check if table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'agent_upvotes'
  ) INTO table_exists;

  -- Create table if it doesn't exist
  IF NOT table_exists THEN
    CREATE TABLE public.agent_upvotes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      agent_id TEXT NOT NULL,
      user_id UUID NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(agent_id, user_id)
    );
    
    -- Create index for better query performance
    CREATE INDEX IF NOT EXISTS idx_agent_upvotes_agent_id ON public.agent_upvotes(agent_id);
  END IF;

  RETURN true;
EXCEPTION 
  WHEN others THEN
    RAISE NOTICE 'Error in init_agent_upvotes: %', SQLERRM;
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Execute the function immediately
SELECT init_agent_upvotes();
