import React, { useState } from 'react';
import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, 
  IonSearchbar, IonButton, IonModal } from '@ionic/react';

import {
  eyeOutline, eyeSharp,
  createOutline, createSharp,
  trashOutline, trashSharp,
  closeOutline, closeSharp
} from 'ionicons/icons';

import './Client.css';

interface SearchbarChangeEventDetail {
  value?: string;
}

const Client: React.FC = () => {
  const [searchClient, setSearchClient] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Clients</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h6> Ici sont répertoriés nos différents Clients </h6>
        <IonSearchbar id="searchBar" value={searchClient} onIonChange={e => setSearchClient(e.detail.value!)} placeholder="Rechercher un Client ..."/>
      
        <table>
          <thead>
            <tr>
              <th id="name">Nom</th>
              <th id="affairs">Affaires associées</th>
              <th id="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> </td>
              <td> </td>
              <td> 
                <IonButton onClick={() => setShowModal(true)} id="eyeButton" color="primary" size="small"><IonIcon id="eyeIcon" slot="icon-only" ios={eyeOutline} md={eyeSharp} /></IonButton>
                <IonButton id="createButton" color="warning" size="small"><IonIcon id="createIcon" slot="icon-only" ios={createOutline} md={createSharp} /></IonButton>
                <IonButton id="trashButton" color="danger" size="small"><IonIcon id="trashIcon" slot="icon-only" ios={trashOutline} md={trashSharp} /></IonButton>
              </td>
            </tr>
          </tbody>
        </table> 

        <IonModal isOpen={showModal}>
          <IonContent>
            <IonButton id="closeModal" onClick={() => setShowModal(false)}>
              <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} />
            </IonButton>
            <h2>TADAAAA</h2>
          </IonContent>
        </IonModal>

        <div className="pagination">
          <a href="#">Précédent</a>
          <a href="#" className="active">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <a href="#">Suivant</a>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Client;
