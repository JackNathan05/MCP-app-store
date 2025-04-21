import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { Textarea } from "./ui/textarea";

interface AgentFeedbackProps {
  agentId: string;
}

export function AgentFeedback({ agentId }: AgentFeedbackProps) {
  const { user } = useSupabaseAuth();
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const initDb = async () => {
      try {
        // Create tables if they don't exist
        await supabase.from('agent_upvotes').select('*').limit(1).catch(async () => {
          const { error } = await supabase.from('agent_upvotes').insert([]);
          if (error?.code === '42P01') {
            await supabase.query(`
              CREATE TABLE IF NOT EXISTS agent_upvotes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                agent_id TEXT NOT NULL,
                user_id UUID NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(agent_id, user_id)
              );
              CREATE INDEX IF NOT EXISTS idx_agent_upvotes_agent_id ON agent_upvotes(agent_id);
            `);
          }
        });
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initDb();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!agentId) return;

      const { count } = await supabase
        .from('agent_upvotes')
        .select('*', { count: 'exact' })
        .eq('agent_id', agentId);

      setUpvotes(count || 0);

      if (user) {
        const { data } = await supabase
          .from('agent_upvotes')
          .select('*')
          .eq('agent_id', agentId)
          .eq('user_id', user.id)
          .single();

        setHasUpvoted(!!data);
      }
    };

    fetchData();
  }, [agentId, user]);

  const handleUpvote = async () => {
    if (!user || !agentId) return;

    try {
      setIsLoading(true);

      if (hasUpvoted) {
        const { error } = await supabase
          .from('agent_upvotes')
          .delete()
          .eq('agent_id', agentId)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        setUpvotes(prev => prev - 1);
        setHasUpvoted(false);
      } else {
        const { error } = await supabase
          .from('agent_upvotes')
          .insert([{
            agent_id: agentId,
            user_id: user.id
          }]);

        if (error) {
          throw error;
        }

        setUpvotes(prev => prev + 1);
        setHasUpvoted(true);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 
        (typeof error === 'object' && error !== null) ? JSON.stringify(error) : String(error);
      console.error('Error handling upvote:', errorMessage);
      
      // Show user-friendly error via toast or alert
      alert(`Failed to save upvote: ${errorMessage}`);
      // Revert optimistic update
      setUpvotes(prev => hasUpvoted ? prev + 1 : prev - 1);
      setHasUpvoted(!hasUpvoted);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async () => {
    if (!user || !comment.trim() || !agentId) return;

    try {
      const { error } = await supabase
        .from('agent_comments')
        .insert([{
          agent_id: agentId,
          user_id: user.id,
          content: comment.trim()
        }]);

      if (error) throw error;
      setComment("");
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUpvote}
          disabled={isLoading || !user}
        >
          <ThumbsUp
            size={16}
            className={hasUpvoted ? "mr-2 text-purple-600" : "mr-2"}
          />
          {upvotes}
        </Button>
        <div className="flex-1" />
      </div>
      {user && (
        <div className="space-y-2">
          <Textarea
            placeholder="Leave a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            size="sm"
            onClick={handleComment}
            disabled={!comment.trim()}
          >
            <MessageSquare size={16} className="mr-2" />
            Comment
          </Button>
        </div>
      )}
    </div>
  );
}