import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
import folderData from './Folder.type';
import './Folder.css';

const Folder: React.FC = () => {
  const [APIData, setAPIData] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<folderData>();
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [message] = useIonAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  let { id } = useParams() as any;
  console.log('id :' + id);

  useEffect(() => {
    axios.get(`http://localhost:3000/case/all/client`)
      .then((response) => {
        console.log(response.data)
        setAPIData(response.data);
      })
  }, [id]);

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
    axios.get('http://localhost:3000/case')
    .then((getData) => {
        setAPIData(getData.data);
    })
  }

  const getDataStatusTrue = () => {
    axios.get('http://localhost:3000/case/status/true')
    .then((getData) => {
        setAPIData(getData.data);
    })
  }

  const getDataStatusFalse = () => {
    axios.get('http://localhost:3000/case/status/false')
    .then((getData) => {
        setAPIData(getData.data);
    })
  }
  
  const onDelete = (id:any) => {
    axios.delete(`http://localhost:3000/case/${id}`)
    .then(() => {
        getData();
    })
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = APIData.slice(indexOfFirstPost, indexOfLastPost)
  const paginate = (pageNumbers:any) => setCurrentPage(pageNumbers)

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

  const searchText = (e:any) => {
    setActiveFilter(e.target.value);
  }

  let dataSearch = APIData.filter(item => {
    return Object.keys(item).some(key =>
      item["code"].toString().toLowerCase().includes(activeFilter.toString().toLowerCase())
    )
  });

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
          <option onSelect={() => getDataStatusFalse()}> Afficher affaires en cours </option>  
          <option onSelect={() => getDataStatusTrue()}> Afficher affaires clôturées </option>   
        </select> <br/> <br/>

        <label id="labelSearch">Rechercher par code :</label> <input type="text" placeholder="aaaa-bbbb-cccc-dddd" value={activeFilter} onChange={searchText}/>

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
                  <td id="clients"> 
                    {data.clients.map((client : any) => {
                      return (
                        <p>{client.firstName} {client.lastName}</p>
                      )
                    })}
                  </td>
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

        <IonButton id="btnNewFolder" onClick={() => setShowEditModal(true)}>Ajouter un dossier</IonButton>   
        <Pagination totalPost={APIData.length} postsPerPage={postsPerPage} paginate={paginate}></Pagination>

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

      </IonContent>
    </IonPage>
  );
};

export default Folder;
