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
import ModalEditFolder from "../../components/ModalEditFolder";
import './Folder.css';

const Folder: React.FC = () => {
  const [APIData, setAPIData] = useState<any[]>([]);
  const [datac, setDatac]=useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<folderData>();
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [message] = useIonAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  let { id } = useParams() as any;

  const fetchData = async () => {
    axios.get('http://localhost:3000/case/all/client').then((response) => {
        setAPIData(response.data);
    }).then(() => getData())
  };

  useEffect(()=>{
    fetchData()
  },[isOpen, isEdit, setAPIData, setDatac])

  const setData = (data: { id: any; code: string; description: string; startDate: string; status: string; endDate: string; }) => {
    let { id, code, description, startDate, status, endDate} = data;
    localStorage.setItem('ID', id);
    localStorage.setItem('Code', code);
    localStorage.setItem('Description', description);
    localStorage.setItem('Start Date', startDate);
    localStorage.setItem('Status', status);
    localStorage.setItem('End Date', endDate);
  }

  function refreshList() {
    getData()
  }

  const getData = () => {
    axios.get('http://localhost:3000/case/all/client')
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

  const onDelete = (id: any) => {
    axios.delete(`http://localhost:3000/case/${id}`)
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
        name: "startDate",
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

  const onSubmit = (data: any, e:any) => {
    axios.post('http://localhost:3000/case', data)
    .then(() => {
        getData();
    })
    .catch((error) => {
        console.log(error);
    })
    e.target.reset();
    window.location.reload();
  }

  function modFolder(folder: any) {
    setSelectedFolder(folder)
    setIsEdit(true)
  }

  function addFolder() {
    setIsEdit(false)
    setIsOpen(true)
  }

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
            {dataSearch.map((data: any, index: number) => {
              return (
                <tr key={data.id}>
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

                    <IonButton  onClick={() => modFolder(data)} id="createButton" color="warning" size="small"><IonIcon id="createIcon" slot="icon-only" ios={createOutline} md={createSharp} /></IonButton>
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

        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
          <IonContent>
            <IonButton color="danger" id="closeModal" onClick={() => setIsOpen(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp}/>
            </IonButton>
            <h3 className="titleModal">Nouveau Dossier</h3>

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
              <IonItem>
                <IonLabel position="fixed">Statut</IonLabel>
                <select className="selectForm" {...register("status")}>
                  <option value="en cours">en cours</option>
                  <option value="terminé">terminé</option>
                </select>
              </IonItem>
              <IonItem>
                <IonLabel position="fixed">Client associé</IonLabel>
                <select className="selectForm" {...register("client")} onChange={refreshList} multiple={true}>
                  <option>--sélectionnez--</option>
                  {datac && datac.length>0 && datac.map((user: any) => {
                    return (
                        <option key={user.id} value={user.lastname + " " + user.firstname}>{user.lastname + " " + user.firstname}</option>
                    );
                  })})
                </select>
              </IonItem>
              <IonButton type="submit" className="btnSubmit">Ajouter</IonButton>
            </form>
          </IonContent>
        </IonModal>
  
        <IonButton id="btnNewFolder" onClick={() => addFolder()}>Ajouter un dossier</IonButton>
        {selectedFolder ? (
            <ModalEditFolder
                folder={selectedFolder}
                isOpen={isEdit}
                setIsOpen={() => setIsEdit(false)}
            />
        ) : null}

        <Pagination totalPost={APIData.length} postsPerPage={postsPerPage} paginate={paginate}></Pagination>

      </IonContent>
    </IonPage>
  );
};

export default Folder;