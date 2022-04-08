import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {format, parseISO} from 'date-fns';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, 
  IonButton, IonModal, IonItem, IonLabel, useIonAlert } from '@ionic/react';

import {
  eyeOutline, eyeSharp,
  createOutline, createSharp,
  trashOutline, trashSharp,
  closeOutline, closeSharp,
  alertCircleOutline
} from 'ionicons/icons';

import Pagination from '../../components/Pagination'
import clientData from './Client.type';
import ModalEditClient from "../../components/ModalEditClient";
import './Client.css';

const Client: React.FC = () => {
  const [APIData, setAPIData] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<clientData>();
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [message] = useIonAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  let { id } = useParams() as any;

  const fetchData = async () => {
    axios.get('http://localhost:3000/client/all/case').then((response) => {
        setAPIData(response.data);
    }).then(() => getData())
  };

  useEffect(()=>{
    fetchData()
  },[isOpen, isEdit, setAPIData])

  const setData = (data: { id: any; firstName: string; lastName: string; address: string; birthDate: string; }) => {
    let { id, firstName, lastName, address, birthDate} = data;
    localStorage.setItem('ID', id);
    localStorage.setItem('First Name', firstName);
    localStorage.setItem('Last Name', lastName);
    localStorage.setItem('Address', address);
    localStorage.setItem('birthDate', birthDate);
  }

  const getData = () => {
    axios.get('http://localhost:3000/client/all/case')
    .then((getData) => {
        setAPIData(getData.data);
    })
  }

  const onDelete = (id: any) => {
    axios.delete(`http://localhost:3000/client/${id}`)
    .then(() => {
        APIData.slice(id, 1);
    })
    getData();
  }
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = APIData.slice(indexOfFirstPost, indexOfLastPost)
  const paginate = (pageNumbers:any) => setCurrentPage(pageNumbers)

  const {register, handleSubmit, reset, formState: {errors}} = useForm({
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
    {
      label: "Inscription",
      required: true,
      requiredOptions: {
        minDate: '01/01/2000'
      },
      props: {
        name: "createdAt",
        type: "date",
        inputmode: "datePicker",
        placeholder: "jj/mm/AAAA"
      }
    }
  ];

  const onSubmit = (data: any, e:any) => {
    axios.post('http://localhost:3000/client', data)
    .then(() => {
        getData();
    })
    .catch((error) => {
        console.log(error);
    })
    e.target.reset();
    window.location.reload();
  }

  function modClient(client: any) {
    setSelectedClient(client)
    setIsEdit(true)
  }

  function addClient() {
    setIsEdit(false)
    setIsOpen(true)
  }

  const searchText = (e:any) => {
    setActiveFilter(e.target.value);
  }

  let dataSearch = APIData.filter(item => {
    return Object.keys(item).some(key =>
      item["lastName"].toString().toLowerCase().includes(activeFilter.toString().toLowerCase())
    )
  });

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
        <h5 id="titlePageClient"> Ici sont répertoriés nos différents Clients </h5> <br/>
        <label id="labelSearch">Rechercher par nom :</label> <input type="text" placeholder="Dupont" value={activeFilter} onChange={searchText}/>

        <table>
          <thead>
            <tr>
              <th id="headName">Nom</th>
              <th id="headAffairs">Affaires associées</th>
              <th id="headActions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataSearch.map((data: any, index: number) => {
              return (
                <tr key={data.id}>
                  <td id="name">{data.lastName + " " + data.firstName}</td>
                  <td id="affairs">
                    {data.cases.map((caseData: any) => {
                      return (
                        <div>
                          <p>{caseData.code}</p>
                        </div>
                      )
                    })}
                  </td>
                  <td id="actions">
                    <Link to={'/clients/' + data.id}>
                      <IonButton id="eyeButton" color="primary" size="small">
                        <IonIcon id="eyeIcon" slot="icon-only" ios={eyeOutline} md={eyeSharp} />
                      </IonButton>
                    </Link>

                    <IonButton  onClick={() => modClient(data)} id="createButton" color="warning" size="small"><IonIcon id="createIcon" slot="icon-only" ios={createOutline} md={createSharp} /></IonButton>
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
              )
            })}
          </tbody>
        </table> 

        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
          <IonContent>
            <IonButton color="danger" id="closeModal" onClick={() => setIsOpen(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp}/>
            </IonButton>
            <h3 className="titleModal">Nouveau Client</h3>

            <form className="formModal" onSubmit={handleSubmit(onSubmit)}>
              {fields.map((field, index) => {

                const {label, required, requiredOptions, props} = field;
                return (
                    <IonItem key={`form_field_${index}`} lines="full">
                      <>
                        <IonLabel position="fixed">{label}</IonLabel>
                        <input
                            className="inputForm" {...props} {...register(props.name, {required, ...requiredOptions})} />
                      </>

                      {required && errors[props.name] && <IonIcon icon={alertCircleOutline} color="danger"/>}
                    </IonItem>
                );
              })}

              <IonButton type="submit" className="btnSubmit">Ajouter</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonButton id="btnNewClient" onClick={() => addClient()}>Ajouter un client</IonButton>
        {selectedClient ? (
            <ModalEditClient
                client={selectedClient}
                isOpen={isEdit}
                setIsOpen={() => setIsEdit(false)}
            />
        ) : null}

        <Pagination totalPost={APIData.length} postsPerPage={postsPerPage} paginate={paginate}></Pagination>

      </IonContent>
    </IonPage>
  );
};

export default Client;