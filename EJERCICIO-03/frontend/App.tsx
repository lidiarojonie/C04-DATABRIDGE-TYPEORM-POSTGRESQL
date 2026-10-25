// App.tsx
// RESPONSABILIDAD: solicitar una mascota concreta y mostrar su ficha.
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Mascota = {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  ciudad: string;
  nivelEnergia: number;
};

const API_URL = 'http://TU_IP_LOCAL:3000';

export default function App() {
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // En este ejemplo pedimos la mascota con id 1.
    fetch(API_URL + '/mascotas/1')
      .then((r) => {
        if (!r.ok) {
          throw new Error(`No se pudo cargar la mascota (HTTP ${r.status}).`);
        }
        return r.json();
      })
      .then((dato: Mascota) => setMascota(dato))
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : 'Error desconocido al cargar la mascota.',
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!mascota) return <Text>No se recibió información de la mascota.</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🐶</Text>
        <Text style={styles.title}>{mascota.nombre}</Text>
        <Text>{mascota.raza}</Text>
        <Text>{mascota.edad} años · {mascota.ciudad}</Text>
        <Text>Nivel de energía: {mascota.nivelEnergia}</Text>
      </View>
    </SafeAreaView>
  );
}
const styles=StyleSheet.create({
 container:{flex:1,justifyContent:'center',padding:24,backgroundColor:'#EEF6FF'},
 card:{backgroundColor:'#FFF',padding:28,borderRadius:24,alignItems:'center'},
 emoji:{fontSize:56},title:{fontSize:28,fontWeight:'800'}
});