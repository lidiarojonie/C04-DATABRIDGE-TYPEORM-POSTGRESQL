import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Cancion = { id: number; titulo: string; artista: string };
type Playlist = { id: number; nombre: string; canciones: Cancion[] };
const API_URL = 'http://192.168.1.46:3000';

export default function App() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/playlists/1`);
      if (!response.ok) {
        throw new Error(`No se pudo cargar la playlist (${response.status}).`);
      }
      setPlaylist(await response.json());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cargar la playlist.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargar();
  }, []);

  async function agregarCancion() {
    if (!playlist || !titulo.trim() || !artista.trim()) return;

    setGuardando(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/playlists/canciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo.trim(),
          artista: artista.trim(),
          playlistId: playlist.id,
        }),
      });
      if (!response.ok) {
        throw new Error(`No se pudo añadir la canción (${response.status}).`);
      }
      setTitulo('');
      setArtista('');
      await cargar();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo añadir la canción.');
    } finally {
      setGuardando(false);
    }
  }

  if (!playlist && cargando) {
    return <ActivityIndicator style={styles.loading} />;
  }

  if (!playlist) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.button} onPress={() => void cargar()}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>🎵 {playlist.nombre}</Text>
      <TextInput
        accessibilityLabel="Título de la canción"
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        accessibilityLabel="Artista de la canción"
        style={styles.input}
        placeholder="Artista"
        value={artista}
        onChangeText={setArtista}
      />
      <Pressable
        style={[styles.button, (guardando || !titulo.trim() || !artista.trim()) && styles.buttonDisabled]}
        disabled={guardando || !titulo.trim() || !artista.trim()}
        onPress={() => void agregarCancion()}
      >
        <Text style={styles.buttonText}>
          {guardando ? 'Añadiendo...' : 'Añadir canción'}
        </Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={playlist.canciones}
        keyExtractor={(cancion) => String(cancion.id)}
        renderItem={({ item }) => (
          <View style={styles.song}>
            <Text style={styles.songTitle}>{item.titulo}</Text>
            <Text>{item.artista}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  loading: { flex: 1 },
  heading: { fontSize: 24, fontWeight: 'bold' },
  input: { borderColor: '#999', borderRadius: 6, borderWidth: 1, padding: 10 },
  button: { alignItems: 'center', backgroundColor: '#2457a7', borderRadius: 6, padding: 12 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  error: { color: '#b00020' },
  song: { borderBottomColor: '#ddd', borderBottomWidth: 1, paddingVertical: 8 },
  songTitle: { fontWeight: 'bold' },
});
