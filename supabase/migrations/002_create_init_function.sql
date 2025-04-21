
CREATE OR REPLACE FUNCTION init_agent_upvotes()
RETURNS void AS $$
BEGIN
  BEGIN
    CREATE TABLE IF NOT EXISTS public.agent_upvotes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      agent_id TEXT NOT NULL,
      user_id UUID NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(agent_id, user_id)
    );
  
    CREATE INDEX IF NOT EXISTS idx_agent_upvotes_agent_id ON public.agent_upvotes(agent_id);
  EXCEPTION 
    WHEN others THEN
      RAISE NOTICE 'Error creating table: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql;
