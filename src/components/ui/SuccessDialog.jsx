import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react'; // Иконка для успешного сообщения

const SuccessDialog = ({ message, isOpen, onClose, autoCloseDelay = 3000 }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Устанавливаем таймер для автоматического закрытия
      timerRef.current = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
    }

    // Очистка таймера при размонтировании или закрытии диалога
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, onClose, autoCloseDelay]);

  const handleClose = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}> {/* onOpenChange для закрытия по Esc или клику вне */}
      <DialogContent className="sm:max-w-[425px] text-center">
        <DialogHeader className="flex flex-col items-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" /> {/* Иконка успеха */}
          <DialogTitle className="text-2xl font-bold">Успех!</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-lg text-gray-700">{message}</p>
        </div>
        <DialogFooter className="flex justify-center">
          <Button onClick={handleClose}>ОК</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;

