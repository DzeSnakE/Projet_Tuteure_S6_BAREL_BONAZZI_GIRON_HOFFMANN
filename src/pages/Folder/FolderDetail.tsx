import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonButton, IonModal, IonItem, IonLabel, useIonAlert } from '@ionic/react';

import {
  folderOutline, folderSharp,
  closeOutline, closeSharp,
  alertCircleOutline
} from 'ionicons/icons';

import folderData from './Folder.type';
import ModalEditFolder from "../../components/ModalEditFolder";
import './FolderDetail.css';

const FolderDetail: React.FC = () => {
  const history = useHistory();
  const [selectedFolder, setSelectedFolder] = useState<folderData>();
  const [showEventModal, setShowEventModal] = useState(false);
  const [message] = useIonAlert();
  const [isEdit, setIsEdit] = useState(false);


  let { id } = useParams() as any;

  const [data, setAPIData] = useState([] as any);

  const fetchData = async () => {
    axios.get(`http://localhost:3000/case/events/${id}`).then((response) => {
      setAPIData(response.data);
    })
  };

  useEffect(() => {
    fetchData();
  }, [id, isEdit])

  const onDelete = () => {
    axios.delete(`http://localhost:3000/case/${id}`)
    history.push('/dossiers')
  }

  function modFolder(folder: any) {
    setSelectedFolder(folder)
    setIsEdit(true)
  }

  const addEvent = (event : React.FormEvent) =>{
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const description = data.get('description');
    const date = data.get('date');
    const time = data.get('time');
     axios.post(`http://localhost:3000/event`, {
       date: date,
       time: time,
       description: description,
       cases: id,
     })
     window.location.reload();
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
          <IonTitle>{"Detail de " + data[0]?.code}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="app-container">
        <h3 className="folderName"><Link to={'/dossiers'}><u>Dossiers</u></Link> &gt; {data[0]?.code}</h3>

        <div className="app-button">
          <IonButton onClick={() => message({
            header: "Supprimer un dossier",
            message: "Voulez-vous vraiment supprimer ce dossier ?",
            buttons: [
              {text: 'Annuler', role: 'cancel'},
              {text: 'Confirmer', handler: () => onDelete()} 
            ]
            })
            } id="btnDeleteFolder" color="danger"> Supprimer
          </IonButton> 

          <IonButton onClick={() => modFolder(data[0])} id="btnUpdateFolder">Modifier</IonButton>
        </div>

        <div className="folders">
          <h1 className="folderIconName"><IonIcon id="folderIcon" slot="icon-only" ios={folderOutline} md={folderSharp} /> {data[0]?.code}</h1>
          <h4>&gt; {data[0]?.status ? 'Clôturé':'En cours'}</h4>
          <h5>{"Affaire ouverte le " + data[0]?.startDate}</h5> <br/>

          <h3 className="modalSubtitle">Description</h3>
          <h4>{data[0]?.description}</h4> <br/>

          <h3 className="modalSubtitle">Clients concernés</h3>
          <div>
          {data[0]?.clients.map((clients :any )=>{
            return (
            <p>
                <Link to={'/clients/' + clients.id}>{clients.firstName} {clients.lastName}</Link>
                </p>
             )
          })}
          </div>
          <br/>

          <h3 className="modalSubtitle">Evenements</h3>
          <div>
            {data[0]?.event.map((event :any )=> {
              return (
                <p>{event.date} ({event.time + " min"}) - {event.description}</p>
              )
            })}
          </div>

          <IonButton color="success" id="btnNewEvent" onClick={() => setShowEventModal(true)}>Ajouter evenement</IonButton>
        </div>

        <IonModal isOpen={showEventModal}>
          <IonContent>
            <IonButton color="danger" id="closeModal" onClick={() => setShowEventModal(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
            </IonButton>
            <h5 className="titleModal">Nouvel Evenement</h5>

            <form className="formFolder" onSubmit={addEvent}>
              <IonItem>
                <IonLabel>Date</IonLabel>
                <input className="inputEventFormDate" type="date" name="date" />
              </IonItem>
               <IonItem>
                 <IonLabel>Description</IonLabel>
                 <input className="inputEventForm" type="text" name="description" placeholder="L'accusé va se faire juger ..."/>
               </IonItem>
               <IonItem>
                 <IonLabel>Durée (min)</IonLabel>
                 <input className="inputEventForm" type="number" name="time" placeholder="30" />
               </IonItem>

              <IonButton type="submit" className="btnSubmit">Ajouter</IonButton>
            </form>
          </IonContent>
        </IonModal>

        {selectedFolder ? (
            <ModalEditFolder
                folder={selectedFolder}
                isOpen={isEdit}
                setIsOpen={() => setIsEdit(false)}
            />
          ) : null
        }

      </IonContent>
    </IonPage>
  );
};

export default FolderDetail;