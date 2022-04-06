import React, {useState, useEffect} from 'react';
//import axios from 'axios';
import {useParams, useHistory, Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {
    IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonButton, IonModal, IonItem, IonLabel
} from '@ionic/react';

import {
    personOutline, personSharp,
    closeOutline, closeSharp,
    alertCircleOutline,
} from 'ionicons/icons';

import './ClientDetail.css';
import clientData from "./Client.type";

const ClientDetail: React.FC = () => {
    const history = useHistory();
    const [showEditModal, setShowEditModal] = useState(false);
    const [data, setData] = useState([] as any);
    const [selectedClient, setSelectedClient] = useState<clientData>();


    let {id} = useParams() as any;
    console.log('id :' + id);

    const getData = (id: any) => {

        fetch('clients.json'
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
            const test= data.filter(function(item:any){
                return item.id == id;
            }).map(function({id, codeClient, lastname, firstname, birthdate, startDate, address, inscription }:any){
                return {id, codeClient, lastname, firstname, birthdate, startDate, address, inscription };
            });
            console.log(test);
            setData(test)
        }).catch(function (error) {
            // if there's an error, log it
            console.log(error);
        });
    }
    useEffect(() => {
            getData(id)
    }, [id])


    const onDelete = () => {
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
                        <IonMenuButton/>
                    </IonButtons>
                    {data && data.length>0 && data.map((data: any) => {
                        return(
                            <IonTitle><IonTitle>{"Detail de " + data.lastname + " " + data.firstname}</IonTitle></IonTitle>
                        )})}
                </IonToolbar>
            </IonHeader>
            {data && data.length>0 && data.map((data: any) => {
                return(

                    <IonContent className="app-container">
                        <h3 className="clientName"><Link
                            to={'/clients'}><u>Clients</u></Link> &gt; {data.lastname + " " + data.firstname}</h3>

                        <div className="app-button">
                            <IonButton id="btnDeleteClient" onClick={onDelete} color="danger">Supprimer</IonButton>
                            <IonButton id="btnUpdateClient" onClick={() => setShowEditModal(true)}>Modifier</IonButton>
                        </div>

                        <div className="customers">
                            <h1 className="clientIconName"><IonIcon id="personIcon" slot="icon-only" ios={personOutline}
                                                                    md={personSharp}/> {data.lastname + " " + data.firstname}
                            </h1>
                            <h5>Client depuis le {data.inscription}</h5> <br/>

                            <h3>Adresse</h3>
                            <h4>{data.address}</h4> <br/>

                            <h3>Date de naissance</h3>
                            <h4>{data.birthdate}</h4> <br/>

                            <h3>Dossiers associés</h3>
                            <h4>/</h4>
                        </div>

                        <IonModal isOpen={showEditModal}>
                            <IonContent>
                                <IonButton color="danger" id="closeModal" onClick={() => setShowEditModal(false)}>
                                    <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp}/>
                                </IonButton>
                                <h4 className="titleModal">{"Modification de " + data.lastName + " " + data.firstName}</h4>

                                <form className="formClient">
                                    {fields.map((field, index) => {
                                        const {label, required, requiredOptions, props} = field;

                                        return (
                                            <IonItem key={`form_field_${index}`} lines="full">
                                                <>
                                                    <IonLabel position="fixed">{label}</IonLabel>
                                                    <input
                                                        className="inputForm" {...props} {...register(props.name, {required, ...requiredOptions})} />
                                                </>

                                                {required && errors[props.name] &&
                                                <IonIcon icon={alertCircleOutline} color="danger"/>}
                                            </IonItem>
                                        );
                                    })}

                                    <IonButton type="submit" className="btnSubmit">Modifier</IonButton>
                                </form>
                            </IonContent>
                        </IonModal>

                    </IonContent>
                    )})};
        </IonPage>
    );
};
export default ClientDetail;
