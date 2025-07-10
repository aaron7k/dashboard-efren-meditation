import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react-native';
import { useState } from 'react';

const { width } = Dimensions.get('window');

const sounds = [
  {
    id: 1,
    name: 'Lluvia',
    emoji: '🌧️',
    volume: 0.7,
    isPlaying: true,
  },
  {
    id: 2,
    name: 'Océano',
    emoji: '🌊',
    volume: 0.5,
    isPlaying: false,
  },
  {
    id: 3,
    name: 'Bosque',
    emoji: '🌲',
    volume: 0.8,
    isPlaying: true,
  },
  {
    id: 4,
    name: 'Fuego',
    emoji: '🔥',
    volume: 0.6,
    isPlaying: false,
  },
  {
    id: 5,
    name: 'Viento',
    emoji: '💨',
    volume: 0.4,
    isPlaying: true,
  },
  {
    id: 6,
    name: 'Pájaros',
    emoji: '🐦',
    volume: 0.9,
    isPlaying: false,
  },
  {
    id: 7,
    name: 'Campanas',
    emoji: '🔔',
    volume: 0.3,
    isPlaying: true,
  },
  {
    id: 8,
    name: 'Trueno',
    emoji: '⚡',
    volume: 0.2,
    isPlaying: false,
  },
];

