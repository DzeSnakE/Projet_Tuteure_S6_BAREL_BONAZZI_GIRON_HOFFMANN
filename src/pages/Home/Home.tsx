import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import React from "react";

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
        <h2> Bienvenue sur notre application </h2>
        <h6> de Gestion de Cabinet d'Avocat </h6>
        <img src="../../public/assets/img/balance_move.gif" alt="Balance gif"/>

        <p> &copy; Licence Pro WMCE (2022) <br/>
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
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Home;
