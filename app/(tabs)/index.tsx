import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Clock, Star } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const meditations = [
  {
    id: 1,
    title: 'Respiración Profunda',
    duration: '10 min',
    category: 'Principiante',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    title: 'Mindfulness Matutino',
    duration: '15 min',
    category: 'Mañana',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 3,
    title: 'Calma Nocturna',
    duration: '20 min',
    category: 'Noche',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 4,
    title: 'Reducción de Estrés',
    duration: '12 min',
    category: 'Bienestar',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 5,
    title: 'Concentración Profunda',
    duration: '18 min',
    category: 'Enfoque',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 6,
    title: 'Amor Propio',
    duration: '14 min',
    category: 'Autocompasión',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const categories = [
  { name: 'Todos' },
  { name: 'Principiante' },
  { name: 'Mañana' },
  { name: 'Noche' },
  { name: 'Bienestar' },
  { name: 'Enfoque' },
];

export default function LibraryScreen() {
  const isWeb = Platform.OS === 'web';
  const cardWidth = isWeb ? Math.min(400, width - 40) : width - 40;

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
          <Text style={styles.title}>Biblioteca de</Text>
          <Text style={styles.titleAccent}>Meditaciones</Text>
          <Text style={styles.subtitle}>Encuentra tu paz interior</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryButton}>
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryText}>
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.meditationsGrid, isWeb && styles.webGrid]}>
          {meditations.map((meditation) => (
            <TouchableOpacity 
              key={meditation.id} 
              style={[
                styles.meditationCard,
                isWeb && { width: cardWidth, maxWidth: 400 }
              ]}
            >
              <View style={styles.cardContainer}>
                <View style={styles.cardImageContainer}>
                  <Image 
                    source={{ uri: meditation.image }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.imageOverlay}
                  />
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{meditation.title}</Text>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#ffffff" fill="#ffffff" />
                      <Text style={styles.ratingText}>{meditation.rating}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.cardInfo}>
                    <View style={styles.durationContainer}>
                      <Clock size={14} color="#ffffff" />
                      <Text style={styles.durationText}>{meditation.duration}</Text>
                    </View>
                    <Text style={styles.categoryTag}>{meditation.category}</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.playButton}>
                    <View style={styles.playButtonContainer}>
                      <Play size={16} color="#ffffff" fill="#ffffff" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    textAlign: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 36 : 32,
    fontFamily: 'Sora-Light',
    color: '#ffffff',
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  titleAccent: {
    fontSize: Platform.OS === 'web' ? 36 : 32,
    fontFamily: 'Sora-Bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: '#ffffff',
    opacity: 0.8,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryButton: {
    marginRight: 12,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: '#ffffff',
  },
  meditationsGrid: {
    paddingHorizontal: 20,
  },
  webGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  meditationCard: {
    width: '100%',
    marginBottom: 16,
  },
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardImageContainer: {
    height: 120,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  cardContent: {
    padding: 20,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: '#ffffff',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
    color: '#ffffff',
    marginLeft: 4,
    opacity: 0.9,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: '#ffffff',
    marginLeft: 6,
    opacity: 0.9,
  },
  categoryTag: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
    color: '#ffffff',
    opacity: 0.7,
  },
  playButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  playButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});