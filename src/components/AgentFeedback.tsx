
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

interface Comment {
  id: string;
  user_email: string;
  content: string;
  created_at: string;
}

interface AgentFeedbackProps {
  agentId: string;
}

export function AgentFeedback({ agentId }: AgentFeedbackProps) {
  const { user } = useSupabaseAuth();
  const [upvotes, setUpvotes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !agentId) return;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data: upvoteData } = await supabase
          .from('agent_upvotes')
          .select('*')
          .eq('agent_id', agentId);
      
        if (upvoteData) {
          setUpvotes(upvoteData.length);
          setHasUpvoted(upvoteData.some(vote => vote.user_id === user.id));
        }

        const { data: commentData } = await supabase
          .from('agent_comments')
          .select('*')
          .eq('agent_id', agentId)
          .order('created_at', { ascending: false });

        if (commentData) {
          setComments(commentData.map(comment => ({
            id: comment.id,
            user_email: comment.user_id,
            content: comment.content,
            created_at: comment.created_at
          })));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, agentId]);

  const handleUpvote = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      if (hasUpvoted) {
        const { error } = await supabase
          .from('agent_upvotes')
          .delete()
          .eq('agent_id', agentId)
          .eq('user_id', user.id);

        if (!error) {
          setUpvotes(prev => prev - 1);
          setHasUpvoted(false);
        }
      } else {
        const { error } = await supabase
          .from('agent_upvotes')
          .insert([{ agent_id: agentId, user_id: user.id }]);

        if (!error) {
          setUpvotes(prev => prev + 1);
          setHasUpvoted(true);
        }
      }
    } catch (error) {
      console.error('Error handling upvote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('agent_comments')
        .insert([{
          agent_id: agentId,
          user_id: user.id,
          content: newComment.trim()
        }])
        .select()
        .single();

      if (!error && data) {
        setComments(prev => [...prev, {
          id: data.id,
          user_email: user.email || '',
          content: data.content,
          created_at: data.created_at
        }]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="text-sm text-gray-500">Please sign in to leave feedback</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          onClick={handleUpvote} 
          disabled={isLoading}
          variant={hasUpvoted ? "secondary" : "outline"}
        >
          {hasUpvoted ? '★ Upvoted' : '☆ Upvote'} ({upvotes})
        </Button>
      </div>
      
      <div className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment..."
          className="min-h-[100px]"
        />
        <Button onClick={handleComment} disabled={isLoading}>Post Comment</Button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded p-3">
            <div className="text-sm text-gray-500 mb-1">{comment.user_email}</div>
            <div>{comment.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
