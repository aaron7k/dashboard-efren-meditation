/*
  # Seed Initial Data for Meditation App

  1. Meditation Categories
  2. Meditation Tags
  3. Pre-recorded Meditations
  4. Ambient Sounds for Mixer
  5. Sample Data for Testing
*/

-- Insert meditation categories
INSERT INTO meditation_categories (name, description, color, icon, sort_order) VALUES
  ('Principiante', 'Meditaciones perfectas para comenzar tu práctica', '#7439fe', '🌱', 1),
  ('Mañana', 'Meditaciones energizantes para comenzar el día', '#15ecfd', '🌅', 2),
  ('Noche', 'Meditaciones relajantes para terminar el día', '#c75ca7', '🌙', 3),
  ('Bienestar', 'Meditaciones para el bienestar general', '#fd6024', '💚', 4),
  ('Enfoque', 'Meditaciones para mejorar la concentración', '#7439fe', '🎯', 5),
  ('Autocompasión', 'Meditaciones para cultivar el amor propio', '#15ecfd', '💝', 6),
  ('Ansiedad', 'Meditaciones para calmar la ansiedad', '#c75ca7', '🕊️', 7),
  ('Sueño', 'Meditaciones para un mejor descanso', '#fd6024', '😴', 8)
ON CONFLICT (name) DO NOTHING;

-- Insert meditation tags
INSERT INTO meditation_tags (name, description) VALUES
  ('respiración', 'Técnicas de respiración consciente'),
  ('mindfulness', 'Atención plena y presencia'),
  ('relajación', 'Técnicas de relajación profunda'),
  ('visualización', 'Meditaciones con imágenes guiadas'),
  ('gratitud', 'Prácticas de agradecimiento'),
  ('compasión', 'Cultivo de la compasión y bondad'),
  ('concentración', 'Mejora del enfoque mental'),
  ('estrés', 'Reducción del estrés'),
  ('emociones', 'Gestión emocional'),
  ('cuerpo', 'Conciencia corporal'),
  ('naturaleza', 'Conexión con la naturaleza'),
  ('silencio', 'Meditación en silencio'),
  ('movimiento', 'Meditación en movimiento'),
  ('chakras', 'Trabajo con centros energéticos'),
  ('mantra', 'Repetición de sonidos sagrados')
ON CONFLICT (name) DO NOTHING;

-- Insert pre-recorded meditations
INSERT INTO meditations (
  title, 
  description, 
  content, 
  duration_minutes, 
  category_id, 
  image_url, 
  is_public, 
  is_featured, 
  rating,
  status
) VALUES
  (
    'Respiración Profunda',
    'Una meditación básica centrada en la respiración consciente, perfecta para principiantes.',
    'Encuentra una posición cómoda y cierra los ojos suavemente. Lleva tu atención a tu respiración natural...',
    10,
    (SELECT id FROM meditation_categories WHERE name = 'Principiante'),
    'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
    true,
    true,
    4.8,
    'active'
  ),
  (
    'Mindfulness Matutino',
    'Comienza tu día con claridad mental y energía positiva.',
    'Al despertar, antes de levantarte, toma unos momentos para conectar contigo mismo...',
    15,
    (SELECT id FROM meditation_categories WHERE name = 'Mañana'),
    'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
    true,
    true,
    4.9,
    'active'
  ),
  (
    'Calma Nocturna',
    'Libera las tensiones del día y prepárate para un descanso reparador.',
    'Mientras te preparas para dormir, permite que tu cuerpo se relaje completamente...',
    20,
    (SELECT id FROM meditation_categories WHERE name = 'Noche'),
    'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
    true,
    true,
    4.7,
    'active'
  ),
  (
    'Reducción de Estrés',
    'Técnicas efectivas para liberar el estrés acumulado y encontrar paz interior.',
    'Reconoce las áreas de tensión en tu cuerpo y permite que se liberen gradualmente...',
    12,
    (SELECT id FROM meditation_categories WHERE name = 'Bienestar'),
    'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
    true,
    false,
    4.8,
    'active'
  ),
  (
    'Concentración Profunda',
    'Desarrolla tu capacidad de enfoque y atención sostenida.',
    'Elige un punto de enfoque y mantén tu atención allí con gentileza y determinación...',
    18,
    (SELECT id FROM meditation_categories WHERE name = 'Enfoque'),
    'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
    true,
    false,
    4.6,
    'active'
  ),
  (
    'Amor Propio',
    'Cultiva una relación amorosa y compasiva contigo mismo.',
    'Coloca tu mano en tu corazón y envíate palabras de amor y aceptación...',
    14,
    (SELECT id FROM meditation_categories WHERE name = 'Autocompasión'),
    'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
    true,
    true,
    4.9,
    'active'
  ),
  (
    'Liberación de Ansiedad',
    'Técnicas suaves para calmar la mente ansiosa y encontrar estabilidad.',
    'Reconoce los pensamientos ansiosos sin juzgarlos, y permite que pasen como nubes...',
    16,
    (SELECT id FROM meditation_categories WHERE name = 'Ansiedad'),
    'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
    true,
    false,
    4.7,
    'active'
  ),
  (
    'Sueño Reparador',
    'Una meditación diseñada para facilitar un sueño profundo y reparador.',
    'Permite que cada parte de tu cuerpo se relaje completamente mientras te preparas para dormir...',
    25,
    (SELECT id FROM meditation_categories WHERE name = 'Sueño'),
    'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
    true,
    true,
    4.8,
    'active'
  );

