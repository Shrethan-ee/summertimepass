
import React from 'react';
import { Paper, Typography, Box, IconButton, Skeleton } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
  elevation?: number;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  children,
  loading = false,
  action,
  sx,
  elevation = 0,
}) => {
  return (
    <Paper
      elevation={elevation}
      sx={{
        p: 3,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '16px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
        },
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 600,
          }}
        >
          {loading ? <Skeleton width={120} /> : title}
        </Typography>
        {action && !loading && action}
      </Box>
      
      {loading ? (
        <Box>
          <Skeleton variant="rectangular" height={100} sx={{ mb: 1, borderRadius: 1 }} />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="60%" />
        </Box>
      ) : (
        children
      )}
    </Paper>
  );
};

export default DashboardWidget;
