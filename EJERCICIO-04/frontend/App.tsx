// App.tsx — formulario POST
import { useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_URL = 'http://TU_IP_LOCAL:3000';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [precioMedio, setPrecioMedio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [puntuacion, setPuntuacion] = useState('9');

  async function guardar() {
    const nota = Number(puntuacion.replace(',', '.'));

    if (!Number.isFinite(nota) || nota < 0 || nota > 10) {
      setMensaje('Introduce una puntuación entre 0 y 10');
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/restaurantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          tipo,
          ciudad,
          puntuacion: nota,
          precioMedio: Number(precioMedio),
      }),
      });

      setMensaje(
        respuesta.ok ? 'Restaurante guardado ✓' : 'Error al guardar',
      );
    } catch {
      setMensaje('No se pudo conectar con el servidor');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>FOOD SPOTS · DESPUÉS DEL RETO</Text>
        <Text style={styles.title}>Nuevo restaurante</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Tipo"
          value={tipo}
          onChangeText={setTipo}
        />
        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          value={ciudad}
          onChangeText={setCiudad}
        />
        <TextInput
          style={styles.input}
          placeholder="Precio medio (€)"
          value={precioMedio}
          onChangeText={setPrecioMedio}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Puntuación (0–10)"
          value={puntuacion}
          onChangeText={setPuntuacion}
          keyboardType="decimal-pad"
        />

        <View style={styles.restaurantCard}>
          <Text style={styles.restaurantName}>
            🍜 {nombre.trim() || 'Nombre del restaurante'}
          </Text>
          <Text style={styles.restaurantDetails}>
            {tipo.trim() || 'Tipo'} · {ciudad.trim() || 'Ciudad'}
          </Text>
        </View>
        <View style={styles.priceCard}>
          <Text style={styles.priceText}>
            Precio medio: {precioMedio.trim() || '0'} €
          </Text>
        </View>

        <View style={styles.button}>
          <Button title="Guardar restaurante" onPress={guardar} />
        </View>
        {mensaje ? <Text style={styles.message}>{mensaje}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flexGrow: 1, padding: 24, paddingTop: 32 },
  eyebrow: {
    color: '#526b8a',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 28,
  },
  title: { color: '#111827', fontSize: 24, fontWeight: '800', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    borderColor: '#dbe3ee',
    borderRadius: 12,
    borderWidth: 1,
    color: '#111827',
    marginBottom: 12,
    padding: 14,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderColor: '#dbe3ee',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    padding: 16,
  },
  restaurantName: { color: '#111827', fontSize: 18, fontWeight: '700' },
  restaurantDetails: { color: '#526b8a', fontSize: 14, marginTop: 8 },
  priceCard: {
    backgroundColor: '#fff',
    borderColor: '#dbe3ee',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    padding: 16,
  },
  priceText: { color: '#111827', fontSize: 17, fontWeight: '700' },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    marginTop: 12,
    overflow: 'hidden',
  },
  message: { color: '#334155', marginTop: 12, textAlign: 'center' },
});