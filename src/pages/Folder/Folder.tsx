import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, 
  IonSearchbar, IonButton, IonModal, IonItem, IonLabel, useIonAlert } from '@ionic/react';

import {
  eyeOutline, eyeSharp,
  createOutline, createSharp,
  trashOutline, trashSharp,
  closeOutline, closeSharp,
  alertCircleOutline
} from 'ionicons/icons';

import './Folder.css';

const Folder: React.FC = () => {
  const [searchFolder, setSearchFolder] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [message] = useIonAlert();

  const [APIData, setAPIData] = useState<any[]>([]);
  useEffect(() => {
    axios.get(`http://localhost:3000/case`)
      .then((response) => {
        console.log(response.data)
        setAPIData(response.data);
      })
  }, []);

  const setData = (data: { id: any; code: string; description: string; startDate: string; status: string; endDate: string; }) => {
    let { id, code, description, startDate, status, endDate} = data;
    localStorage.setItem('ID', id);
    localStorage.setItem('Code', code);
    localStorage.setItem('Description', description);
    localStorage.setItem('Start date', startDate);
    localStorage.setItem('Status', status);
    localStorage.setItem('End date', endDate);
  }

  const getData = () => {
    axios.get(`http://localhost:3000/case`)
      .then((getData) => {
        setAPIData(getData.data);
      })
  }

  const getStatusTrue = () => {
    axios.get(`http://localhost:3000/case/status/true`)
      .then((getStatusTrue) => {
        setAPIData(getStatusTrue.data);
      })
  }

  const getStatusFalse = () => {
    axios.get(`http://localhost:3000/case/status/false`)
      .then((getStatusFalse) => {
        setAPIData(getStatusFalse.data);
      })
  }

  const onDelete = (id: any) => {
    axios.delete(`http://localhost:3000/case/${id}`)
    .then(() => {
      getData();
    })
  }

  const {register, handleSubmit, formState: {errors}} = useForm({
    mode: "onTouched",
    reValidateMode: "onChange"
  });

  const fields = [
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
        placeholder: "aaaa-bbbb-cccc-dddd"
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
        placeholder: "Description du dossier ..."
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
        placeholder: "(0 : En cours, 1 : Clôturé)"
      }
    },
    {
      label: "Date début",
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
      label: "Date fin",
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
        <h5 id="titlePageFolder"> Ici sont répertoriés nos différents Dossiers </h5>

        <select id="sortByFolder">  
          <option onSelect={() => getData()}> Afficher affaires en cours et clôturées </option>  
          <option onSelect={() => getStatusFalse()}> Afficher affaires en cours </option>  
          <option onSelect={() => getStatusTrue()}> Afficher affaires clôturées </option>   
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
            {APIData.map((data) => {
              return (
                <tr>
                  <td id="code">{data.code}</td>
                  <td id="statut">{data.status ? 'Clôturé':'En cours'}</td>
                  <td id="clients">/</td>
                  <td id="actions">
                    <Link to={'/dossiers/' + data.id}>
                      <IonButton id="eyeButton" color="primary" size="small">
                        <IonIcon id="eyeIcon" slot="icon-only" ios={eyeOutline} md={eyeSharp} />
                      </IonButton>
                    </Link>
                
                    <IonButton onClick={() => setShowEditModal(true)} id="createButton" color="warning" size="small"><IonIcon id="createIcon" slot="icon-only" ios={createOutline} md={createSharp} /></IonButton>
                    <IonButton onClick={() => message({
                      header: "Supprimer un dossier",
                      message: "Voulez-vous vraiment supprimer ce dossier ?",
                      buttons: [
                        {text: 'Annuler', role: 'cancel'},
                        {text: 'Confirmer', handler: () => onDelete(data.id)} 
                      ]
                      })
                      } id="trashButton" color="danger" size="small">
                        <IonIcon id="trashIcon" slot="icon-only" ios={trashOutline} md={trashSharp} />
                    </IonButton> 
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>       

        <IonModal isOpen={showEditModal}>
          <IonContent>
            <IonButton color="danger" id="closeModal" onClick={() => setShowEditModal(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
            </IonButton>
            <h5 className="titleModal">Nouveau Dossier</h5>

            <form className="formFolder">
              {fields.map((field, index) => {
                const {label, required, requiredOptions, props} = field;
                
                return (
                  <IonItem key={`form_field_${index}`} lines="full">
                    <>
                      <IonLabel position="fixed">{label}</IonLabel>
                      <input className="inputForm" {...props} {...register(props.name, {required, ...requiredOptions})} />
                    </>

                    {required && errors[props.name] && <IonIcon icon={alertCircleOutline} color="danger"/>}
                  </IonItem>
                );
              })}

              <IonButton type="submit" className="btnSubmit">Ajouter</IonButton>
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
