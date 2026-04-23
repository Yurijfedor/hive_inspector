import React, {createContext, useContext, useMemo, ReactNode} from 'react';
import {ConversationDriver} from './driver/conversationDriver';
import {EventBus} from './driver/eventBus';
import {ConversationEvent} from './driver/events';
import {LocalRuntimePersistence} from '../runtime/LocalRuntimePersistence';
import {useAuth} from '../auth/AuthProvider';

const ConversationContext = createContext<ConversationDriver | null>(null);

type Props = {
  children: ReactNode;
};

export function ConversationProvider({children}: Props) {
  const {user} = useAuth();

  const driver = useMemo(() => {
    if (!user?.uid) {
      console.log('⏳ WAITING FOR USER...');
      return null;
    }

    console.log('🧠 CREATE DRIVER for UID:', user.uid);

    const bus = new EventBus<ConversationEvent>();
    const persistence = new LocalRuntimePersistence();

    return new ConversationDriver(bus, persistence, user.uid);
  }, [user?.uid]);

  if (!driver) {
    return null; // або Loader
  }

  return (
    <ConversationContext.Provider value={driver}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const ctx = useContext(ConversationContext);

  if (!ctx) {
    throw new Error('ConversationProvider missing');
  }

  return ctx;
}
