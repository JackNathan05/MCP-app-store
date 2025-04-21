
DROP FUNCTION IF EXISTS init_agent_upvotes();

CREATE OR REPLACE FUNCTION init_agent_upvotes()
RETURNS boolean AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'agent_upvotes') THEN
    CREATE TABLE public.agent_upvotes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      agent_id TEXT NOT NULL,
      user_id UUID NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(agent_id, user_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_agent_upvotes_agent_id ON public.agent_upvotes(agent_id);
  END IF;
  RETURN true;
EXCEPTION 
  WHEN others THEN
    RAISE NOTICE 'Error creating agent_upvotes: %', SQLERRM;
    RETURN false;
END;
$$ LANGUAGE plpgsql;
