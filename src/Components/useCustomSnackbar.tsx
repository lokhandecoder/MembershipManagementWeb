import { useState } from 'react';

type Severity = 'success' | 'error' | 'warning' | 'info';

type Position = {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
};

const useCustomSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<Severity>('success');
  const [position, setPosition] = useState<Position>({ vertical: 'top', horizontal: 'right' });
  const [duration, setDuration] = useState(6000);

  const handleSnackbarClose = () => {
    setOpen(false);
  };

  const showSnackbar = (newMessage: string, newSeverity: Severity, newPosition: Position, newDuration: number) => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setPosition(newPosition);
    setDuration(newDuration);
    setOpen(true);
  };

  return {
    open,
    message,
    severity,
    handleSnackbarClose,
    showSnackbar,
    position,
    duration,
  };
};

export default useCustomSnackbar;