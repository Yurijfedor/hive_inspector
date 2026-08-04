import React, {useEffect, useState, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

import {
  getVoiceUiState,
  subscribeVoiceUiState,
} from '../../state/voiceUiStateMachine';

import {
  getVoiceUiContext,
  subscribeVoiceUiContext,
} from '../../state/voiceUiContext';

import {VoiceUiState} from '../../state/voiceUiState';

import {useAppTranslation} from '../../hooks/useAppTranslation';

type Props = {
  visible: boolean;
  onStop?: () => void;
};

export function VoiceInspectionOverlay({visible, onStop}: Props) {
  const {t} = useAppTranslation();

  const [state, setState] = useState<VoiceUiState>(getVoiceUiState());
  const [holdingStop, setHoldingStop] = useState(false);
  const stopTimeout = useRef<NodeJS.Timeout | null>(null);

  const [progress, setProgress] = useState(getVoiceUiContext());

  const pulse = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    const unsubscribeState = subscribeVoiceUiState(setState);

    const unsubscribeProgress = subscribeVoiceUiContext(setProgress);

    return () => {
      unsubscribeState();
      unsubscribeProgress();
    };
  }, []);

  useEffect(() => {
    if (state.type !== 'LISTENING') {
      pulse.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.15,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [state.type, pulse]);

  const renderStatus = () => {
    switch (state.type) {
      case 'IDLE':
        return `⏳ ${t('inspection:voice.preparing')}`;

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

      default:
        return '';
    }
  };
  const startStopHold = () => {
    setHoldingStop(true);

    stopTimeout.current = setTimeout(() => {
      onStop?.();
    }, 2000);
  };

  const cancelStopHold = () => {
    setHoldingStop(false);

    if (stopTimeout.current) {
      clearTimeout(stopTimeout.current);
      stopTimeout.current = null;
    }
  };

  return (
    <Modal visible={visible} transparent={false} animationType="fade">
      <View style={styles.container}>
        <Text style={styles.title}>🐝 Voice Inspection</Text>

        {progress.totalSteps > 0 && (
          <>
            <Text style={styles.progressText}>
              Question {progress.currentStep} / {progress.totalSteps}
            </Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      (progress.currentStep / progress.totalSteps) * 100
                    }%`,
                  },
                ]}
              />
            </View>
          </>
        )}

        <Text style={styles.status}>{renderStatus()}</Text>

        {/* <View style={styles.microphone}>
          <Text style={styles.micText}>🎤</Text>
        </View> */}
        <Animated.View
          style={[
            styles.microphone,
            {
              transform: [
                {
                  scale: pulse,
                },
              ],
            },
          ]}>
          <Text style={styles.micText}>🎤</Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.stopButton}
          activeOpacity={0.9}
          onPressIn={startStopHold}
          onPressOut={cancelStopHold}>
          <Text style={styles.stopText}>
            {holdingStop ? '⏹ Keep holding...' : '⏹ Hold to Stop'}
          </Text>
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
    marginBottom: 24,
  },

  progressText: {
    color: '#999',
    fontSize: 18,
    marginBottom: 8,
  },

  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    marginBottom: 24,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },

  status: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    minHeight: 60,
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
});
