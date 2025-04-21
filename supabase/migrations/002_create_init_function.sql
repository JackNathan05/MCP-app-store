
-- Drop existing function if it exists
DROP FUNCTION IF EXISTS init_agent_upvotes();

CREATE OR REPLACE FUNCTION init_agent_upvotes()
RETURNS boolean AS $$
BEGIN
  -- First ensure we have schema usage permission
  EXECUTE 'GRANT USAGE ON SCHEMA public TO authenticated, anon, service_role';
  
  -- Create table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.agent_upvotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, user_id)
  );

  -- Grant necessary table permissions
  EXECUTE 'GRANT ALL ON TABLE public.agent_upvotes TO authenticated, anon, service_role';
  
  -- Create index for better query performance
  CREATE INDEX IF NOT EXISTS idx_agent_upvotes_agent_id ON public.agent_upvotes(agent_id);

  -- Return a row to ensure proper confirmation
  RETURN true;
EXCEPTION 
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Insufficient privileges, attempting to grant permissions...';
    EXECUTE 'GRANT ALL ON SCHEMA public TO postgres, authenticated, anon, service_role';
    EXECUTE 'GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated, anon, service_role';
    RETURN init_agent_upvotes(); -- Retry after granting permissions
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in init_agent_upvotes: %', SQLERRM;
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function and ensure we get a result
DO $$ 
BEGIN
  IF NOT (SELECT init_agent_upvotes()) THEN
    RAISE EXCEPTION 'Failed to initialize agent_upvotes';
  END IF;
END $$;
$$ LANGUAGE plpgsql;

-- Execute the function once to ensure table exists
SELECT init_agent_upvotes();
