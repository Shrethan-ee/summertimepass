
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Box,
  Tooltip,
  Button,
  Collapse,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface IdeaCardProps {
  idea: {
    id: number;
    title: string;
    description: string;
    category: string;
    user: {
      username: string;
      avatar?: string;
    };
    likes: number;
    comments: number;
    isLiked?: boolean;
    trending?: boolean;
  };
  onLike?: (id: number) => void;
  onComment?: (id: number) => void;
  onShare?: (id: number) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onLike, onComment, onShare }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(idea.isLiked || false);
  const [likeCount, setLikeCount] = useState(idea.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onLike?.(idea.id);
  };

  return (
    <Card
      sx={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '16px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 25px 50px rgba(99, 102, 241, 0.2)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
        },
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {idea.trending && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            background: 'linear-gradient(135deg, #ec4899, #f97316)',
            borderRadius: '50%',
            p: 1,
            zIndex: 1,
          }}
        >
          <TrendingUpIcon sx={{ color: 'white', fontSize: 16 }} />
        </Box>
      )}

      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={idea.user.avatar}
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            }}
          >
            {idea.user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
            {idea.user.username}
          </Typography>
          <Chip
            label={idea.category}
            size="small"
            sx={{
              ml: 'auto',
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#a855f7',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          />
        </Box>

        <Typography
          variant="h6"
          sx={{
            mb: 1,
            background: 'linear-gradient(135deg, #f8fafc, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 600,
          }}
        >
          {idea.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#94a3b8',
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'none' : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {idea.description}
        </Typography>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Additional details about this innovative idea would appear here when expanded.
            </Typography>
          </Box>
        </Collapse>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={liked ? 'Unlike' : 'Like'}>
            <IconButton
              onClick={handleLike}
              sx={{
                color: liked ? '#ec4899' : '#64748b',
                '&:hover': { color: '#ec4899' },
              }}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ color: '#94a3b8', alignSelf: 'center' }}>
            {likeCount}
          </Typography>

          <Tooltip title="Comments">
            <IconButton
              onClick={() => onComment?.(idea.id)}
              sx={{ color: '#64748b', '&:hover': { color: '#6366f1' } }}
            >
              <CommentIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ color: '#94a3b8', alignSelf: 'center' }}>
            {idea.comments}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Share">
            <IconButton
              onClick={() => onShare?.(idea.id)}
              sx={{ color: '#64748b', '&:hover': { color: '#10b981' } }}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={expanded ? 'Show less' : 'Show more'}>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                color: '#64748b',
                '&:hover': { color: '#6366f1' },
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default IdeaCard;
