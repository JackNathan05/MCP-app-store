
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
EXCEPTION 
  WHEN insufficient_privilege THEN
    -- Grant necessary permissions and try again
    EXECUTE 'GRANT USAGE ON SCHEMA public TO authenticated, anon';
    EXECUTE 'GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, anon';
    RETURN init_agent_upvotes();
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in init_agent_upvotes: %', SQLERRM;
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Execute the function once to ensure table exists
SELECT init_agent_upvotes();
