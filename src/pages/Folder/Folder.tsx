import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, 
  IonSearchbar, IonButton, IonModal, IonItem, IonLabel, IonAvatar } from '@ionic/react';

import {
  eyeOutline, eyeSharp,
  createOutline, createSharp,
  trashOutline, trashSharp,
  closeOutline, closeSharp,
  alertCircleOutline
} from 'ionicons/icons';

import './Folder.css';

interface SearchbarChangeEventDetail {
  value?: string;
}

const Folder: React.FC = () => {
  const [searchFolder, setSearchFolder] = useState('');
  const [data, setData]=useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const getData=()=>{
    fetch('http://localhost:5000/api/folder')
    .then(res=>res.json())
    .then(data=>{
      setData(data);
    })
  }

  function btnUpdate() {
    getData()
  }

  const path = require('path');
  const fs = window.require('fs');

  const {register, handleSubmit, formState: {errors}} = useForm({
    mode: "onTouched",
    reValidateMode: "onChange"
  });

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
        placeholder: "fichier de sauvegarde"
      }
    },
    {
      label: "Code",
      required: true,
      requiredOptions: {
        minLength: 2,
        maxLength: 20
      },
      props: {
        name: "code",
        type: "text",
        placeholder: "Entrez un code"
      }
    },
    {
      label: "Description",
      required: true,
      requiredOptions: {
        minLength: 2,
        maxLength: 250
      },
      props: {
        name: "description",
        type: "text",
        placeholder: "Entrez une description"
      }
    },
    {
      label: "Statut",
      required: true,
      requiredOptions: {
        minLength: 2,
        maxLength: 5
      },
      props: {
        name: "statut",
        type: "boolean",
        placeholder: "Choisir le statut"
      }
    },
    {
      label: "StartDate",
      required: true,
      requiredOptions: {
        minDate: '01/01/2000'
      },
      props: {
        name: "EndDate",
        type: "date",
        inputmode: "datePicker",
        placeholder: "jj/mm/AAAA"
      }
    },
    {
      label: "endDate",
      required: true,
      requiredOptions: {
        minDate: '01/01/2000'
      },
      props: {
        name: "endDate",
        type: "date",
        inputmode: "datePicker",
        placeholder: "jj/mm/AAAA"
      }
    }
  ];
  
  console.log(errors);
  let pathName:string = path.join(__dirname, './xampp/htdocs/Projet_Tuteure_S6_BAREL_BONAZZI_GIRON_HOFFMANN/electron/app')

  const onSubmit = (data: any, e:any) => {
    let file = path.join(pathName, data.filename)

    data = {
      "code": data.code,
      "description": data.description,
      "statut": data.statut,
      "startDate": data.startDate,
      "endDate": data.endDate
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
        console.log("Un nouveau dossier a été ajouté ! ")
    }
    e.target.reset()
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
        <h6> Ici sont répertoriés nos différents Dossiers </h6>

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
            {data && data.length>0 && data.map((folder: any, key: number) => {

              return (
                <tr key={key}>
                  <td id="code">{folder.code}</td>
                  <td id="statut">{folder.statut}</td>
                  <td id="clients">{folder.user.lastname + " " + folder.user.firstname}</td>
                  <td id="actions">
                    <IonButton onClick={() => setShowViewModal(true)} id="eyeButton" color="primary" size="small"><IonIcon id="eyeIcon" slot="icon-only" ios={eyeOutline} md={eyeSharp} /></IonButton>
                    <IonButton onClick={() => setShowEditModal(true)} id="createButton" color="warning" size="small"><IonIcon id="createIcon" slot="icon-only" ios={createOutline} md={createSharp} /></IonButton>
                    <IonButton id="trashButton" color="danger" size="small"><IonIcon id="trashIcon" slot="icon-only" ios={trashOutline} md={trashSharp} /></IonButton>  
                  </td>
                </tr>
              );
            })}

            <tr>
              <td id="code"> </td>
              <td id="statut"> </td>
              <td id="clients"> </td>
              <td id="actions">
                <IonButton onClick={() => setShowViewModal(true)} id="eyeButton" color="primary" size="small"><IonIcon id="eyeIcon" slot="icon-only" ios={eyeOutline} md={eyeSharp} /></IonButton>
                <IonButton onClick={() => setShowEditModal(true)} id="createButton" color="warning" size="small"><IonIcon id="createIcon" slot="icon-only" ios={createOutline} md={createSharp} /></IonButton>
                <IonButton id="trashButton" color="danger" size="small"><IonIcon id="trashIcon" slot="icon-only" ios={trashOutline} md={trashSharp} /></IonButton>  
              </td>
            </tr>
          </tbody>
        </table> 

        <IonModal isOpen={showViewModal}>
          <IonContent>
            <IonButton id="closeModal" onClick={() => setShowViewModal(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
            </IonButton>
            {data && data.length>0 && data.map((folder: any, key: number) => {
              return (
                <div key={key}>
                  <h5 className="titleModal">{"Dossier > " + folder.code}</h5>

                  <div className="modalButtons">
                    <IonButton id="btnNewFolder" onClick={() => setShowEditModal(true)}>Modifier Dossier</IonButton>
                    <IonButton color="danger">Supprimer</IonButton>
                  </div>

                  <h3>{folder.code}</h3>
                  <h6>{folder.statut}</h6>
                  <h6>{"Affaire ouverte le " + folder.creationDate}</h6>

                  <h4>Description</h4>
                  <p>{folder.description}</p>

                  <h4>Clients concernés</h4>
                  <p>{folder.user.lastname + " " + folder.user.firstname}</p>

                  <h4>Evenements</h4>
                  <ul>
                    <li>{folder.event.date + " (" + folder.event.duration + "h) - " + folder.event.description}</li>
                  </ul>
                  <IonButton id="btnNewEvent">Ajouter un évènement</IonButton>

                  <h4>{"Total : " + folder.event.total.duration + "h"}</h4>
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
            <h5 className="titleModal">Création d'un Dossier</h5>

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

        <IonButton id="btnNewFolder" onClick={() => setShowEditModal(true)}>Ajouter un dossier</IonButton>
        <IonButton id="btnRefresh" color="success" onClick={btnUpdate}>Mettre à jour</IonButton>

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
