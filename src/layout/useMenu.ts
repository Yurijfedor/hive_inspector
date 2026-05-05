import {useState} from 'react';

export const useMenu = () => {
  const [isOpen, setOpen] = useState(false);

  return {
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
  };
};
