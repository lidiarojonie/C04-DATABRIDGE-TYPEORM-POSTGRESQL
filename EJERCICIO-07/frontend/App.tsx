import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,Text,View } from 'react-native';

type Sneaker={id:number;marca:string;modelo:string;precio:number;talla:number;stock:number};
const API_URL='http://192.168.1.46:3000';

export default function App(){
 const [items,setItems]=useState<Sneaker[]>([]);
 const [error,setError]=useState('');

 async function request(url:string,options?:RequestInit){
   const r=await fetch(url,options);
   if(!r.ok) throw new Error('HTTP '+r.status);
   return r;
 }

 async function cargar(){
   try{
     const r=await request(API_URL+'/sneakers');
     setItems(await r.json());
     setError('');
   }catch{
     setError('No se pudo conectar con la API.');
   }
 }
 useEffect(()=>{cargar();},[]);

 async function crear(){
   try{
     await request(API_URL+'/sneakers',{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
         marca:'Nike',
         modelo:'Air Max 1',
         precio:149.99,
         talla:42,
         stock:5,
       }),
     });
     await cargar();
   }catch{setError('Error al crear.');}
 }

 async function rebajar(id:number){
   try{
     await request(API_URL+'/sneakers/'+id,{
       method:'PATCH',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({precio:139.99}),
     });
     await cargar();
   }catch{setError('Error al actualizar.');}
 }

 async function eliminar(id:number){
   try{
     await request(API_URL+'/sneakers/'+id,{method:'DELETE'});
     await cargar();
   }catch{setError('Error al eliminar.');}
 }

 return <SafeAreaView>
   <Text>👟 Sneaker Vault</Text>
   {error!==''&&<Text>{error}</Text>}
   <Button title="Nueva" onPress={crear}/>
   <FlatList
     data={items}
     keyExtractor={x=>String(x.id)}
     renderItem={({item})=><View>
       <Text>{item.marca} {item.modelo} · {Number(item.precio).toFixed(2)} €</Text>
       <Text>{item.stock === 0 ? 'AGOTADO' : `Stock: ${item.stock}`}</Text>
       <Button title="Rebajar" onPress={()=>rebajar(item.id)}/>
       <Button title="Eliminar" onPress={()=>eliminar(item.id)}/>
     </View>}
   />
 </SafeAreaView>;
}