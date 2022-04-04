import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, 
  IonSearchbar, IonButton, IonModal, IonItem, IonLabel, IonAvatar } from '@ionic/react';

import {
  closeOutline, closeSharp,
  alertCircleOutline
} from 'ionicons/icons';

import './ClientDetail.css';

<Route
  exact
  path="page/Client/Detail/${data.id}"
  render={(props) => {
    return <ClientDetail />;
  }}
/>

interface SearchbarChangeEventDetail {
  value?: string;
}

const ClientDetail: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);

  const [APIData, setAPIData] = useState<any[]>([]);
    useEffect(() => {
        axios.get(`http://localhost:3000/client`)
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
      label: "Prénom",
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
      label: "Nom",
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
      label: "Date de naissance",
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
        placeholder: "Entrez une adresse"
      }
    }
  ];
  
  console.log(errors);
  // let pathName:string = path.join(__dirname, './xampp/htdocs/Projet_Tuteure_S6_BAREL_BONAZZI_GIRON_HOFFMANN/electron/app')

  // const onSubmit = (user: any, e:any) => {
  //   let file = path.join(pathName, user.filename)

  //   user = {
  //     "lastname": user.lastname,
  //     "firstname": user.firstname,
  //     "birthdate": user.birthdate,
  //     "address": user.address
  //   }

  //   console.log(user);

  //   if (!fs.existsSync(file)) {
  //       fs.writeFile(file, JSON.stringify([user], null, 2), (error: any) => {
  //           if (error) {
  //               console.log(error)
  //           }
  //           console.log("Le fichier a été créé avec succès !")
  //       });
  //   } else {
  //       var clients = fs.readFileSync(file, 'utf8');
  //       var list = (clients.length) ? JSON.parse(clients) : [];
  //       if (list instanceof Array) list.push(user)
  //       else list = [user]
  //       fs.writeFileSync(file, JSON.stringify(list, null, 2));
  //       console.log("Un nouveau client a été ajouté ! ")
  //   }
  //   e.target.reset()
  // }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Detail d'un Client</IonTitle>
        </IonToolbar>
      </IonHeader>

        <IonContent className="ion-padding">
            {APIData.map((data) => {
              return (
                <div>
                    <h5 className="titleModal">{"Clients > " + data.firstname + " " + data.lastname}</h5>

                    <div className="modalButtons">
                      <IonButton id="btnNewClient" onClick={() => setShowEditModal(true)}>Modifier Client</IonButton>
                      <IonButton color="danger">Supprimer</IonButton>
                    </div>

                    <IonAvatar>
                      <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
                    </IonAvatar>

                    <h3>{data.firstname + " " + data.lastname}</h3>
                    <h6>{"client depuis " + data.creationDate}</h6>

                    <h4>Adresse</h4>
                    <p>{data.address}</p>

                    <h4>Date de naissance</h4>
                    <p>{data.birthDate}</p>

                    <h4>Dossiers associés</h4>
                    <p>{data.folder.code + " - " + data.folder.statut}</p> <hr/>
                </div>
              );
            })}

            <IonModal isOpen={showEditModal}>
                <IonContent>
                  <IonButton id="closeModal" onClick={() => setShowEditModal(false)}>
                    <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
                  </IonButton>
                  <h5 className="titleModal">Création d'un Client</h5>

                  <form>
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

        </IonContent>
    </IonPage>
  );
};

export default ClientDetail;
