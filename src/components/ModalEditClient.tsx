import React, {useEffect, useState} from "react";
import axios from 'axios';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {closeOutline, closeSharp} from "ionicons/icons";

import clientData from "./../pages/Client/Client.type";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    client: clientData
}

const ModalEditClient = (props: ModalProps) => {
    const [APIData, setAPIData] = useState<any[]>([]);

    const fetchData = async () => {
        axios.get('http://localhost:3000/client/all/case').then((response) => {
            setAPIData(response.data);
        }).then(() => getData())
    };

    useEffect(() => {
        fetchData();
    },[])

    const setData = (data: { id: any; firstName: string; lastName: string; address: string; birthDate: string; }) => {
        let { id, firstName, lastName, address, birthDate} = data;
        localStorage.setItem('ID', id);
        localStorage.setItem('First Name', firstName);
        localStorage.setItem('Last Name', lastName);
        localStorage.setItem('Address', address);
        localStorage.setItem('birthDate', birthDate);
    }

    const getData = () => {
      axios.get('http://localhost:3000/client')
      .then((getData) => {
          setAPIData(getData.data);
      })
    }

    const {isOpen, client, setIsOpen} = props;
    const [states, setStates] = useState<clientData>({
        id: client.id,
        codeClient: client.codeClient,
        lastName: client.lastName,
        firstName: client.firstName,
        address: client.address,
        birthDate: client.birthDate,
        createdAt: client.createdAt
    });

    const handleChange = (e:any, inputName: string) => {
        setStates({...states, [inputName]: e.detail.value});
    }

    function updateClient(clients:any) {
        const client: clientData = {
            "id": states.id,
            "codeClient":states.codeClient,
            "lastName":states.lastName,
            "firstName":states.firstName,
            "address":states.address,
            "birthDate":states.birthDate,
            "createdAt":states.createdAt
        }

        if (APIData) {
            var foundId = APIData.findIndex(function(obj: { id: any; }){
                return obj.id == client.id
            });

            if(foundId !== -1){
                APIData[foundId] = client
            }

            console.log(client.id)
            console.log(APIData[client.id])
            axios.put(`http://localhost:3000/client/${client.id}`, client)
            console.log("Le client a été mis à jour! ")
            setIsOpen(false);
        }
    }

    useEffect(() => {
        setStates(client);

    }, [client.birthDate,client]);

    return (
        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='end'>
                        <IonButton onClick={() => setIsOpen(false)}>
                            <IonIcon ios={closeOutline}
                                     md={closeSharp}/>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Editer un Client</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel position="floating">Nom</IonLabel>
                    <IonInput type='text'
                              id='lastName'
                              required
                              name='lastName'
                              value={states.lastName}
                              onIonChange={e => handleChange(e, "lastName")}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Prénom</IonLabel>
                    <IonInput type='text'
                              id='firstName'
                              required
                              value={states.firstName}
                              name='firstName'
                              onIonChange={e => handleChange(e, "firstName")}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Adresse</IonLabel>
                    <IonInput type='text'
                              id='name'
                              required
                              name='address'
                              value={states.address}
                              onIonChange={e => handleChange(e, "address")}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Date de naissance</IonLabel>
                    <IonInput type='text'
                              id='bd'
                              readonly={true}
                              name='bd'
                              value={states.birthDate}/>
                </IonItem>

                <IonButton expand='block'
                           type='submit'
                           onClick={() =>updateClient(client)}>
                    Mettre à jour
                </IonButton>
            </IonContent>
        </IonModal>
    )
}

export default ModalEditClient;