const SoundBubble = ({ sound, onVolumeChange, onTogglePlay, isWeb }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handleToggle = () => {
    onTogglePlay(sound.id);
  };

  const bubbleSize = isWeb ? 85 + (sound.volume * 25) : 75 + (sound.volume * 35);
  const scale = isPressed ? 0.95 : 1;
  const opacity = sound.isPlaying ? 1 : 0.6;

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleToggle}
      style={[
        styles.bubbleContainer, 
        { 
          width: bubbleSize, 
          height: bubbleSize,
          transform: [{ scale }],
          opacity,
        }
      ]}
    >
      <View style={styles.bubble}>
        <Text style={[styles.bubbleEmoji, isWeb && styles.webBubbleEmoji]}>
          {sound.emoji}
        </Text>
        <Text style={[styles.bubbleName, isWeb && styles.webBubbleName]}>
          {sound.name}
        </Text>
        <View style={styles.volumeIndicator}>
          <View
            style={[
              styles.volumeBar,
              {
                width: `${sound.volume * 100}%`,
                backgroundColor: '#ffffff',
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MixerScreen() {
  const [soundsList, setSoundsList] = useState(sounds);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [isGlobalPlaying, setIsGlobalPlaying] = useState(true);
  const isWeb = Platform.OS === 'web';

  const handleVolumeChange = (id: number, volume: number) => {
    setSoundsList(prev =>
      prev.map(sound =>
        sound.id === id ? { ...sound, volume } : sound
      )
    );
  };

  const handleTogglePlay = (id: number) => {
    setSoundsList(prev =>
      prev.map(sound =>
        sound.id === id ? { ...sound, isPlaying: !sound.isPlaying } : sound
      )
    );
  };

  const handleGlobalToggle = () => {
    setIsGlobalPlaying(!isGlobalPlaying);
    setSoundsList(prev =>
      prev.map(sound => ({ ...sound, isPlaying: !isGlobalPlaying }))
    );
  };

  const handleReset = () => {
    setSoundsList(sounds);
    setMasterVolume(0.8);
  };

  const handleMasterVolumeChange = (direction: 'up' | 'down') => {
    setMasterVolume(prev => {
      const newVolume = direction === 'up' ? prev + 0.1 : prev - 0.1;
      return Math.max(0, Math.min(1, newVolume));
    });
  };

  return (
    <LinearGradient
      colors={['#7439fe', '#15ecfd', '#c75ca7', '#fd6024']}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isWeb && styles.webScrollContent
        ]}
      >
        {/* Header */}
        <View style={[styles.header, isWeb && styles.webHeader]}>
          <View style={styles.titleContainer}>
            <Volume2 size={32} color="#ffffff" />
            <Text style={styles.title}>Mixer de Sonidos</Text>
          </View>
          <Text style={styles.subtitle}>
            Crea tu ambiente perfecto combinando sonidos naturales
          </Text>
        </View>

        {/* Master Controls */}
        <View style={[styles.controlsSection, isWeb && styles.webControlsSection]}>
          <View style={styles.controlsContainer}>
            <Text style={styles.controlsTitle}>Controles Principales</Text>
            
            <View style={styles.masterControlsRow}>
              <TouchableOpacity
                style={styles.globalPlayButton}
                onPress={handleGlobalToggle}
              >
                <View style={styles.globalPlayContainer}>
                  {isGlobalPlaying ? (
                    <Pause size={24} color="#ffffff" />
                  ) : (
                    <Play size={24} color="#ffffff" />
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.masterVolumeContainer}>
                <Text style={styles.masterVolumeLabel}>Volumen Principal</Text>
                <View style={styles.masterVolumeBar}>
                  <View
                    style={[
                      styles.masterVolumeProgress,
                      { width: `${masterVolume * 100}%` },
                    ]}
                  />
                </View>
                <View style={styles.volumeControls}>
                  <TouchableOpacity 
                    onPress={() => handleMasterVolumeChange('down')}
                    style={styles.volumeButton}
                  >
                    <Text style={styles.volumeButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.masterVolumeValue}>
                    {Math.round(masterVolume * 100)}%
                  </Text>
                  <TouchableOpacity 
                    onPress={() => handleMasterVolumeChange('up')}
                    style={styles.volumeButton}
                  >
                    <Text style={styles.volumeButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <RotateCcw size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sound Bubbles */}
        <View style={[styles.bubblesSection, isWeb && styles.webBubblesSection]}>
          <Text style={styles.sectionTitle}>Sonidos Ambientales</Text>
          <Text style={styles.sectionSubtitle}>
            Toca las burbujas para activar/desactivar sonidos
          </Text>
          
          <View style={[styles.bubblesContainer, isWeb && styles.webBubblesContainer]}>
            {soundsList.map((sound) => (
              <SoundBubble
                key={sound.id}
                sound={sound}
                onVolumeChange={handleVolumeChange}
                onTogglePlay={handleTogglePlay}
                isWeb={isWeb}
              />
            ))}
          </View>
        </View>

        {/* Presets */}
        <View style={[styles.presetsSection, isWeb && styles.webPresetsSection]}>
          <Text style={styles.sectionTitle}>Presets Populares</Text>
          <Text style={styles.sectionSubtitle}>
            Combinaciones predefinidas para diferentes momentos
          </Text>
          
          <View style={[styles.presetsList, isWeb && styles.webPresetsList]}>
            <TouchableOpacity style={[styles.presetCard, isWeb && styles.webPresetCard]}>
              <View style={styles.presetContainer}>
                <Text style={styles.presetName}>Lluvia Nocturna</Text>
                <Text style={styles.presetDescription}>Lluvia + Trueno + Viento</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.presetCard, isWeb && styles.webPresetCard]}>
              <View style={styles.presetContainer}>
                <Text style={styles.presetName}>Bosque Mágico</Text>
                <Text style={styles.presetDescription}>Bosque + Pájaros + Campanas</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.presetCard, isWeb && styles.webPresetCard]}>
              <View style={styles.presetContainer}>
                <Text style={styles.presetName}>Océano en Calma</Text>
                <Text style={styles.presetDescription}>Océano + Viento + Campanas</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Instructions */}
        <View style={[styles.instructionsSection, isWeb && styles.webInstructionsSection]}>
          <Text style={styles.sectionTitle}>Cómo usar el Mixer</Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <View style={styles.instructionDot} />
              <Text style={styles.instructionText}>
                Toca las burbujas para activar o desactivar sonidos
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionDot} />
              <Text style={styles.instructionText}>
                El tamaño de la burbuja indica el volumen del sonido
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionDot} />
              <Text style={styles.instructionText}>
                Usa los controles principales para gestionar todo el audio
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionDot} />
              <Text style={styles.instructionText}>
                Prueba los presets para combinaciones perfectas
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  webScrollContent: {
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  
  // Header
  header: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  webHeader: {
    alignItems: 'center',
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-start',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 36 : 32,
    fontFamily: 'Sora-Bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 24,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },

  // Controls Section
  controlsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  webControlsSection: {
    maxWidth: 700,
    width: '100%',
  },
  controlsContainer: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlsTitle: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  masterControlsRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    gap: 20,
  },
  globalPlayButton: {
    alignSelf: 'center',
  },
  globalPlayContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  masterVolumeContainer: {
    flex: Platform.OS === 'web' ? 1 : 0,
    width: Platform.OS === 'web' ? 'auto' : '100%',
    paddingHorizontal: Platform.OS === 'web' ? 20 : 0,
  },
  masterVolumeLabel: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  masterVolumeBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 12,
  },
  masterVolumeProgress: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  volumeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  volumeButtonText: {
    fontSize: 18,
    fontFamily: 'Sora-Bold',
    color: '#ffffff',
  },
  masterVolumeValue: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: '#ffffff',
    opacity: 0.8,
    minWidth: 50,
    textAlign: 'center',
  },
  resetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Bubbles Section
  bubblesSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  webBubblesSection: {
    maxWidth: 900,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Sora-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 24,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  bubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: Platform.OS === 'web' ? 25 : 20,
    paddingVertical: 20,
  },
  webBubblesContainer: {
    justifyContent: 'center',
    gap: 30,
  },
  bubbleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  bubble: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  bubbleEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  webBubbleEmoji: {
    fontSize: 26,
  },
  bubbleName: {
    fontSize: 10,
    fontFamily: 'Sora-Medium',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  webBubbleName: {
    fontSize: 11,
  },
  volumeIndicator: {
    width: 24,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
  },
  volumeBar: {
    height: '100%',
    borderRadius: 1.5,
  },

  // Presets Section
  presetsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  webPresetsSection: {
    maxWidth: 700,
    width: '100%',
  },
  presetsList: {
    gap: 16,
  },
  webPresetsList: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  presetCard: {
    width: '100%',
  },
  webPresetCard: {
    width: Platform.OS === 'web' ? 200 : '100%',
  },
  presetContainer: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  presetName: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  presetDescription: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: '#ffffff',
    opacity: 0.7,
    textAlign: 'center',
  },

  // Instructions Section
  instructionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  webInstructionsSection: {
    maxWidth: 600,
    width: '100%',
  },
  instructionsList: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    opacity: 0.8,
    marginRight: 16,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: '#ffffff',
    opacity: 0.8,
    flex: 1,
    lineHeight: 20,
  },
});