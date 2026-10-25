import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,StyleSheet,Text,TextInput,View } from 'react-native';

type Destino={id:number;ciudad:string;pais:string;descripcion:string;favorito:boolean};
const API_URL='http://192.168.1.46:3000';

export default function App(){
 const [destinos,setDestinos]=useState<Destino[]>([]);
 const [ciudad,setCiudad]=useState('');
 const [pais,setPais]=useState('');
 const [error,setError]=useState('');
 const [soloFavoritos,setSoloFavoritos]=useState(false);

 async function request(url:string,options?:RequestInit){
   const r=await fetch(url,options);
   if(!r.ok) throw new Error('HTTP '+r.status);
   return r;
 }

 async function cargar(){
   try{
     const r=await request(API_URL+'/destinos');
     setDestinos(await r.json());
     setError('');
   }catch{setError('No se pudieron cargar los destinos.');}
 }
 useEffect(()=>{cargar();},[]);

 async function crear(){
   try{
     await request(API_URL+'/destinos',{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
         ciudad,
         pais,
         descripcion:'Nuevo destino',
         favorito:false,
       }),
     });
     setCiudad('');
     setPais('');
     await cargar();
   }catch{setError('No se pudo crear.');}
 }

 async function editar(id:number){
   try{
     await request(API_URL+'/destinos/'+id,{
       method:'PATCH',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({descripcion:'Destino actualizado'}),
     });
     await cargar();
   }catch{setError('No se pudo actualizar.');}
 }

 async function alternarFavorito(destino:Destino){
   try{
     await request(API_URL+'/destinos/'+destino.id,{
       method:'PATCH',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({favorito:!destino.favorito}),
     });
     await cargar();
   }catch{setError('No se pudo actualizar el favorito.');}
 }

 async function eliminar(id:number){
   try{
     await request(API_URL+'/destinos/'+id,{method:'DELETE'});
     await cargar();
   }catch{setError('No se pudo eliminar.');}
 }

 return <SafeAreaView style={styles.screen}>
   <FlatList
     contentContainerStyle={styles.list}
     data={soloFavoritos?destinos.filter(destino=>destino.favorito):destinos}
     keyExtractor={x=>String(x.id)}
     ListHeaderComponent={<View>
       <Text style={styles.title}>🌍 Wander</Text>
       <Text style={styles.subtitle}>Tus próximos destinos</Text>
       {error!==''&&<Text style={styles.error}>{error}</Text>}
       <View style={styles.form}>
         <TextInput style={styles.input} placeholder="Ciudad" value={ciudad} onChangeText={setCiudad}/>
         <TextInput style={styles.input} placeholder="País" value={pais} onChangeText={setPais}/>
         <Button title="Crear destino" onPress={crear}/>
       </View>
       <View style={styles.filter}>
         <Button
           title={soloFavoritos?'Mostrar todos':'Mostrar favoritos'}
           onPress={()=>setSoloFavoritos(!soloFavoritos)}
         />
       </View>
     </View>}
     renderItem={({item})=><View style={styles.destination}>
       <Text style={styles.destinationTitle}>{item.ciudad} · {item.pais}</Text>
       <Text style={styles.description}>{item.descripcion}</Text>
       <View style={styles.action}>
         <Button
           title={item.favorito?'★ Favorito':'☆ Marcar favorito'}
           onPress={()=>alternarFavorito(item)}
         />
       </View>
       <View style={styles.action}>
         <Button title="Editar" onPress={()=>editar(item.id)}/>
       </View>
       <Button title="Eliminar" onPress={()=>eliminar(item.id)}/>
     </View>}
   />
 </SafeAreaView>;
}

const styles=StyleSheet.create({
 screen:{
   flex:1,
   backgroundColor:'#f4f6f8',
   paddingHorizontal:20,
   paddingTop:24,
 },
 list:{
   gap:10,
   paddingBottom:20,
 },
 title:{
   color:'#172554',
   fontSize:28,
   fontWeight:'700',
 },
 subtitle:{
   color:'#64748b',
   fontSize:16,
   marginTop:4,
   marginBottom:20,
 },
 form:{
   backgroundColor:'#fff',
   borderRadius:10,
   gap:10,
   marginBottom:14,
   padding:14,
 },
 input:{
   borderColor:'#999',
   borderRadius:6,
   borderWidth:1,
   padding:10,
 },
 filter:{
   marginBottom:6,
 },
 error:{
   color:'#b00020',
   marginBottom:12,
 },
 destination:{
   backgroundColor:'#fff',
   borderRadius:10,
   padding:14,
 },
 destinationTitle:{
   color:'#172554',
   fontSize:16,
   fontWeight:'600',
 },
 description:{
   color:'#64748b',
   fontSize:14,
   marginTop:4,
   marginBottom:8,
 },
 action:{
   marginBottom:8,
 },
});