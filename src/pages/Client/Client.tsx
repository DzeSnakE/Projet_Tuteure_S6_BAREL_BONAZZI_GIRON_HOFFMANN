import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
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

import './Client.css';

const Client: React.FC = () => {
  const [searchClient, setSearchClient] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [message] = useIonAlert();

  let { id } = useParams() as any;
  console.log('id :' + id);

  const [APIData, setAPIData] = useState<any[]>([]);
  useEffect(() => {
    axios.get(`http://localhost:3000/client/all/case`)
      .then((response) => {
        console.log(response.data)
        setAPIData(response.data);
      })
  }, []);

  const setData = (data: { id: any; firstName: string; lastName: string; address: string; birthDate: string; }) => {
    let { id, firstName, lastName, address, birthDate} = data;
    localStorage.setItem('ID', id);
    localStorage.setItem('First Name', firstName);
    localStorage.setItem('Last Name', lastName);
    localStorage.setItem('Address', address);
    localStorage.setItem('birthDate', birthDate);
  }

  const getData = () => {
    axios.get(`http://localhost:3000/client`)
      .then((getData) => {
        setAPIData(getData.data);
      })
  }

  const onDelete = (id: any) => {
    axios.delete(`http://localhost:3000/client/${id}`)
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
    }
  ];
  
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
        <h5 id="titlePageClient"> Ici sont répertoriés nos différents Clients </h5>
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
            {APIData.map((data) => {
              return (
                <tr>
                  <td id="name">{data.lastName + " " + data.firstName}</td>
                  <td id="affairs">/</td>
                  <td id="actions">
                    <Link to={'/clients/' + data.id}>
                      <IonButton id="eyeButton" color="primary" size="small">
                        <IonIcon id="eyeIcon" slot="icon-only" ios={eyeOutline} md={eyeSharp} />
                      </IonButton>
                    </Link>

                    <IonButton onClick={() => setShowEditModal(true)} id="createButton" color="warning" size="small"><IonIcon id="createIcon" slot="icon-only" ios={createOutline} md={createSharp} /></IonButton>
                    <IonButton onClick={() => message({
                      header: "Supprimer un client",
                      message: "Voulez-vous vraiment supprimer ce client ?",
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
            <h3 className="titleModal">Nouveau Client</h3>

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

              <IonButton type="submit" className="btnSubmit">Ajouter</IonButton>
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
