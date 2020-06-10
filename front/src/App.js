import React, {useState, useEffect} from 'react';
import axios from 'axios'
import './App.css';

function App() {
  const [wilderslight, setWilderslight] = useState([])
  const [wilders, setWilders] = useState([])
  const [contain, setContain] = useState('')
  const [filtercontain, setFiltercontain] = useState([])
  const [begin, setBegin] = useState('')
  const [filterbegin, setFilterbegin] = useState([])
  const [supDate, setSupDate] = useState('')
  const [filterSupDate, setFilterSupDate] = useState([])
  const [order, setOrder] = useState('')
  const [ordered, setOrdered] = useState([])
  const [newWilder, setNewWilder] = useState({ firstname: '', lastname: '', formation: '', startdate: Date().substr(0, 10), is_student: false, is_staff: false})
  const [position, setPosition] = useState('')
  const [message, setMessage] = useState('')
  const [amodif, setAModif] = useState('')
  const [modValue, setModValue] = useState('')
  const [idWilder, setIdWilder] = useState()

  
  const deleteStaff = (e) => {
    e.preventDefault()
    axios.delete(`http://localhost:3001/api/wilders/delete/fire`)
      .then(setMessage('Type de Wilder bien supprimé'))
      .then(getWilders)
      .catch(err => console.error(err))

  }

  const deleteStudent = (e) => {
    e.preventDefault()
    axios.delete(`http://localhost:3001/api/wilders/delete/finish`)
      .then(setMessage('Type de Wilder bien supprimé'))
      .then(getWilders)
      .catch(err => console.error(err))

  }

  const deleteId = (e) => {
    e.preventDefault()
    axios.delete(`http://localhost:3001/api/wilders/delete/${idWilder}`)
      .then(setMessage('Wilder bien supprimé'))
      .then(getWilders)
      .catch(err => console.error(err))

  }

  const putToggleStaff = (e) => {
    e.preventDefault()
    axios.put(`http://localhost:3001/api/wilders/${idWilder}/toggleStaff`)
      .then(setMessage('Wilder bien modifié'))
      .then(getWilders)
      .catch(err => console.error(err))

  }

  const putToggleStud = (e) => {
    e.preventDefault()
    axios.put(`http://localhost:3001/api/wilders/${idWilder}/toggleStudent`)
            .then(setMessage('Wilder bien modifié'))
            .then(getWilders)
            .catch(err => console.error(err))

  }
  
  const putOnId = (e) => {
    e.preventDefault()
    amodif === 'firstname' ? 
    axios.put(`http://localhost:3001/api/wilders/modify/${idWilder}`, { firstname : modValue })
    : amodif === 'lastname' ?
    axios.put(`http://localhost:3001/api/wilders/modify/${idWilder}`, { lastname: modValue })
    : amodif === 'formation' ?
    axios.put(`http://localhost:3001/api/wilders/modify/${idWilder}`, { formation: modValue }): ""
      .then(setMessage('Wilder bien modifié')) 
      .then(getWilders)
      .catch(err => console.error(err))
    
  }

  const postWilder = (e) => {
    e.preventDefault()
    position === 'student' ? setNewWilder({ ...newWilder, is_student: true, is_staff: false }) : position === 'staff' ? setNewWilder({ ...newWilder,  is_student: false, is_staff: true }) : setMessage('Choisissez un poste s\'il vous plait')
    setTimeout(() => {
      axios.post(`http://localhost:3001/api/wilders/new`, newWilder)
      .then(setMessage('Wilder bien enregistré'))
      .then(getWilders)
      .catch(err => console.error(err))
    }, 200); 
  }

  const getOrdered = (order) => {
    axios.get(`http://localhost:3001/api/wilders/order/name/${order}`)
      .then(response => setOrdered(response.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    getOrdered(order)
  }, [order])

  const getfilterSupDate = (form) => {
    axios.get(`http://localhost:3001/api/wilders/startdate/${form}`)
      .then(response => setFilterSupDate(response.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    getfilterSupDate(supDate)
  }, [supDate])

  const getfilterBegin = (form) => {
    axios.get(`http://localhost:3001/api/wilders/${form}`)
      .then(response => setFilterbegin(response.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    getfilterBegin(begin)
  }, [begin])

  const getfilterContain = (form) => {
    axios.get(`http://localhost:3001/api/wilders/formation/${form}`)
      .then(response => setFiltercontain(response.data))
      .catch(err => console.error(err))
  }

  
  useEffect(() => {
    getfilterContain(contain)
  }, [contain])

  const getWilders = () => {
    axios.get('http://localhost:3001/api/wilders')
      .then(response => setWilders(response.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    getWilders(wilders)
  }, [wilders])

  const getWilderslight = () => {
    axios.get('http://localhost:3001/api/wilders/light')
    .then(response => setWilderslight(response.data))
    .catch(err => console.error(err))
  }

  useEffect(() => {
    getWilderslight(wilderslight)
  }, [wilderslight])

  return (
    <div className="App">
      <h1>GET - Récupération de l'ensemble des données de ta table</h1>
      <ul>
        {wilders.map(wild =>{
          wild.startdate = wild.startdate.substr(0, 10)
          return (
          <li>Id: {wild.id}, Prénom: {wild.firstname}, Nom: {wild.lastname}, Formation: {wild.formation}, Position: {wild.is_staff ? 'Encadrement Wild' : wild.is_student ? 'Elève wilder' : 'Inconnue'} Arrivée: {wild.startdate}</li>
        )})}
      </ul>
      <h1>GET (light) - Récupération de quelques champs spécifiques (id, names, dates, etc...)</h1>
      <ul>
      {wilderslight.map(wild => 
        <li>Prénom: {wild.firstname}, Nom: {wild.lastname}, Formation:{wild.formation}</li>
      )}
      </ul>
      <h1>GET - Récupération d'un ensemble de données en fonction du filtre formation contient</h1>
      <input type='text' value={contain} onChange={(e) => setContain(e.target.value)}></input>
      <ul>
        {filtercontain.map(wild => {
          wild.startdate = wild.startdate.substr(0, 10)
          return (
            <li>Prénom: {wild.firstname}, Nom: {wild.lastname}, Formation:{wild.formation}, Arrivée {wild.startdate}</li>
          )
        })}
      </ul>
      <h1>GET - Récupération d'un ensemble de données en fonction du filtre prenom commence par</h1>
      <input type='text' value={begin} onChange={(e) => setBegin(e.target.value)}></input>
      <ul>
        {filterbegin.map(wild => {
          wild.startdate = wild.startdate.substr(0, 10)
          return (
            <li>Prénom: {wild.firstname}, Nom: {wild.lastname}, Formation:{wild.formation}, Arrivée {wild.startdate}</li>
          )
        })}
      </ul>
      <h1>GET - Récupération d'un ensemble de données en fonction du filtre date d'entrée supérieure à</h1>
      <input type='date' value={supDate} onChange={(e) => setSupDate(e.target.value)}></input>
      <ul>
        {filterSupDate.map(wild => {
          wild.startdate = wild.startdate.substr(0, 10)
          return (
            <li>Prénom: {wild.firstname}, Nom: {wild.lastname}, Formation:{wild.formation}, Arrivée {wild.startdate}</li>
          )
        })}
      </ul>
      <h1>GET - Récupération de données ordonnées (ascendant, descendant) selon le prénom</h1>
      <select onChange={(e) => setOrder(e.target.value)}>
          <option value='ASC'>Ordre ascendant</option>
          <option value='DESC'>Ordre descendant</option>
      </select>
      <ul>
        {ordered.map(wild => {
          wild.startdate = wild.startdate.substr(0, 10)
          return (
            <li>Prénom: {wild.firstname}, Nom: {wild.lastname}, Formation:{wild.formation}, Arrivée {wild.startdate}</li>
          )
        })}
      </ul>
      <h1>POST - Sauvegarde d'un nouveau Wilder</h1>
      <form onSubmit={postWilder}>
      <input type='text' placeholder='Prénom du nouveau wilder' value={newWilder.firstname} onChange={(e) => setNewWilder({...newWilder, firstname: e.target.value})} />
      <input type='text' placeholder='Nom du nouveau wilder' value={newWilder.lastname} onChange={(e) => setNewWilder({...newWilder,  lastname: e.target.value })} />
      <input type='text' placeholder='Formation du nouveau wilder' value={newWilder.formation} onChange={(e) => setNewWilder({...newWilder,  formation: e.target.value })} />
      <input type='date' placeholder='Arrivée du nouveau wilder' value={newWilder.startdate} onChange={(e) => setNewWilder({...newWilder,  startdate: e.target.value })} />
      <select onChange={(e) => setPosition(e.target.value)}>
        <option value=''>Position du nouveau Wilder</option>
        <option value='student'>Student</option>
        <option value='staff'>Staff</option>
      </select>
      <button type='submit'>Valider</button>
      </form>
      <p>{message}</p>   
      <h1>PUT - Modification d'une entité</h1>
      <form onSubmit={putOnId}>
        <select onChange={(e) => setIdWilder(e.target.value)}>
          <option value=''>Choisissez l'id du wilder à modifier</option>
          {wilders.map(wild =>
            <option value={wild.id}>Id:{wild.id}, Wilder:{wild.firstname} {wild.lastname}, Formation:{wild.formation}</option>
          )}
        </select>
        <select onChange={(e) => setAModif(e.target.value)}>
          <option value=''>Choisissez le champ à modifier</option>
          <option value='firstname'>Prénom</option>
          <option value='lastname'>Nom</option>
          <option value='formation'>Formation</option>
        </select>
        <input type='text' placeholder={`${amodif === 'firstname' ? 'Nouveau prénom' : amodif === 'lastname' ? 'Nouveau nom' : amodif === 'formation' ? 'Nouvelle formation' : ''} du wilder`} value={modValue} onChange={(e) => setModValue(e.target.value)} />
        <button type='submit'>Valider</button>
      </form>
      <p>{message}</p>
      <h1>PUT - Toggle du booléen</h1>
      <form onSubmit={putToggleStud}>
        <select onChange={(e) => setIdWilder(e.target.value)}>
          <option value=''>Choisissez l'id du wilder qui commence ou termine une formation</option>
          {wilders.map(wild =>
            <option value={wild.id}>Id:{wild.id}, Wilder:{wild.firstname} {wild.lastname}, Formation:{wild.formation}</option>
          )}
        </select>
        <button type='submit'>Valider</button>
      </form>
      <form onSubmit={putToggleStaff}>
        <select onChange={(e) => setIdWilder(e.target.value)}>
          <option value=''>Choisissez l'id du wilder qui entre ou sort de l'équipe d'Encadrement</option>
          {wilders.map(wild =>
            <option value={wild.id}>Id:{wild.id}, Wilder:{wild.firstname} {wild.lastname}, Formation:{wild.formation}</option>
          )}
        </select>
        <button type='submit'>Valider</button>
      </form>
      <p>{message}</p>
      <h1>DELETE - Suppression d'une entité</h1>
      <form onSubmit={deleteId}>
        <select onChange={(e) => setIdWilder(e.target.value)}>
          <option value=''>Choisissez l'id du wilder qui commence ou termine une formation</option>
          {wilders.map(wild =>
            <option value={wild.id}>Id:{wild.id}, Wilder:{wild.firstname} {wild.lastname}, Formation:{wild.formation}</option>
          )}
        </select>
        <button type='submit'>Valider</button>
      </form>
      <p>{message}</p>
      <h1>DELETE - Suppression de toutes les entités dont le booléen est false</h1>
      <form onSubmit={deleteStudent}>
        <button type='submit'>supprimer les Eleves</button>
      </form>
      <form onSubmit={deleteStaff}>
        <button type='submit'>supprimer les Encadrants</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default App;