-- Insert ambient sounds for the mixer
INSERT INTO ambient_sounds (name, emoji, audio_url, category, default_volume, sort_order) VALUES
  ('Lluvia', '🌧️', '/sounds/rain.mp3', 'nature', 0.7, 1),
  ('Océano', '🌊', '/sounds/ocean.mp3', 'nature', 0.5, 2),
  ('Bosque', '🌲', '/sounds/forest.mp3', 'nature', 0.8, 3),
  ('Fuego', '🔥', '/sounds/fire.mp3', 'nature', 0.6, 4),
  ('Viento', '💨', '/sounds/wind.mp3', 'nature', 0.4, 5),
  ('Pájaros', '🐦', '/sounds/birds.mp3', 'nature', 0.9, 6),
  ('Campanas', '🔔', '/sounds/bells.mp3', 'meditation', 0.3, 7),
  ('Trueno', '⚡', '/sounds/thunder.mp3', 'nature', 0.2, 8),
  ('Río', '🏞️', '/sounds/river.mp3', 'nature', 0.6, 9),
  ('Café', '☕', '/sounds/cafe.mp3', 'urban', 0.5, 10),
  ('Ruido Blanco', '📻', '/sounds/white-noise.mp3', 'white_noise', 0.4, 11),
  ('Cuencos Tibetanos', '🎵', '/sounds/singing-bowls.mp3', 'meditation', 0.5, 12);

-- Link meditations with tags (many-to-many relationship)
INSERT INTO meditation_meditation_tags (meditation_id, tag_id)
SELECT m.id, t.id
FROM meditations m, meditation_tags t
WHERE 
  (m.title = 'Respiración Profunda' AND t.name IN ('respiración', 'mindfulness', 'principiante')) OR
  (m.title = 'Mindfulness Matutino' AND t.name IN ('mindfulness', 'energía', 'mañana')) OR
  (m.title = 'Calma Nocturna' AND t.name IN ('relajación', 'sueño', 'noche')) OR
  (m.title = 'Reducción de Estrés' AND t.name IN ('estrés', 'relajación', 'bienestar')) OR
  (m.title = 'Concentración Profunda' AND t.name IN ('concentración', 'enfoque', 'mindfulness')) OR
  (m.title = 'Amor Propio' AND t.name IN ('compasión', 'autoestima', 'corazón')) OR
  (m.title = 'Liberación de Ansiedad' AND t.name IN ('ansiedad', 'calma', 'respiración')) OR
  (m.title = 'Sueño Reparador' AND t.name IN ('sueño', 'relajación', 'descanso'));