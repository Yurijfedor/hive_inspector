import React, {useEffect, useState} from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {
  getVoiceUiState,
  subscribeVoiceUiState,
} from '../../state/voiceUiStateMachine';

import {VoiceUiState} from '../../state/voiceUiState';

type Props = {
  visible: boolean;
  onStop?: () => void;
};

export function VoiceInspectionOverlay({visible, onStop}: Props) {
  const [state, setState] = useState<VoiceUiState>(getVoiceUiState());

  useEffect(() => {
    return subscribeVoiceUiState(setState);
  }, []);

  const renderStatus = () => {
    switch (state.type) {
      case 'WAKE_WORD':
        return '🐝 Waiting for wake word';

      case 'QUESTION':
        return state.text;

      case 'LISTENING':
        return '🎤 Listening...';

      case 'PROCESSING':
        return '🧠 Processing...';

      case 'ERROR':
        return `❌ ${state.message}`;

      // case 'PROGRESS':
      //   return `📋 ${state.current}/${state.total}`;

      default:
        return '';
    }
  };

  return (
    <Modal visible={visible} transparent={false} animationType="fade">
      <View style={styles.container}>
        <Text style={styles.title}>🐝 Voice Inspection</Text>

        {state.type === 'QUESTION' && state.current && state.total && (
          <Text style={styles.progress}>
            Question {state.current} / {state.total}
          </Text>
        )}

        <Text style={styles.status}>{renderStatus()}</Text>

        <View style={styles.microphone}>
          <Text style={styles.micText}>🎤</Text>
        </View>

        <TouchableOpacity style={styles.stopButton} onPress={onStop}>
          <Text style={styles.stopText}>⏹ Stop Inspection</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
  },

  status: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 40,
  },

  microphone: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  micText: {
    fontSize: 60,
  },

  stopButton: {
    width: '100%',
    minHeight: 72,
    borderRadius: 12,
    backgroundColor: '#C62828',
    justifyContent: 'center',
    alignItems: 'center',
  },

  stopText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  progress: {
    color: '#999',
    fontSize: 18,
    marginBottom: 20,
  },
});
