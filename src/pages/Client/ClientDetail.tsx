import React, {useState, useEffect} from 'react';

import {useParams, useHistory, Link} from 'react-router-dom';

import {
    IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar,
    IonButton
} from '@ionic/react';

import {
    personOutline, personSharp,
} from 'ionicons/icons';

import './ClientDetail.css';
import clientData from "./Client.type";
import ModalEditClient from "../../components/ModalEditClient";

const ClientDetail: React.FC = () => {
    const history = useHistory();
    const [isEdit, setIsEdit] = useState(false);
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
            const test = data.filter(function(item:any){
                return item.id == id;
            }).map(function({id, lastname, firstname, birthdate, address, inscription }:clientData){
                return {id, lastname, firstname, birthdate, address, inscription };
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
    }, [id, isEdit])


    const onDelete = () => {
        history.push('/clients')
    }

    function modClient(client: any) {
        setSelectedClient(client)
        setIsEdit(true)
    }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    {data && data.length>0 && data.map((data: clientData) => {
                        return(
                            <IonTitle>{"Detail de " + data.lastname + " " + data.firstname}</IonTitle>
                        )})}
                </IonToolbar>
            </IonHeader>
            {data.map((data: clientData) => {
                return(

                    <IonContent className="app-container">
                        <h3 className="clientName"><Link
                            to={'/clients'}><u>Clients</u></Link> &gt; {data.lastname + " " + data.firstname}</h3>

                        <div className="app-button">
                            <IonButton id="btnDeleteClient" onClick={onDelete} color="danger">Supprimer</IonButton>
                            <IonButton id="btnUpdateClient" onClick={() => modClient(data)}>Modifier</IonButton>
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

                        {selectedClient ? (
                            <ModalEditClient
                                client={selectedClient}
                                isOpen={isEdit}
                                setIsOpen={() => setIsEdit(false)}
                            />
                        ) : null}
                    </IonContent>
                    )})}
        </IonPage>
    );
};
export default ClientDetail;
