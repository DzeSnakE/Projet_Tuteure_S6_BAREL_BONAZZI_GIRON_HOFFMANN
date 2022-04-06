import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, 
  IonButton, IonModal, IonItem, IonLabel } from '@ionic/react';

import {
  personOutline, personSharp,
  closeOutline, closeSharp,
  alertCircleOutline,
} from 'ionicons/icons';

import './ClientDetail.css';

const ClientDetail: React.FC = () => {
  const history = useHistory();
  const [showEditModal, setShowEditModal] = useState(false);

  let { id } = useParams() as any;
  console.log('id :' + id);

  const [data, setAPIData] = useState([] as any);
  useEffect(() => {
    const fetchData = async () => {
      axios.get(`http://localhost:3000/client/${id}`).then((response) => {
        setAPIData(response.data);
        console.log(response.data);
      })
    };
    fetchData();
  }, [])

  const onDelete = () => {
    console.log(id)
    axios.delete(`http://localhost:3000/client/${id}`)
    history.push('/clients')
  }

  const {register, handleSubmit, formState: {errors}} = useForm({
    mode: "onTouched",
    reValidateMode: "onChange"
  });

  const fields = [
    {
      label: "Nom",
      required: true,
      requiredOptions: {
        minLength: 2,
        maxLength: 20
      },
      props: {
        name: "lastname",
        type: "text",
        placeholder: "Doe"
      }
    },
    {
      label: "Prénom",
      required: true,
      requiredOptions: {
        minLength: 2,
        maxLength: 20
      },
      props: {
        name: "firstname",
        type: "text",
        placeholder: "John"
      }
    },
    {
      label: "Adresse",
      required: true,
      requiredOptions: {
        minLength: 10,
        maxLength: 50
      },
      props: {
        name: "address",
        type: "text",
        placeholder: "3 rue de la Réussite"
      }
    },
    {
      label: "Naissance",
      required: true,
      requiredOptions: {
        minDate: '01/01/2000'
      },
      props: {
        name: "birthdate",
        type: "date",
        inputmode: "datePicker",
        placeholder: "jj/mm/AAAA"
      }
    },
  ];
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{"Detail de " + data.lastName + " " + data.firstName}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="app-container">
        <h3 className="clientName"><Link to={'/clients'}><u>Clients</u></Link> &gt; {data.lastName + " " + data.firstName}</h3>

        <div className="app-button">
          <IonButton id="btnDeleteClient" onClick={onDelete} color="danger">Supprimer</IonButton>
          <IonButton id="btnUpdateClient" onClick={() => setShowEditModal(true)}>Modifier</IonButton>
        </div>

        <div className="customers">
          <h1 className="clientIconName"><IonIcon id="personIcon" slot="icon-only" ios={personOutline} md={personSharp} /> {data.lastName + " " + data.firstName}</h1>
          <h5>Client depuis le {data.createdAt}</h5> <br/>

          <h3 className="modalSubtitle">Adresse</h3>
          <h4>{data.address}</h4> <br/>

          <h3 className="modalSubtitle">Date de naissance</h3>
          <h4>{data.birthDate}</h4> <br/>

          <h3 className="modalSubtitle">Dossiers associés</h3>
          <h4>/</h4>
        </div>

        <IonModal isOpen={showEditModal}>
          <IonContent>
            <IonButton color="danger" id="closeModal" onClick={() => setShowEditModal(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
            </IonButton>
            <h4 className="titleModal">{"Modification de " + data.lastName + " " + data.firstName}</h4>

            <form className="formClient">
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

      </IonContent>
    </IonPage>
  );
};

export default ClientDetail;
