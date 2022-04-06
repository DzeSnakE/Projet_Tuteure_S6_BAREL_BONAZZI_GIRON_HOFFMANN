import React, {useEffect, useState} from "react";
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
    const {isOpen, client, setIsOpen} = props;

    const [states, setStates] = useState<clientData>({
        id: client.id,
        codeClient: client.codeClient,
        lastName: client.lastName,
        firstName: client.firstName,
        address: client.address,
        birthDate: client.birthDate,
        inscription: client.inscription
    });

    const handleChange = (e:any, inputName: string) => {
        setStates({...states, [inputName]: e.detail.value});
    }

    const updateClient = () => {
        const client: clientData = {
            id: states.id,
            codeClient: states.codeClient,
            lastName: states.lastName,
            firstName: states.firstName,
            address: states.address,
            birthDate: states.birthDate,
            inscription: states.inscription
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
                              id='name'
                              required
                              name='nom'
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
                           onClick={updateClient}>
                    Mettre à jour
                </IonButton>
            </IonContent>
        </IonModal>
    )
}

export default ModalEditClient;
