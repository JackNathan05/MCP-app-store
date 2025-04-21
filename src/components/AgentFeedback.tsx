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

  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        // First try to verify if table exists
        const { error: checkError } = await supabase
          .from('agent_upvotes')
          .select('*', { count: 'exact', head: true });

        if (checkError) {
          // If table doesn't exist, initialize it
          const { error: initError } = await supabase.rpc('init_agent_upvotes');
          if (initError) {
            throw new Error(`Failed to initialize database: ${initError.message}`);
          }

          // Verify again after initialization
          const { error: verifyError } = await supabase
            .from('agent_upvotes')
            .select('*', { count: 'exact', head: true });

          if (verifyError) {
            throw new Error(`Table verification failed after init: ${verifyError.message}`);
          }
        }

        setIsDbReady(true);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Database initialization error:', errorMessage);
        setIsDbReady(false);
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
          console.error('Delete upvote error:', error);
          throw new Error(error.message || 'Failed to remove upvote');
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
          console.error('Insert upvote error:', error);
          throw new Error(error.message || 'Failed to add upvote');
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
          disabled={isLoading || !user || !isDbReady}
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