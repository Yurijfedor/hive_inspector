import React, {createContext, useContext, useMemo, ReactNode} from 'react';
import {ConversationDriver} from './driver/conversationDriver';
import {EventBus} from './driver/eventBus';
import {ConversationEvent} from './driver/events';
import {LocalRuntimePersistence} from '../runtime/LocalRuntimePersistence';

const ConversationContext = createContext<ConversationDriver | null>(null);

type Props = {
  children: ReactNode;
  userId: string;
};

export function ConversationProvider({children, userId}: Props) {
  const driver = useMemo(() => {
    console.log('🧠 CREATE DRIVER');

    const bus = new EventBus<ConversationEvent>();
    const persistence = new LocalRuntimePersistence();

    return new ConversationDriver(bus, persistence, userId);
  }, [userId]);

  return (
    <ConversationContext.Provider value={driver}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const ctx = useContext(ConversationContext);

  console.log('📦 CONTEXT VALUE:', ctx);

  if (!ctx) {
    throw new Error('ConversationProvider missing');
  }

  return ctx;
}
