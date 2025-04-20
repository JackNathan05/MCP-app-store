
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface Comment {
  id: string;
  user_email: string;
  content: string;
  created_at: string;
}

export function AgentFeedback({ agentId }: { agentId: string }) {
  const { user, supabase } = useSupabaseAuth();
  const [upvotes, setUpvotes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('agent_upvotes')
      .upsert([{ agent_id: agentId, user_id: user.id }]);

    if (!error) {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
    }
  };

  const handleComment = async () => {
    if (!user || !newComment.trim()) return;

    const { error } = await supabase
      .from('agent_comments')
      .insert([{
        agent_id: agentId,
        user_id: user.id,
        content: newComment.trim()
      }]);

    if (!error) {
      setComments(prev => [...prev, {
        id: Date.now().toString(),
        user_email: user.email || '',
        content: newComment,
        created_at: new Date().toISOString()
      }]);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleUpvote}
          disabled={!user || hasUpvoted}
        >
          <ThumbsUp className={`w-4 h-4 mr-2 ${hasUpvoted ? 'text-blue-500' : ''}`} />
          {upvotes} Upvotes
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Comments</h3>
        {user ? (
          <div className="space-y-2">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleComment}>Post Comment</Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sign in to leave a comment</p>
        )}

        <div className="space-y-4 mt-4">
          {comments.map(comment => (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{comment.user_email}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
