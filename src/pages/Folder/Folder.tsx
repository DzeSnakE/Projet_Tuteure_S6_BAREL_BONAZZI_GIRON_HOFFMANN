import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonSearchbar, IonButton, IonModal, IonItem, IonLabel, IonAvatar } from '@ionic/react';
import {
  useIonAlert
} from '@ionic/react';
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
  const [data, setData]=useState<any[]>([]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [message] = useIonAlert();

  const getData2=()=>{
    fetch('http://localhost:5000/api/folder')
    .then(res=>res.json())
    .then(data=>{
      setData(data);
    })
  }

  const getData = ()=>{
    Promise.all([
      fetch('clients.json'),
      fetch('dossiers.json')
    ]).then(function (responses) {
      // Get a JSON object from each of the responses
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(function (data) {
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


  function refreshList() {
    getData()
  }

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

  console.log(errors);
  let pathName:string = path.join(__dirname, './xampp/htdocs/Projet_Tuteure_S6_BAREL_BONAZZI_GIRON_HOFFMANN/electron/app')

  const onSubmit = (data: any, e:any) => {
    let file = path.join(pathName, data.filename)

    data = {
      "code": data.code,
      "description": data.description,
      "status": data.status,
      "startDate": data.startDate,
      "client": data.client,
      "endDate": data.endDate,
      "contrat": [
        {
          "code": data.code,
          "id": data.client
        }
      ]
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
    e.target.reset()
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
          {data && data.length>0 && data[1].map((folder: any, index: number) => {
            return (
               <tr key={index}>
                <td id="code">{folder.code}</td>
                  <td id="statut">{folder.status}</td>
                  <td id="clients">{[...folder.client]+ ","}</td>
                  <td id="actions">
                    <IonButton onClick={() => setShowViewModal(true)} id="eyeButton" color="primary" size="small"><IonIcon id="eyeIcon" slot="icon-only" ios={eyeOutline} md={eyeSharp} /></IonButton>
                    <IonButton onClick={() => setShowEditModal(true)} id="createButton" color="warning" size="small"><IonIcon id="createIcon" slot="icon-only" ios={createOutline} md={createSharp} /></IonButton>
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

        <IonModal isOpen={showViewModal}>
          <IonContent>
            <IonButton id="closeModal" onClick={() => setShowViewModal(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
            </IonButton>
            {data && data.length>0 && data[1].map((folder: any, index: number) => {
              return (
                <div key={index}>
                  <h5 className="titleModal">{"Dossier > " + folder.code}</h5>

                  <div className="modalButtons" key={index}>
                    <IonButton id="btnNewFolder" onClick={() => setShowEditModal(true)}>Modifier Dossier</IonButton>
                    <IonButton color="danger">Supprimer</IonButton>
                  </div>

                  <h3>{folder.code}</h3>
                  <h6>{folder.status}</h6>
                  <h6>{"Affaire ouverte le " + folder.startDate}</h6>

                  <h4>Description</h4>
                  <p>{folder.description}</p>

                  <h4>Clients concernés</h4>

                  <p>{[...folder.client]+ ","}</p>

                  <h4>Evenements</h4>
                  <ul>
                    <li>/</li>
                  </ul>
                  <IonButton id="btnNewEvent">Ajouter un évènement</IonButton>

                  <h4>/</h4>
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
              <IonItem>
                <IonLabel position="fixed">Statut</IonLabel>
                <select {...register("status")}>
                  <option value="pending">en cours</option>
                  <option value="done">terminé</option>
                </select>
              </IonItem>
              <IonItem>
                <IonLabel position="fixed">Nom du client</IonLabel>
                <select {...register("client")} onChange={refreshList} multiple={true}>
                  <option>--sélectionnez--</option>
                  {data && data.length>0 && data[0].map((user: any) => {
                    return (
                        <option key={user.id} value={user.lastname + " " + user.firstname}>{user.lastname + " " + user.firstname}</option>
                    );
                  })})
                </select>
              </IonItem>
              <IonButton type="submit" id="btnSubmit">Ajouter</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonButton id="btnNewFolder" onClick={() => setShowEditModal(true)}>Ajouter un dossier</IonButton>

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
