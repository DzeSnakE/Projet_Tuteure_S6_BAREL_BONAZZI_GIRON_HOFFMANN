import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonSearchbar, IonButton, IonModal, IonItem, IonLabel, IonAvatar } from '@ionic/react';
import clientData from "./Client.type";
import {
  eyeOutline, eyeSharp,
  createOutline, createSharp,
  trashOutline, trashSharp,
  closeOutline, closeSharp,
  alertCircleOutline
} from 'ionicons/icons';
//import nextId from "react-id-generator";
import './Client.css';
import {
  useIonAlert
} from '@ionic/react';
interface SearchbarChangeEventDetail {
  value?: string;
}

const Client: React.FC = () => {
  const [searchClient, setSearchClient] = useState('');
  const [data, setData]=useState<any[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<clientData>();
  const [edit, setEdit] = useState(false);
  const [message] = useIonAlert();
  const clientsLength = data.length;
  const getData2=()=>{
    fetch('http://localhost:5000/api/client')
    .then(res=>res.json())
    .then(data=>{
      setData(data);
    })
  }
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
      // if there's an error, log it
      console.log(error);
    });
  }
  useEffect(()=>{
    getData()
  },[])


  const path = require('path');
  const fs = window.require('fs');

  const {register, handleSubmit, formState: {errors}} = useForm({
    mode: "onTouched",
    reValidateMode: "onChange"
  });
  const date = new Date().toLocaleDateString();
  const fields = [
    {
      label: "Filename",
      required: true,
      requiredOptions: {
        minLength: 2,
        maxLength: 20
      },
      props: {
        name: "filename",
        type: "text",
        value: "clients.json",
        placeholder: "fichier de sauvegarde"
      }
    },
    {
      label: "Code client",
      required: true,
      requiredOptions: {
        minLength: 2,
        maxLength: 10
      },
      props: {
        name: "codeClient",
        type: "text",
        placeholder: "Entrez un code client"
      }
    },
    {
      label: "Firstname",
      required: true,
      requiredOptions: {
        minLength: 2,
        maxLength: 20
      },
      props: {
        name: "firstname",
        type: "text",
        placeholder: "Entrez un prénom"
      }
    },
    {
      label: "Lastname",
      required: true,
      requiredOptions: {
        minLength: 2,
        maxLength: 20
      },
      props: {
        name: "lastname",
        type: "text",
        placeholder: "Entrez un nom"
      }
    },
    {
      label: "Birthdate",
      required: true,
      requiredOptions: {
        minDate: '01/01/2000'
      },
      props: {
        name: "birthdate",
        type: "date",
      }
    },
    {
      label: "Address",
      required: true,
      requiredOptions: {
        minLength: 10,
        maxLength: 50
      },
      props: {
        name: "address",
        type: "text",
        placeholder: "Entrez une adresse"
      }
    },
    {
      label: "Inscription",
      required: true,
      requiredOptions: {

        minDate: '01/01/2000'
      },
      props: {
        name: "inscription",
        type: "Datetime",
        value: date,
      }
    }
  ];
  
  console.log(errors);
  let pathName:string = path.join(__dirname, './xampp/htdocs/Projet_Tuteure_S6_BAREL_BONAZZI_GIRON_HOFFMANN/electron/app')

  const onSubmit = (data: any, e:any) => {
    let file = path.join(pathName, data.filename)
    const id = clientsLength;
    data = {
      "id": id,
      "codeClient":data.codeClient,
      "lastname": data.lastname,
      "firstname": data.firstname,
      "birthdate": data.birthdate,
      "address": data.address,
      "inscription": data.inscription
    }

    console.log(data);

    if (!fs.existsSync(file)) {
        fs.writeFile(file, JSON.stringify([data], null, 2), (error: any) => {
            if (error) {
                console.log(error)
            }
            console.log("Le fichier a été créé avec succès !")
        });
    } else {
        var clients = fs.readFileSync(file, 'utf8');
        var list = (clients.length) ? JSON.parse(clients) : [];
        if (list instanceof Array) list.push(data)
        else list = [data]
        fs.writeFileSync(file, JSON.stringify(list, null, 2));
        console.log("Un nouveau client a été ajouté ! ")
        e.target.reset()
    }
    e.target.reset()
    getData()
  }


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
    setEdit(true)
    setShowViewModal(true)
  }

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
        <IonSearchbar id="searchBar" value={searchClient} onIonChange={e => setSearchClient(e.detail.value!)} placeholder="Rechercher un Client ..."/>
      
        <table>
          <thead>
            <tr>
              <th id="headName">Nom</th>
              <th id="headAffairs">Affaires associées</th>
              <th id="headActions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length>0 && data.map((client: any, index:number) => {
              return (
                <tr key={index}>
                  <td id="name">{client.lastname + " " + client.firstname}</td>
                  <td id="affairs">Affaires associées</td>
                  <td id="actions">
                    <IonButton  color="primary" size="small"><IonIcon id="eyeIcon" slot="icon-only" ios={eyeOutline} md={eyeSharp} /></IonButton>
                    <IonButton  onClick={() => modClient(client)}  color="warning" size="small"><IonIcon id="createIcon" slot="icon-only" ios={createOutline} md={createSharp} /></IonButton>
                    <IonButton  color="danger" size="small"
                                onClick={() =>  message({
                                  cssClass: 'my-css',
                                  header: "Supprimer un client",
                                  message: "Voulez-vous vraiment supprimer ce client ?",
                                  buttons: [
                                    {text: 'Annuler', role: 'cancel'},
                                    {text: 'Confirmer', handler: () => deleteClient(data, client.id)}
                                  ],
                                })
                                }
                                >
                                  <IonIcon id="trashIcon" slot="icon-only" ios={trashOutline} md={trashSharp}/>
                    </IonButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table> 

        <IonModal isOpen={showViewModal}>
          <IonContent>
            <IonButton id="closeModal" onClick={() => setShowViewModal(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
            </IonButton>
            {data && data.length>0 && data.map((client: clientData) => {
              return (

                <div key={client.id}>

                  <h5 className="titleModal">{"Clients > " + selectedClient?.firstname + " " + selectedClient?.lastname}</h5>

                  <div className="modalButtons">
                    <IonButton id="btnNewClient" onClick={() => setShowEditModal(true)}>Modifier Client</IonButton>
                    <IonButton color="danger">Supprimer</IonButton>
                  </div>

                        <IonAvatar>
                          <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"/>
                        </IonAvatar>
                        <h3>{selectedClient?.codeClient}</h3>
                        <h3>{selectedClient?.firstname + " " + selectedClient?.lastname}</h3>
                        <h6>{"client depuis " + selectedClient?.inscription}</h6>

                        <h4>Adresse</h4>
                        <p>{selectedClient?.address}</p>

                        <h4>Date de naissance</h4>
                        <p>{selectedClient?.birthdate}</p>

                        <h4>Dossiers associés</h4>
                        <p>AZ/0987</p>
                        <hr/>

                </div>
              );
            })}
          </IonContent>
        </IonModal>
        <IonModal isOpen={showEditModal}>
          <IonContent>
            <IonButton id="closeModal" onClick={() => setShowEditModal(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
            </IonButton>
            <h5 className="titleModal">Création/Edition d'un Client</h5>

            <form className="formModal" onSubmit={handleSubmit(onSubmit)}>
              {fields.map((field, index) => {
                const {label, required, requiredOptions, props} = field;
                
                return (
                  <IonItem key={`form_field_${index}`} lines="full">
                    <>
                      <IonLabel position="fixed">{label}</IonLabel>
                      <input {...props} {...register(props.name, {required, ...requiredOptions})} />
                    </>

                    {required && errors[props.name] && <IonIcon icon={alertCircleOutline} color="danger"/>}
                  </IonItem>
                );
              })}

              <IonButton type="submit" id="btnSubmit">Ajouter</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonButton id="btnNewClient" onClick={() => setShowEditModal(true)}>Ajouter un client</IonButton>

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
