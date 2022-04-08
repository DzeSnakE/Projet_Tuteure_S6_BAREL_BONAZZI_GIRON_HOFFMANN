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

import folderData from "./../pages/Folder/Folder.type";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    folder: folderData
}

const ModalEditFolder = (props: ModalProps) => {
    const [APIData, setAPIData] = useState<any[]>([]);

    const fetchData = async () => {
        axios.get('http://localhost:3000/case/all/client').then((response) => {
            setAPIData(response.data);
        }).then(() => getData())
    };

    useEffect(() => {
        fetchData();
    },[])

    const setData = (data: { id: any; code: string; description: string; startDate: string; status: any; endDate: string; }) => {
        let { id, code, description, startDate, status, endDate} = data;
        localStorage.setItem('ID', id);
        localStorage.setItem('Code', code);
        localStorage.setItem('Description', description);
        localStorage.setItem('Start Date', startDate);
        localStorage.setItem('Satus', status);
        localStorage.setItem('End Date', endDate);
    }

    const getData = () => {
      axios.get('http://localhost:3000/case')
      .then((getData) => {
          setAPIData(getData.data);
      })
    }

    const {isOpen, folder, setIsOpen} = props;
    const [states, setStates] = useState<folderData>({
        id: folder.id,
        code: folder.code,
        description: folder.description,
        startDate: folder.startDate,
        status: folder.status,
        endDate: folder.endDate
    });

    const handleChange = (e:any, inputName: string) => {
        setStates({...states, [inputName]: e.detail.value});
    }

    function updateFolder(folders:any) {
        const folder: folderData = {
            "id": states.id,
            "code":states.code,
            "description":states.description,
            "startDate":states.startDate,
            "status":states.status,
            "endDate":states.endDate
        }

        if (APIData) {
            var foundId = APIData.findIndex(function(obj: { id: any; }){
                return obj.id == folder.id
            });

            if(foundId !== -1){
                APIData[foundId] = folder
            }

            console.log(folder.id)
            console.log(APIData[folder.id])
            axios.put(`http://localhost:3000/case/${folder.id}`, folder)
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
