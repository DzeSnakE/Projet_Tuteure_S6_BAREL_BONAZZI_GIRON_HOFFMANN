import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonSearchbar, IonButton, IonModal, IonItem, IonLabel, IonAvatar } from '@ionic/react';
import {
  useIonAlert
} from '@ionic/react';
import {
  eyeOutline, eyeSharp,
  trashOutline, trashSharp,
  closeOutline, closeSharp,
  alertCircleOutline, pencilOutline, pencilSharp
} from 'ionicons/icons';

import './Folder.css';
import folderData from "./Folder.type";

import { Link } from 'react-router-dom';
import ModalEditFolder from "../../components/ModalEditFolder";

const Folder: React.FC = () => {
  const [searchFolder, setSearchFolder] = useState('');
  const [data, setData]=useState<any[]>([]);
  const [datac, setDatac]=useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<folderData>();

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [message] = useIonAlert();

  const getData2=()=>{
    fetch('http://localhost:5000/api/folder')
        .then(res=>res.json())
        .then(data=>{
          setData(data);
        })
  }
  const getDataClient=()=>{

    fetch('clients.json'
        ,{
          headers : {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json'
          }
        }).then(function(response){
      console.log(response)
      return response.json();
    }).then(function(datac) {
      console.log(datac);
      setDatac(datac)
    }).catch(function (error) {
      console.log(error);
    });
  }

  const getData=()=>{

    fetch('dossiers.json'
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
    getDataClient()
  },[isOpen, isEdit, setData, setDatac])


  function refreshList() {
    getData()
  }

  const path = require('path');
  const fs = window.require('fs');

  const {register, handleSubmit, reset, formState: {errors}} = useForm({
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
        value:"dossiers.json"
      }
    },
    {
      label: "Code",
      required: true,
      requiredOptions: {
        minLength: 2,
        maxLength: 10
      },
      props: {

        name: "code",
        type: "text",
        placeholder: "Entrez un identifiant"
      }
    },
    {
      label: "Description",
      required: true,
      requiredOptions: {
        minLength: 10,
        maxLength: 50
      },
      props: {

        name: "description",
        type: "textarea",
        placeholder: "Entrez une description"
      }
    },
    {
      label: "Début",
      required: true,
      requiredOptions: {

        minDate: '01/01/2000'
      },
      props: {

        name: "startDate",
        type: "datetime",
        value: date
      }
    },
    {
      label: "endDate",
      required: false,
      requiredOptions: {
        minDate: '01/01/2000'
      },
      props: {
        name: "endDate",
        type: "date",
        inputmode: "datePicker",
      }
    }
  ];

  const dataLength = data.length;

  let pathName:string = path.join(__dirname, './xampp/htdocs/Projet_Tuteure_S6_BAREL_BONAZZI_GIRON_HOFFMANN/electron/app')


  const onSubmit = (data: any) => {
    let file = path.join(pathName, data.filename)
    const id = dataLength
    data = {
      "id": id,
      "code": data.code,
      "description": data.description,
      "status": data.status,
      "startDate": data.startDate,
      "client": data.client,
      "endDate": data.endDate,
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
      var folders = fs.readFileSync(file, 'utf8');
      var list = (folders.length) ? JSON.parse(folders) : [];
      if (list instanceof Array) list.push(data)
      else list = [data]
      fs.writeFileSync(file, JSON.stringify(list, null, 2));
      console.log("Un nouveau dossier a été ajouté !")
    }
    reset()
    getData()
  }

  const deleteFolder = (data:any,index:number) => {
    let file = path.join(pathName, 'dossiers.json');
    if (fs.existsSync(file)) {
      var folders = fs.readFileSync(file, 'utf8');
      var list = (folders.length) ? JSON.parse(folders) : [];
      if (list instanceof Array) list.splice(index, 1)
      for(let i = 0;i<list.length;i++){
        list[i].id = i;
      }
      fs.writeFileSync(file, JSON.stringify(list, null, 2));
      console.log("Le dossier a été supprimé! ")
    }else {
      console.log('erreur,ça ne fonctionne pas')
    }
    getData()
  }


  function modFolder(folder: any) {
    setSelectedFolder(folder)
    setIsEdit(true)
  }

  function addFolder() {
    setIsEdit(false)
    setIsOpen(true)
  }

  return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Dossiers</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">

          <select id="sortByFolder">
            <option> Afficher affaires en cours et clôturées </option>
            <option> Afficher affaires en cours </option>
            <option> Afficher affaires clôturées </option>
          </select>

          <IonSearchbar id="searchBar" value={searchFolder} onIonChange={e => setSearchFolder(e.detail.value!)} placeholder="Rechercher un Dossier ..."/>

          <table>
            <thead>
            <tr>
              <th id="headCode">Code</th>
              <th id="headStatut">Statut</th>
              <th id="headClients">Clients</th>
              <th id="headActions">Actions</th>
            </tr>
            </thead>
            <tbody>
            {data && data.length>0 && data.map((folder: folderData, index: number) => {
              return (
                  <tr key={index}>
                    <td id="code">{folder.code}</td>
                    <td id="statut">{folder.status}</td>
                    <td id="clients">{[...folder.client]+ ","}</td>
                    <td id="actions">
                      <Link to={`/dossiers/${folder.id}`}>
                        <IonButton id="eyeButton" color="primary" size="small">
                          <IonIcon id="eyeIcon" slot="icon-only" ios={eyeOutline} md={eyeSharp} />
                        </IonButton>
                      </Link>
                      <IonButton color='warning' onClick={() => {
                        modFolder(folder)
                      }}>
                        <IonIcon ios={pencilOutline} md={pencilSharp}/></IonButton>
                      <IonButton  color="danger" size="small"
                                  onClick={() =>  message({
                                    cssClass: 'my-css',
                                    header: "Supprimer un dossier",
                                    message: "Voulez-vous vraiment supprimer ce dossier ?",
                                    buttons: [
                                      {text: 'Annuler', role: 'cancel'},
                                      {text: 'Confirmer', handler: () => deleteFolder(data, folder.id)}
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
          <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
            <IonContent>
              <IonButton color="danger" id="closeModal" onClick={() => setIsOpen(false)}>
                <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp}/>
              </IonButton>
              <h3 className="titleModal">Nouveau Dossier</h3>

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
                <IonItem>
                  <IonLabel position="fixed">Statut</IonLabel>
                  <select {...register("status")}>
                    <option value="en cours">en cours</option>
                    <option value="terminé">terminé</option>
                  </select>
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">Nom du client</IonLabel>
                  <select {...register("client")} onChange={refreshList} multiple={true}>
                    <option>--sélectionnez--</option>
                    {datac && datac.length>0 && datac.map((user: any) => {
                      return (
                          <option key={user.id} value={user.lastname + " " + user.firstname}>{user.lastname + " " + user.firstname}</option>
                      );
                    })})
                  </select>
                </IonItem>
                <IonButton type="submit" className="btnSubmit">Ajouter</IonButton>
              </form>
            </IonContent>
          </IonModal>
          <IonButton id="btnNewClient" onClick={() => addFolder()}>Ajouter un dossier</IonButton>
          {selectedFolder ? (
              <ModalEditFolder
                  folder={selectedFolder}
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

export default Folder;
