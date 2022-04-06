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

const path = require('path');
const fs = window.require('fs');

const ModalEditClient = (props: ModalProps) => {
    const {isOpen, client, setIsOpen} = props;

    const [states, setStates] = useState<clientData>({
        id: client.id,
        codeClient: client.codeClient,
        lastname: client.lastname,
        firstname: client.firstname,
        address: client.address,
        birthdate: client.birthdate,
        inscription: client.inscription
    });

    const handleChange = (e:any, inputName: string) => {
        setStates({...states, [inputName]: e.detail.value});
    }

    let pathName:string = path.join(__dirname, './xampp/htdocs/Projet_Tuteure_S6_BAREL_BONAZZI_GIRON_HOFFMANN/electron/app')

    function updateClient(clients:any) {
        const client: clientData = {
            "id": states.id,
            "codeClient":states.codeClient,
            "lastname":states.lastname,
            "firstname":states.firstname,
            "address":states.address,
            "birthdate":states.birthdate,
            "inscription":states.inscription
        }
        let file = path.join(pathName, 'clients.json');
        if (fs.existsSync(file)) {
            clients = fs.readFileSync(file, 'utf8');
            var list = (clients.length) ? JSON.parse(clients) : [];
            var foundId = list.findIndex(function(obj: { id: any; }){
                return obj.id == client.id
            });
            if(foundId !== -1){
                list[foundId] = client
            }
            console.log(client.id)
            console.log(list[client.id])
            fs.writeFileSync(file, JSON.stringify(list, null, 2));
            console.log("Le client a été mis à jour! ")
            setIsOpen(false);
        }
    }


    useEffect(() => {
        setStates(client);

    }, [client.birthdate,client]);

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
                              id='lastname'
                              required
                              name='lastname'
                              value={states.lastname}
                              onIonChange={e => handleChange(e, "lastname")}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Prénom</IonLabel>
                    <IonInput type='text'
                              id='firstname'
                              required
                              value={states.firstname}
                              name='firstname'
                              onIonChange={e => handleChange(e, "firstname")}/>
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
                              value={states.birthdate}/>
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
