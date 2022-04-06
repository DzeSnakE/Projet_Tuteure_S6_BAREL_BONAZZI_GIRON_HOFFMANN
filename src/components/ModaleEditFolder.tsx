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

import folderData from "./../pages/Folder/Folder.type";

interface ModalFolderProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    folder: folderData
}

const path = require('path');
const fs = window.require('fs');

const ModalEditFolder = (props: ModalFolderProps) => {
    const {isOpen, folder, setIsOpen} = props;

    const [states, setStates] = useState<folderData>({
        id: folder.id,
        code: folder.code,
        description: folder.description,
        status: folder.status,
        startDate: folder.startDate,
        client: folder.client,
        endDate: folder.endDate
    });

    const handleChange = (e:any, inputName: string) => {
        setStates({...states, [inputName]: e.detail.value});
    }

    let pathName:string = path.join(__dirname, './xampp/htdocs/Projet_Tuteure_S6_BAREL_BONAZZI_GIRON_HOFFMANN/electron/app')

    function updateFolder(folders:any) {
        const folder: folderData = {
            "id": states.id,
            "code": states.code,
            "description":states.description,
            "status":states.status,
            "startDate":states.startDate,
            "client":states.client,
            "endDate":states.endDate,
        }
        let file = path.join(pathName, 'dossiers.json');
        if (fs.existsSync(file)) {
            folders = fs.readFileSync(file, 'utf8');
            var list = (folders.length) ? JSON.parse(folders) : [];
            var foundId = list.findIndex(function(obj: { id: any; }){
                return obj.id == folder.id
            });
            if(foundId !== -1){
                list[foundId] = folder
            }
            console.log(folder.id)
            console.log(list[folder.id])
            fs.writeFileSync(file, JSON.stringify(list, null, 2));
            console.log("Le dossier a été mis à jour! ")
            setIsOpen(false);
        }
    }


    useEffect(() => {
        setStates(folder);

    }, [folder.endDate,folder]);

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
                    <IonTitle>Editer un dossier</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel position="floating">Description</IonLabel>
                    <IonInput type='text'
                              id='name'
                              required
                              name='description'
                              value={states.description}
                              onIonChange={e => handleChange(e, "description")}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Date de fin</IonLabel>
                    <IonInput type='text'
                              id='endDate'
                              required
                              name='endDate'
                              value={states.endDate}
                              onIonChange={e => handleChange(e, "endDate")}/>
                </IonItem>
                <IonButton expand='block'
                           type='submit'
                           onClick={() =>updateFolder(folder)}>
                    Mettre à jour
                </IonButton>
            </IonContent>
        </IonModal>
    )
}
export default ModalEditFolder;

