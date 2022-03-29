import { IonButtons, IonIcon, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import {
  searchOutline, searchSharp,
  createOutline, createSharp,
  trashOutline, trashSharp
} from 'ionicons/icons';

import './Client.css';

const Client: React.FC = () => {
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

        <div className="searchBox">
          <IonIcon slot="start" id="searchIcon" ios={searchOutline} md={searchSharp} font-size="30px" />
          <input type="text" id="searchClient" name="searchClient" placeholder="Rechercher un Client ..."></input>
        </div>

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
                <button id="createButton"><IonIcon slot="start" id="createIcon" ios={createOutline} md={createSharp} font-size="30px" /></button> 
                <button id="trashButton"><IonIcon slot="start" id="trashIcon" ios={trashOutline} md={trashSharp} font-size="30px" /></button>
              </td>
            </tr>
          </tbody>
        </table> 

        <div className="pagination">
          <a href="#">Previous</a>
          <a href="#" className="active">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <a href="#">Next</a>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Client;
