'use client'
import Image from 'next/image'
import styles from './page.module.css'
import Header from './components/Header'
import {v4 as uuidv4} from 'uuid'
import { useEffect, useState } from 'react'
import { db, storage } from './firebase.config'
import { collection, setDoc, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

export default function Home() {

  const {locations, clients, products} = {}
  const [id, setId] = useState("")
  const [updateID, setUpdateID] = useState("")
  const [progress, setProgress] = useState(0)

  const [newClient, setNewClient] = useState({
    "name": "",
    "dispositive": "",
    "service": "",
    "in_date": "",
    "status": "",
    "location": "",
  })

  const [newProduct, setNewProduct] = useState({
    "title": "",
    "description": "",
    "image": "",
    "button_color": ""
  })
  
  const onChangeClient=(e)=>
  {
    setNewClient((prevState)=>
    ({
      ...prevState,
      [e.target.id]: [e.target.value],
    }))
  }

  const onChangeProd=(e)=>
  {
    setNewProduct((prevState)=>
    ({
      ...prevState,
      [e.target.id]: [e.target.value],
    }))
  }
  
  const onSubmitClient=async(e)=>
  {
    e.preventDefault()
    if(newClient.location!= "")
    {
      const clientsRef = doc(db, 'clients', id)
      await setDoc(clientsRef, newClient)
      .then(()=>
      {
        alert("Cliente "+id+" agregado. Id copiado al portapapeles")
        navigator.clipboard.writeText(id)
        location.reload()
      })
    }
    else
    {
      alert("Debe rellenar la direccion del taller")
    }
  }

  const onSubmitProd=async(e)=>
  {
    e.preventDefault()
    updloadFile(document.getElementById("prodImage").value)
    // newProduct.button_color = products.length%2 === 0 ? "#04BA56" : "#0495BA"
    // const clientsRef = doc(db, 'products', id)
    // await setDoc(clientsRef, newProduct)
    // .then(()=>alert("Producto "+id+" agregado. Id copiado al portapapeles"))
    // navigator.clipboard.writeText(id)
    // location.reload()
  }

  const handleDelete=async(e)=>
  {
    e.preventDefault()
    const ID = document.getElementById("deleteID").value
    const docum = doc(db, 'clients', ID)
    await deleteDoc(docum)
    .then(()=>
    {
      alert("Cliente "+ID+" eliminado")
      location.reload()
    })
  }

  const handleUpdate=async(e)=>
  {
    e.preventDefault()
    
    const clientRef = doc(db, 'clients', updateID)
    await updateDoc(clientRef, {"status": document.getElementById("statusUpdt").value})
    .then(
      alert("Estado actualizado")
    )
  }

  const updloadFile=(file)=>
  {
    if(!file) return;
    const storageRef = ref(storage, `/files/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on(
      "state_changed",
      (snapshot)=>{
        const progr = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setProgress(progr)
      }
    ),
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((url)=>console.log(url))
    }
  }
  
  useEffect(()=>
  { 
    setId(uuidv4())
  },[])

  return (
    <main>
      <Header />
      <div className="adminPanel">
        <div className="column">
          <h2>Nuevo Cliente</h2> <p id="ID">{id} <span style={{color:"gray", fontWeight:"bold", cursor:"pointer", border:"solid", padding:"0.2%", borderWidth:"2px"}} onClick={()=>(navigator.clipboard.writeText(id),alert("Id copiado al portapapeles"))}>COPIAR</span></p>
          <h3>Detalles:</h3>
          <form action="">
            <p>Nombre:</p>
            <input required type="text" name="name" id="name" onChange={onChangeClient}/>

            <p>Dispositivo:</p>
            <input required type="text" name="dispositive" id="dispositive" onChange={onChangeClient}/>

            <p>Servicio:</p>
            <input required type="text" name="service" id="service" onChange={onChangeClient}/>
            
            <p>Fecha de entrada al taller:</p>
            <input required type="date" name="in_date" id="in_date" onChange={onChangeClient}/>

            <p>Estado</p>
            <select name="" id="status" onChange={onChangeClient}>
              <option value=""></option>
              <option value="working">En proceso</option>
            </select>

            <p>Taller:</p>
            <select name="location" id="location" onChange={onChangeClient}>
              <option value=""></option>
              {locations.map((location, index)=>
              (
                <option key={index} value={location.id}>{location.id}. {location.address}</option>
              ))}
            </select>
            <br />
            <button className='primaryButton adminButton' onClick={onSubmitClient}>Añadir Cliente</button>
          </form>
        </div>
        <div className="column">
          <h2>Estado de Reparación</h2>
          <form action="">
            <div className="line">
              <div className="left">
                <p>ID Cliente</p>
                <select name="ID" id="idUpdt" onChange={()=>setUpdateID(document.getElementById("idUpdt").value)}>
                  <option value=""></option>
                  {clients.map((client, index)=>
                  (
                    <option key={index} value={client.id}>{client.id}</option>
                  ))}
                </select>
              </div>
              <div className="right">
                <p>Estado</p>
                <select name="status" id="statusUpdt">
                  <option value="working">En proceso</option>
                  <option value="ready">Listo para recoger</option>
                </select>
              </div>
            </div>
            <br />
            <button className='primaryButton adminButton' onClick={handleUpdate}>Actualizar</button>
          </form>

          <h2>Añadir Producto</h2>
          <form action="">
            <p>Nombre del producto</p>
            <input required type="text" name="title" id="title" onChange={onChangeProd}/>

            <p>Descripción</p>
            <input required type="text" name="description" id="description" onChange={onChangeProd}/>

            <p>Imagen</p>
            <input type="file" accept='image/*' name="" id="prodImage" />
            <h3>{progress}%</h3>
            <button className='primaryButton adminButton' onClick={onSubmitProd}>Añadir Producto</button>
          </form>
        </div>
        <div className="column">
          <h2>Eliminar Cliente</h2>
          <form action="">
            <select name="" id="deleteID">
              {clients.map((client, index)=>
              (
                <option key={index} value={client.id}>{client.id}</option>
              ))}
            </select>
            <br />
            <button className='primaryButton adminButton' onClick={handleDelete}>Eliminar Cliente</button>
          </form>
        </div>
      </div>
    </main>
    )
}
