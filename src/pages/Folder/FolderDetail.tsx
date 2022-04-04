import React, { useState, useEffect  } from 'react';
import axios from 'axios';
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

import './FolderDetail.css';

interface SearchbarChangeEventDetail {
  value?: string;
}

const FolderDetail: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);

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

  const onDelete = (id: any) => {
    axios.delete(`http://localhost:3000/case/${id}`)
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
      label: "Date de début",
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
      label: "Date de fin",
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
        {APIData.map((data) => {
            return (
                <div>
                    <h5 className="titleModal">{"Dossier > " + data.code}</h5>

                    <div className="modalButtons">
                      <IonButton id="btnNewFolder" onClick={() => setShowEditModal(true)}>Modifier Dossier</IonButton>
                      <IonButton color="danger">Supprimer</IonButton>
                    </div>

                    <h3>{data.code}</h3>
                    <h6>{data.status}</h6>
                    <h6>{"Affaire ouverte le " + data.creationDate}</h6>

                    <h4>Description</h4>
                    <p>{data.description}</p>

                    <h4>Clients concernés</h4>
                    <p>{data.user.lastName + " " + data.user.firstName}</p>

                    <h4>Evenements</h4>
                    <ul>
                      <li>{data.event.date + " (" + data.event.duration + "h) - " + data.event.description}</li>
                    </ul>
                    <IonButton id="btnNewEvent">Ajouter un évènement</IonButton>

                    <h4>{"Total : " + data.event.total.duration + "h"}</h4>
                </div>
              );
        })}

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

      </IonContent>
    </IonPage>
  );
};

export default FolderDetail;
