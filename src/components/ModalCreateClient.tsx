import React, {useEffect, useState} from "react";
import {
    IonButton,
    IonButtons,
    IonContent, IonDatetime,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import {closeOutline, closeSharp} from "ionicons/icons";
import {format, parseISO} from 'date-fns';
import clientData from "./../pages/Client/Client.type";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const path = require('path');
const fs = window.require('fs');

const ModalCreateFolder = (props: ModalProps) => {
    const {isOpen, setIsOpen} = props;
    const [date, setDate] = useState("");
    const [data, setData]=useState<any[]>([]);
    const [states, setStates] = useState<clientData>({
        id:"",
        lastname: "",
        firstname: "",
        address: "",
        birthdate: "",
        inscription: "",
    });


    const handleChange = (e:any, inputName: string) => {
        setStates({...states, [inputName]: e.detail.value});
    }

    const formatDate = (value: string) => {
        return format(parseISO(value), 'yyyy-MM-dd');
    };

    const getData=()=>{

        fetch('clients.json'
            ,{
                headers : {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json'
                }
            }).then(function(response){
            console.log(response)
            return response.json();
        }).then(function(data) {
            console.log(data);
            setData(data)
        }).catch(function (error) {
            console.log(error);
        });
    }
    useEffect(()=>{
        getData()
    },[setData])

    const clientsLength = data.length;
    let pathName:string = path.join(__dirname, './xampp/htdocs/Projet_Tuteure_S6_BAREL_BONAZZI_GIRON_HOFFMANN/electron/app')

    function createClient(clients:any) {
        const id = clientsLength
        const client: clientData = {
            "id": id,
            "lastname":states.lastname,
            "firstname":states.firstname,
            "birthdate":date,
            "address":states.address,
            "inscription":date
        }
        let file = path.join(pathName, 'clients.json');
        if (!fs.existsSync(file)) {
            fs.writeFile(file, JSON.stringify([data], null, 2), (error: any) => {
                if (error) {
                    console.log(error)
                }
                console.log("Le fichier a été créé avec succès !")
            });
        } else {
            clients = fs.readFileSync(file, 'utf8');
            var list = (clients.length) ? JSON.parse(clients) : [];
            if (list instanceof Array) list.push(client)
            else list = [client]
            fs.writeFileSync(file, JSON.stringify(list, null, 2));
            console.log("Un nouveau client a été ajouté ! ")
        }
        setIsOpen(false);
        getData()
        setStates({
            id:"",
            lastname: "",
            firstname: "",
            address: "",
            birthdate: "",
            inscription: "",
        })
    }

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
                    <IonTitle>Créer un Client</IonTitle>
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
                <IonItem lines='none'>
                    <IonLabel>Date de naissance</IonLabel>
                </IonItem>
                <IonItem>
                    <IonDatetime
                        id='date'
                        name='date'
                        aria-current="date"
                        onIonChange={ev => setDate(formatDate(ev.detail.value!))}
                    />
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
                <IonItem lines='none'>
                    <IonLabel>Date d'inscription</IonLabel>
                </IonItem>
                <IonItem>
                    <IonDatetime
                        id='date'
                        name='date'
                        aria-current="date"
                        onIonChange={e => setDate(formatDate(e.detail.value!))}
                    />
                </IonItem>

                <IonButton expand='block' type='submit' onClick={createClient}>
                    Ajouter un client
                </IonButton>
            </IonContent>
        </IonModal>
    )
}
export default ModalCreateFolder;
