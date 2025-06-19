
import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, AlertColor, Slide, SlideProps } from '@mui/material';

interface Notification {
  id: string;
  message: string;
  type: AlertColor;
  duration?: number;
}

interface NotificationToastProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onRemove }) => {
  return (
    <>
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration || 6000}
          onClose={() => onRemove(notification.id)}
          TransitionComponent={SlideTransition}
          sx={{
            bottom: { xs: 16 + (index * 70), sm: 24 + (index * 70) },
            '& .MuiAlert-root': {
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
            }
          }}
        >
          <Alert
            onClose={() => onRemove(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{
              '& .MuiAlert-icon': {
                color: '#6366f1'
              }
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationToast;
