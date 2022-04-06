import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/react';
import { Link } from 'react-router-dom';

import {
  personOutline, personSharp,
  folderOutline, folderSharp
} from 'ionicons/icons';

import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Accueil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2 id="appTitle"> Bienvenue sur notre app ! </h2>
        <h5 id="appSubtitle"> de Gestion de Cabinet d'Avocat </h5>
        <img id="balanceMove" src="/assets/img/balance_move.gif" alt="Balance gif"/>

        <Link to={'/clients'}>
          <IonButton className="homeButtonClient" color="primary" size="large">
            <IonIcon ios={personOutline} md={personSharp} /> &nbsp;
            Accéder aux Clients
          </IonButton>
        </Link>

        <Link to={'/dossiers'}>
          <IonButton className="homeButtonFolder" color="primary" fill="outline" size="large">
            <IonIcon ios={folderOutline} md={folderSharp} /> &nbsp;
            Accéder aux Dossiers
          </IonButton>
        </Link>

        <h5 id="groupName"> &copy; Licence Pro WMCE (2022) <br/>
          <a target="_blank" rel="noopener" href="https://github.com/Antoine57650">
            BAREL Antoine
          </a> | &nbsp;
          <a target="_blank" rel="noopener" href="https://github.com/DzeSnakE">
            BONAZZI Pierre-Jean
          </a> <br/>
          <a target="_blank" rel="noopener" href="https://github.com/MaxHwK">
            GIRON Maxence
          </a> | &nbsp;
          <a target="_blank" rel="noopener" href="https://github.com/EricHoffmann57">
            HOFFMANN Eric
          </a>
        </h5>
      </IonContent>
    </IonPage>
  );
};

export default Home;
