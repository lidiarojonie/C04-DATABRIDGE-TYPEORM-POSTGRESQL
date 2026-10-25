import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, SafeAreaView, Text, View } from 'react-native';
type Libro={id:number;titulo:string;autor:string;genero:string;leido:boolean};
const API_URL='http://192.168.1.46:3000';

export default function App(){
 const [libros,setLibros]=useState<Libro[]>([]);

 async function cargar(){
   const r=await fetch(API_URL+'/libros');
   if(!r.ok) throw new Error(`No se pudieron cargar los libros (${r.status})`);
   setLibros(await r.json());
 }
 useEffect(()=>{cargar().catch(error=>{
   Alert.alert('Error',error instanceof Error?error.message:'No se pudieron cargar los libros');
 });},[]);

 function confirmar(libro:Libro){
   Alert.alert('Eliminar libro',libro.titulo,[
     {text:'Cancelar',style:'cancel'},
     {text:'Eliminar',style:'destructive',onPress:()=>eliminar(libro.id)},
   ]);
 }
 async function eliminar(id:number){
   await fetch(API_URL+'/libros/'+id,{method:'DELETE'});
   // Sincronizamos el estado local después de borrar en PostgreSQL.
   setLibros(actuales=>actuales.filter(l=>l.id!==id));
 }
 async function marcarComoLeido(id:number){
   try{
     const r=await fetch(API_URL+'/libros/'+id+'/leido',{method:'PATCH'});
     if(!r.ok) throw new Error(`No se pudo marcar el libro como leído (${r.status})`);
     await cargar();
   }catch(error){
     Alert.alert('Error',error instanceof Error?error.message:'No se pudo marcar el libro como leído');
   }
 }

 return <SafeAreaView>
   <Text>📚 My Library</Text>
   <FlatList data={libros} keyExtractor={x=>String(x.id)} renderItem={({item})=>
     <View><Text>{item.titulo}</Text>
     {item.leido?<Text>✓ Leído</Text>:<View style={{marginBottom:8}}>
       <Button title="✓ Marcar como leído" color="#2e7d32" onPress={()=>marcarComoLeido(item.id)}/>
     </View>}
     <Button title="🗑 Eliminar" color="#c62828" onPress={()=>confirmar(item)}/></View>}/>
 </SafeAreaView>;
}