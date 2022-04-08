import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
  IonButton, useIonAlert, isPlatform } from '@ionic/react';

import {
  personOutline, personSharp
} from 'ionicons/icons';

import clientData from './Client.type';
import ModalEditClient from "../../components/ModalEditClient";
import './ClientDetail.css';

const ClientDetail: React.FC = () => {

  const isElectron = isPlatform('electron');
  const history = useHistory();
  const [selectedClient, setSelectedClient] = useState<clientData>();
  const [message] = useIonAlert();
  const [isEdit, setIsEdit] = useState(false);

  let { id } = useParams() as any;

  const [data, setAPIData] = useState([] as any);

  const fetchData = async (id: any) => {
    axios.get(`http://localhost:3000/client/case/${id}`).then((response) => {
      setAPIData(response.data);
    })
  };

  useEffect(() => {
    fetchData(id);
  }, [id, isEdit])

  const onDelete = () => {
    axios.delete(`http://localhost:3000/client/${id}`)
    history.push('/clients')
  }

  function modClient(client: any) {
    setSelectedClient(client)
    setIsEdit(true)
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
        name: "lastName",
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
        name: "firstName",
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
        name: "birthDate",
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
          <IonTitle>{"Detail de " + data[0]?.lastName + " " + data[0]?.firstName}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="app-container">
        <h3 className="clientName"><Link to={'/clients'}><u>Clients</u></Link> &gt; {data[0]?.lastName + " " + data[0]?.firstName}</h3>

        <div className="app-button">
          <IonButton onClick={() => message({
            header: "Supprimer un client",
            message: "Voulez-vous vraiment supprimer ce client ?",
            buttons: [
              {text: 'Annuler', role: 'cancel'},
              {text: 'Confirmer', handler: () => onDelete()}
            ]
            })
            } id="btnDeleteClient" color="danger"> Supprimer
          </IonButton>

          <IonButton onClick={() => modClient(data[0])} id="btnUpdateClient">Modifier</IonButton>
        </div>

        <div className="customers">
          <h1 className="clientIconName"><IonIcon id="personIcon" slot="icon-only" ios={personOutline} md={personSharp} /> {data[0]?.lastName + " " + data[0]?.firstName}</h1>
          <h5>Client depuis le {data[0]?.createdAt}</h5> <br/>

          <h3 className="modalSubtitle">Adresse</h3>
          <h4>{data[0]?.address}</h4> <br/>

          <h3 className="modalSubtitle">Date de naissance</h3>
          <h4>{data[0]?.birthDate}</h4> <br/>

          <h3 className="modalSubtitle">Dossiers associés</h3>
          <h4><div>{data[0]?.cases.map((cases : any)=>{
            return (
              <p>
                <Link to={'/dossiers/' + cases.id}>{cases.code}</Link>
              </p>
            )
            })}
          </div>
          </h4>
        </div>

        {selectedClient ? (
            <ModalEditClient
                client={selectedClient}
                isOpen={isEdit}
                setIsOpen={() => setIsEdit(false)}
            />
          ) : null}
      </IonContent>
    </IonPage>
  );
};

export default ClientDetail;
