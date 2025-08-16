import { ForumService } from "@/customServices/forms.service";
import { useState } from "react";

interface Props {
    comment: any;
    onReply: any;
}

const CommentItem: React.FC<Props> = ({ comment, onReply }) => {
    const [replyText, setReplyText] = useState('');
    const [showReply, setShowReply] = useState(false);

    const handleReply = async () => {
        if (!replyText.trim()) return;
        try {
            const newReply = await ForumService.addComment(
                comment.topic_id,
                replyText.trim(),
                comment.id
            );
            onReply(newReply);
            setReplyText('');
            setShowReply(false);
        } catch (error) {
            console.error('Yanıt gönderilemedi:', error);
        }
    };

    return (
        <div className="border-b border-gray-700 pb-4 mb-4">
            <div className="flex items-start gap-3">
                <img
                    src={comment.user.avatar || '/default-avatar.png'}
                    className="w-8 h-8 rounded-full mt-1"
                    alt={comment.user.username}
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">@{comment.user.username}</span>
                        <span className="text-gray-500 text-sm">
                            {new Date(comment.created_at).toLocaleDateString('tr-TR')}
                        </span>
                    </div>
                    <p className="mt-1">{comment.content}</p>

                    <button
                        onClick={() => setShowReply(!showReply)}
                        className="text-orange-500 text-sm mt-2 hover:underline"
                    >
                        {showReply ? 'İptal' : 'Yanıtla'}
                    </button>

                    {showReply && (
                        <div className="mt-3">
                            <textarea
                                className="w-full bg-gray-700 text-white p-2 rounded-md text-sm"
                                rows={2}
                                placeholder="Yanıtınız..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <button
                                onClick={handleReply}
                                className="mt-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                                Gönder
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Yanıtlar */}
            {comment.replies?.length > 0 && (
                <div className="ml-10 mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                        <div key={reply.id} className="border-l-2 border-orange-500 pl-3">
                            <div className="flex items-center gap-2">
                                <img
                                    src={reply.user.avatar || '/default-avatar.png'}
                                    className="w-6 h-6 rounded-full"
                                    alt={reply.user.username}
                                />
                                <span className="text-sm font-medium">@{reply.user.username}</span>
                                <span className="text-gray-500 text-xs">
                                    {new Date(reply.created_at).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                            <p className="text-sm mt-1">{reply.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;