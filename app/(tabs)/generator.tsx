import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Send, Mic, Clock, Heart, Brain, Zap } from 'lucide-react-native';
import { useState } from 'react';

const { width } = Dimensions.get('window');

const suggestions = [
  {
    icon: Heart,
    title: 'Amor Propio',
    prompt: 'Crea una meditación para cultivar el amor propio y la autocompasión',
  },
  {
    icon: Brain,
    title: 'Claridad Mental',
    prompt: 'Necesito una meditación para aclarar mi mente y tomar decisiones',
  },
  {
    icon: Zap,
    title: 'Energía Positiva',
    prompt: 'Quiero una meditación que me llene de energía positiva para el día',
  },
  {
    icon: Clock,
    title: 'Reducir Ansiedad',
    prompt: 'Crea una meditación para calmar la ansiedad y encontrar paz',
  },
];

export default function GeneratorScreen() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMeditation, setGeneratedMeditation] = useState<string | null>(null);
  const isWeb = Platform.OS === 'web';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedMeditation(null);
    
    // Simulate AI generation
    setTimeout(() => {
      const meditation = `
🧘‍♀️ **Meditación Personalizada**

*Basada en: "${prompt}"*

**Preparación (2 minutos)**
Encuentra un lugar cómodo y silencioso. Siéntate con la espalda recta pero relajada. Cierra los ojos suavemente y permite que tu cuerpo se asiente.

**Respiración Consciente (5 minutos)**
Lleva tu atención a tu respiración natural. Inhala profundamente por la nariz, sintiendo cómo el aire llena tu abdomen. Exhala lentamente por la boca, liberando cualquier tensión.

**Visualización Guiada (8 minutos)**
Imagina un lugar de paz y serenidad. Puede ser un bosque tranquilo, una playa serena, o cualquier espacio que te brinde calma. Permítete estar completamente presente en este lugar.

**Afirmaciones Positivas (3 minutos)**
Repite mentalmente: "Soy digno de amor y compasión. Merezco paz y felicidad. Confío en mi sabiduría interior."

**Cierre (2 minutos)**
Gradualmente regresa tu atención al momento presente. Mueve suavemente los dedos de manos y pies. Cuando estés listo, abre los ojos lentamente.

✨ *Duración total: 20 minutos*
      `;
      setGeneratedMeditation(meditation);
      setIsGenerating(false);
    }, 3000);
  };

  const handleSuggestion = (suggestionPrompt: string) => {
    setPrompt(suggestionPrompt);
  };

  const triggerMicFeedback = () => {
    if (isWeb) {
      console.log('Mic activated');
    }
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
        <View style={[styles.header, isWeb && styles.webHeader]}>
          <View style={styles.titleContainer}>
            <Sparkles size={32} color="#ffffff" />
            <Text style={styles.title}>Efren IA</Text>
          </View>
          <Text style={styles.subtitle}>
            Crea meditaciones personalizadas con inteligencia artificial
          </Text>
        </View>

        <View style={[styles.inputSection, isWeb && styles.webInputSection]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, isWeb && styles.webTextInput]}
              placeholder="Describe qué tipo de meditación necesitas..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={isWeb ? 6 : 4}
              textAlignVertical="top"
            />
            <TouchableOpacity 
              style={styles.micButton}
              onPress={triggerMicFeedback}
            >
              <Mic size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.generatingButton]}
            onPress={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            <View style={styles.generateButtonContainer}>
              {isGenerating ? (
                <>
                  <Sparkles size={20} color="#ffffff" />
                  <Text style={styles.generateButtonText}>Generando...</Text>
                </>
              ) : (
                <>
                  <Send size={20} color="#ffffff" />
                  <Text style={styles.generateButtonText}>Crear Meditación</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {generatedMeditation && (
          <View style={[styles.resultSection, isWeb && styles.webResultSection]}>
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Tu Meditación Personalizada</Text>
              <ScrollView style={styles.meditationScroll} nestedScrollEnabled>
                <Text style={styles.meditationText}>{generatedMeditation}</Text>
              </ScrollView>
              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <View style={styles.actionButtonContainer}>
                    <Text style={styles.actionButtonText}>Reproducir</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <View style={styles.actionButtonContainer}>
                    <Text style={styles.actionButtonText}>Guardar</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={[styles.suggestionsSection, isWeb && styles.webSuggestionsSection]}>
          <Text style={styles.sectionTitle}>Sugerencias Populares</Text>
          <View style={[styles.suggestionsGrid, isWeb && styles.webSuggestionsGrid]}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionCard,
                  isWeb && styles.webSuggestionCard
                ]}
                onPress={() => handleSuggestion(suggestion.prompt)}
              >
                <View style={styles.suggestionContainer}>
                  <View style={styles.suggestionIcon}>
                    <suggestion.icon size={24} color="#ffffff" />
                  </View>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <Text style={styles.suggestionPrompt}>{suggestion.prompt}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.featuresSection, isWeb && styles.webFeaturesSection]}>
          <Text style={styles.sectionTitle}>Características de Efren IA</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Meditaciones personalizadas según tu estado emocional</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Duración adaptable a tu tiempo disponible</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Técnicas de respiración integradas</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>Música ambiente generada automáticamente</Text>
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
    paddingBottom: 100,
  },
  webScrollContent: {
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  webHeader: {
    alignItems: 'center',
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  webInputSection: {
    maxWidth: 600,
    width: '100%',
  },
  inputContainer: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
    position: 'relative',
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: '#ffffff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  webTextInput: {
    minHeight: 120,
    outlineStyle: 'none',
  },
  micButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  generatingButton: {
    opacity: 0.7,
  },
  generateButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  generateButtonText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
  resultSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  webResultSection: {
    maxWidth: 800,
    width: '100%',
  },
  resultContainer: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: 'Sora-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  meditationScroll: {
    maxHeight: 300,
    marginBottom: 20,
  },
  meditationText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: '#ffffff',
    lineHeight: 22,
    opacity: 0.9,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Sora-SemiBold',
    color: '#ffffff',
  },
  suggestionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  webSuggestionsSection: {
    maxWidth: 800,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Sora-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  webSuggestionsGrid: {
    justifyContent: 'center',
  },
  suggestionCard: {
    width: '48%',
    marginBottom: 12,
  },
  webSuggestionCard: {
    width: Platform.OS === 'web' ? 180 : '48%',
  },
  suggestionContainer: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  suggestionIcon: {
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  suggestionPrompt: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: '#ffffff',
    opacity: 0.7,
    lineHeight: 16,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  webFeaturesSection: {
    maxWidth: 600,
    width: '100%',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    opacity: 0.8,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: '#ffffff',
    opacity: 0.8,
    flex: 1,
  },
});