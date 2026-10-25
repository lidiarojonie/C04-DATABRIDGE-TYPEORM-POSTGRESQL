import { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Evento = { id: number; nombre: string; ciudad: string; categoria: string; fecha: string };

const API_URL = 'http://192.168.1.46:3000';

async function obtenerEventos(ciudad?: string, categoria?: string): Promise<Evento[]> {
  const params = new URLSearchParams();
  if (ciudad) params.append('ciudad', ciudad);
  if (categoria) params.append('categoria', categoria);

  const query = params.toString();
  const url = `${API_URL}/eventos${query ? `?${query}` : ''}`;
  const response = await fetch(url);
  return response.json();
}

export default function App() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  async function filtrar(ciudad?: string, categoria?: string) {
    setEventos(await obtenerEventos(ciudad, categoria));
  }

  useEffect(() => {
    void obtenerEventos().then(setEventos);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>🎟️ Event Radar</Text>
      <Text style={styles.subtitle}>Encuentra tu próximo evento</Text>
      <View style={styles.filters}>
        <Button title="Todos los eventos" onPress={() => void filtrar()} />
        <Button title="Solo Zaragoza" onPress={() => void filtrar('Zaragoza')} />
        <Button title="Solo Tecnología" onPress={() => void filtrar(undefined, 'Tecnologia')} />
        <Button
          title="Zaragoza · Tecnología"
          onPress={() => void filtrar('Zaragoza', 'Tecnologia')}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={eventos}
        keyExtractor={(evento) => String(evento.id)}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventName}>{item.nombre}</Text>
            <Text style={styles.eventDetails}>
              {item.ciudad} · {item.categoria}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    color: '#172554',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  filters: {
    gap: 10,
    marginBottom: 16,
  },
  list: {
    gap: 10,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
  },
  eventName: {
    color: '#172554',
    fontSize: 16,
    fontWeight: '600',
  },
  eventDetails: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 4,
  },
});