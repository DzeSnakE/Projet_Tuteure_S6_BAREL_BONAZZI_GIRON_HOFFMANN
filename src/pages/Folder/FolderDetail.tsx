import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonSearchbar, IonButton, IonModal, IonItem, IonLabel, IonAvatar, isPlatform } from '@ionic/react';
import {
  folderOutline, folderSharp,
  closeOutline, closeSharp,
  alertCircleOutline
} from 'ionicons/icons';

import './FolderDetail.css';


const FolderDetail: React.FC = () => {


  const isElectron = isPlatform('electron');

  const history = useHistory();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [data, setAPIData] = useState([] as any);


  let { id } = useParams() as any;


  const fetchData = async () => {
  if(isElectron){
  const fs = window.require('fs');
  }else{
    axios.get(`http://localhost:3000/case/events/${id}`).then((response) => {
      setAPIData(response.data);
    })
    }
  };

  useEffect(() => {
    fetchData();
  }, [id])

  const onDelete = () => {
    axios.delete(`http://localhost:3000/case/${id}`)
    history.push('/clients')
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
        name: "beginDate",
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



console.log(data)
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
          <IonButton id="btnDeleteFolder" onClick={onDelete} color="danger">Supprimer</IonButton>
          <IonButton id="btnUpdateFolder" onClick={() => setShowEditModal(true)}>Modifier</IonButton>
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

        <IonModal isOpen={showEditModal}>
          <IonContent>
            <IonButton color="danger" id="closeModal" onClick={() => setShowEditModal(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
            </IonButton>
            <h5 className="titleModal">{"Modification du dossier " + data.code}</h5>

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

              <IonButton type="submit" className="btnSubmit">Modifier</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonModal isOpen={showEventModal}>
          <IonContent>
            <IonButton color="danger" id="closeModal" onClick={() => setShowEventModal(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
            </IonButton>
            <h5 className="titleModal">Nouvel Evenement</h5>

            <form className="formFolder" onSubmit={addEvent}>
                   <IonItem>
                     <IonLabel>Date</IonLabel>
                     <input type="date" name="date" />
                   </IonItem>
                    <IonItem>
                      <IonLabel>Description</IonLabel>
                      <input type="text" name="description" />
                    </IonItem>
                    <IonItem>
                      <IonLabel>Temps</IonLabel>
                      <input type="number" name="time" />
                    </IonItem>
              <IonButton type="submit" className="btnSubmit">Ajouter</IonButton>
            </form>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default FolderDetail;
