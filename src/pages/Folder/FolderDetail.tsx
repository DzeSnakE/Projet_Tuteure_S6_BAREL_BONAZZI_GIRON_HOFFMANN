import React, { useState, useEffect  } from 'react';
//import axios from 'axios';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonButton, IonModal, IonItem, IonLabel, useIonAlert } from '@ionic/react';

import {
    folderOutline, folderSharp,
    closeOutline, closeSharp,
    alertCircleOutline
} from 'ionicons/icons';

import './FolderDetail.css';
import folderData from "../Folder/Folder.type";
import clientData from "../Client/Client.type";
import {register} from "../../serviceWorkerRegistration";
import ModalEditFolder from "../../components/ModalEditFolder";

const FolderDetail: React.FC = () => {
    const history = useHistory();
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([] as any);
    const [selectedFolder, setSelectedFolder] = useState<folderData>();
    const [message] = useIonAlert();
    const [showEventModal, setShowEventModal] = useState(false);

    let { id } = useParams() as any;
    console.log('id :' + id);

    const getData = (id: any) => {

        fetch('dossiers.json'
            , {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json'
                }
            }).then(function (response) {
            console.log(response)
            return response.json();
        }).then(function (data) {
            console.log(data);
            const test = data.filter(function(item:any){
                return item.id == id;
            }).map(function({id, code, description, status, startDate, client, endDate }:folderData){
                return {id,code, description, status, startDate, client, endDate };
            });
            console.log(test);
            setData(test)
        }).catch(function (error) {
            console.log(error);
        });
    }
    useEffect(() => {
        getData(id)
    }, [id, isEdit])


    const onDelete = () => {

        history.push('/dossiers')
    }

    function modFolder(folder: any) {

        setSelectedFolder(folder)
        setIsEdit(true)
    }
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: "onTouched",
        reValidateMode: "onChange"
    });
    const fieldsEvent = [
        {
            label: "Date",
            required: true,
            requiredOptions: {
                minDate: '01/01/2000'
            },
            props: {
                name: "date",
                type: "date",
                inputmode: "datePicker",
                placeholder: "jj/mm/AAAA"
            }
        },
        {
            label: "Durée",
            required: true,
            requiredOptions: {
                minLength: 2,
                maxLength: 5
            },
            props: {
                name: "duree",
                type: "number",
                placeholder: "24"
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
                placeholder: "Description de l'evenement ..."
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
                    {data && data.length>0 && data.map((data: folderData) => {
                        return(
                            <IonTitle><IonTitle>{"Detail de " + data.code}</IonTitle></IonTitle>
                        )})}
                </IonToolbar>
            </IonHeader>
            {data && data.length>0 && data.map((data: folderData) => {
                return(
            <IonContent className="app-container">
                <h3 className="folderName"><Link to={'/dossiers'}><u>Dossiers</u></Link> &gt; {data.code}</h3>

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

                    <IonButton id="btnUpdateClient" onClick={() => modFolder(data)}>Modifier</IonButton>
                </div>

                <div className="folders">
                    <h1 className="folderIconName"><IonIcon id="folderIcon" slot="icon-only" ios={folderOutline} md={folderSharp} /> {data.code}</h1>
                    <h4>&gt; {data.status ? 'Clôturé':'En cours'}</h4>
                    <h5>{"Affaire ouverte le " + data.startDate}</h5> <br/>

                    <h3 className="modalSubtitle">Description</h3>
                    <h4>{data.description}</h4> <br/>

                    <h3 className="modalSubtitle">Clients concernés</h3>
                    <h4>/</h4> <br/>

                    <h3 className="modalSubtitle">Evenements</h3>
                    <h4>/</h4>
                    <IonButton color="success" id="btnNewEvent" onClick={() => setShowEventModal(true)}>Ajouter evenement</IonButton>
                </div>

                <IonModal isOpen={showEventModal}>
                    <IonContent>
                        <IonButton color="danger" id="closeModal" onClick={() => setShowEventModal(false)}>
                            <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
                        </IonButton>
                        <h5 className="titleModal">Nouvel Evenement</h5>

                        <form className="formFolder">
                            {fieldsEvent.map((fieldEvent, index) => {
                                const {label, required, requiredOptions, props} = fieldEvent;

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

                {selectedFolder ? (
                    <ModalEditFolder
                        folder={selectedFolder}
                        isOpen={isEdit}
                        setIsOpen={() => setIsEdit(false)}
                    />
                ) : null}
            </IonContent>
            )})};
        </IonPage>
    );
};

export default FolderDetail;
