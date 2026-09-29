import React from 'react';
import { useApp } from '../../context/AppContext';

export const ScreenReaderAnnouncer: React.FC = () => {
  const { announcement } = useApp();

  return (
    <div className="sr-only" aria-hidden="false">
      {announcement?.priority === 'assertive' ? (
        <div aria-live="assertive" aria-atomic="true">
          {announcement.message}
        </div>
      ) : (
        <div aria-live="polite" aria-atomic="true">
          {announcement?.message}
        </div>
      )}
    </div>
  );
};
