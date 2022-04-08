import React, {useEffect, useState} from 'react';

import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonButton, IonItem} from '@ionic/react';
import clientData from "./Client.type";
import {
  eyeOutline, eyeSharp,
  trashOutline, trashSharp, pencilSharp, pencilOutline, addOutline
} from 'ionicons/icons';

import './Client.css';
import {
  useIonAlert
} from '@ionic/react';
import { Link } from 'react-router-dom';
import ModalEditClient from "../../components/ModalEditClient";
import ModalCreateClient from "../../components/ModalCreateClient";


const Client: React.FC = () => {

  const [data, setData]=useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<clientData>();

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [message] = useIonAlert();


  const getData=()=>{

    fetch('clients.json'
        ,{
          headers : {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json'
          }
        }).then(function(response){
          console.log(response)
          return response.json();
        }).then(function(data) {
          console.log(data);
          setData(data)
    }).catch(function (error) {
      console.log(error);
    });
  }
  useEffect(()=>{
    getData()
  },[isOpen, isEdit, setData])

  const path = require('path');
  const fs = window.require('fs');


  let pathName:string = path.join(__dirname, './xampp/htdocs/Projet_Tuteure_S6_BAREL_BONAZZI_GIRON_HOFFMANN/electron/app')


  const deleteClient = (data:any,index:number) => {
    let file = path.join(pathName, 'clients.json');
    if (fs.existsSync(file)) {
      var clients = fs.readFileSync(file, 'utf8');
      var list = (clients.length) ? JSON.parse(clients) : [];
      if (list instanceof Array) list.splice(index, 1)
      for(let i = 0;i<list.length;i++){
        list[i].id = i;
      }
      fs.writeFileSync(file, JSON.stringify(list, null, 2));
      console.log("Le client a été supprimé! ")
    }else {
      console.log('erreur,ça ne fonctionne pas')
    }
    getData()
  }


  function modClient(client: any) {

    setSelectedClient(client)
    setIsEdit(true)
  }


  const searchText = (e:any) => {
    setActiveFilter(e.target.value);
  }

  let dataSearch = data.filter(item => {

    return Object.keys(item).some(key =>
        item["lastname"].toString().toLowerCase().includes(activeFilter.toString().toLowerCase())
    )});

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Clients</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        Tri par nom: <input type="text" value={activeFilter} onChange={searchText}/>
        <table>
          <thead>
            <tr>
              <th id="headName">Nom</th>
              <th id="headAffairs">Affaires associées</th>
              <th id="headActions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataSearch && dataSearch.length>0 && dataSearch.map((client: clientData) => {
              return (
                <tr key={client.id}>
                  <td id="name">{client.lastname + " " + client.firstname}</td>
                  <td id="affairs">Affaires associées</td>
                  <td id="actions">
                    <Link to={`/clients/${client.id}`}>
                      <IonButton id="eyeButton" color="primary" size="small">
                        <IonIcon id="eyeIcon" slot="icon-only" ios={eyeOutline} md={eyeSharp} />
                      </IonButton>
                    </Link>
                    <IonButton color='warning' onClick={() => {
                      modClient(client)
                    }}>
                      <IonIcon ios={pencilOutline} md={pencilSharp}/></IonButton>
                    <IonButton  color="danger" size="small"
                                onClick={() =>  message({
                                  cssClass: 'my-css',
                                  header: "Supprimer un client",
                                  message: "Voulez-vous vraiment supprimer ce client ?",
                                  buttons: [
                                    {text: 'Annuler', role: 'cancel'},
                                    {text: 'Confirmer', handler: () => deleteClient(client, client.id)}
                                  ],
                                })
                                }
                                >
                                  <IonIcon id="trashIcon" slot="icon-only" ios={trashOutline} md={trashSharp}/>
                    </IonButton>
                  </td>
                </tr>
              )})}
          </tbody>
        </table>
        <ModalCreateClient
            isOpen={isOpen}
            setIsOpen={() => setIsOpen(false)}
        />
        <IonItem lines='none'>
          <IonButtons slot='end'>
            <IonButton color='primary' onClick={() => {
              setIsOpen(true)
            }}>
              <IonIcon icon={addOutline}/>Ajouter
            </IonButton>
          </IonButtons>
        </IonItem>
        {selectedClient ? (
            <ModalEditClient
                client={selectedClient}
                isOpen={isEdit}
                setIsOpen={() => setIsEdit(false)}
            />
        ) : null}

        <div className="pagination">
          <a href="#">Précédent</a>
          <a href="#" className="active">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <a href="#">Suivant</a>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Client;
