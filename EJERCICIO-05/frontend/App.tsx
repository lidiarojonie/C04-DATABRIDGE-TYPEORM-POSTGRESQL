import { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
const API_URL='http://192.168.1.46:3000';

export default function App(){
 const [estado,setEstado]=useState('RESERVADO');
 const [fecha,setFecha]=useState('2027-04-10');
 const [estadoModificado,setEstadoModificado]=useState(false);
 const [fechaModificada,setFechaModificada]=useState(false);
 const [mensaje,setMensaje]=useState('');

 async function actualizar(){
   const cambios: { estado?: string; fecha?: string } = {};
   if(estadoModificado) cambios.estado=estado;
   if(fechaModificada) cambios.fecha=fecha;
   if(Object.keys(cambios).length===0){
     setMensaje('No hay cambios que guardar');
     return;
   }

   const r=await fetch(API_URL+'/viajes/1',{
     method:'PATCH',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify(cambios),
   });
   if(r.ok){
     setEstadoModificado(false);
     setFechaModificada(false);
   }
   setMensaje(r.ok?'Viaje actualizado ✓':'No se pudo actualizar');
 }

 return <SafeAreaView style={styles.container}>
   <Text style={styles.title}>✈️ Travel Book</Text>
   <Text>Estado</Text>
   <TextInput style={styles.input} value={estado} onChangeText={value=>{setEstado(value);setEstadoModificado(true);}}/>
   <Text>Fecha (AAAA-MM-DD)</Text>
   <TextInput style={styles.input} value={fecha} onChangeText={value=>{setFecha(value);setFechaModificada(true);}}/>
   <Button title="Guardar cambios" onPress={actualizar}/>
   <Text>{mensaje}</Text>
 </SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,padding:24},title:{fontSize:30,fontWeight:'800'},input:{padding:14,backgroundColor:'#F1F5F9',marginVertical:8}});