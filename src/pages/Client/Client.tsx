import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonButton, IonModal, IonItem, IonLabel} from '@ionic/react';
import clientData from "./Client.type";
import {
  eyeOutline, eyeSharp,
  createOutline, createSharp,
  trashOutline, trashSharp,
  closeOutline, closeSharp,
  alertCircleOutline
} from 'ionicons/icons';

import './Client.css';
import {
  useIonAlert
} from '@ionic/react';
import { Link } from 'react-router-dom';
import ModalEditClient from "../../components/ModalEditClient";

interface SearchbarChangeEventDetail {
  value?: string;
}


const Client: React.FC = () => {

  const [data, setData]=useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<clientData>();

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("");
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
      console.log(error);
    });
  }
  useEffect(()=>{
    getData()
  },[isOpen, isEdit, setData])

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
    setIsEdit(true)
  }
  function addClient() {
    setIsEdit(false)
    setIsOpen(true)
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
            {dataSearch && dataSearch.length>0 && dataSearch.map((client: clientData, index:number) => {
              return (
                <tr key={index}>
                  <td id="name">{client.lastname + " " + client.firstname}</td>
                  <td id="affairs">Affaires associées</td>
                  <td id="actions">
                    <Link to={`/clients/${client.id}`}>
                      <IonButton id="eyeButton" color="primary" size="small">
                        <IonIcon id="eyeIcon" slot="icon-only" ios={eyeOutline} md={eyeSharp} />
                      </IonButton>
                    </Link>
                    <IonButton  onClick={() => modClient(client)}  color="warning" size="small"><IonIcon id="createIcon" slot="icon-only" ios={createOutline} md={createSharp} /></IonButton>
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
              )})};
          </tbody>
        </table>
        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
          <IonContent>
            <IonButton color="danger" id="closeModal" onClick={() => setIsOpen(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp}/>
            </IonButton>
            <h3 className="titleModal">Nouveau Client</h3>

            <form className="formModal" onSubmit={handleSubmit(onSubmit)}>
              {fields.map((field, index) => {

                const {label, required, requiredOptions, props} = field;
                return (
                    <IonItem key={`form_field_${index}`} lines="full">
                      <>
                        <IonLabel position="fixed">{label}</IonLabel>
                        <input
                            className="inputForm" {...props} {...register(props.name, {required, ...requiredOptions})} />
                      </>

                      {required && errors[props.name] && <IonIcon icon={alertCircleOutline} color="danger"/>}
                    </IonItem>
                );
              })}

              <IonButton type="submit" className="btnSubmit">Ajouter</IonButton>
            </form>
          </IonContent>
        </IonModal>
        <IonButton id="btnNewClient" onClick={() => addClient()}>Ajouter un client</IonButton>
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
