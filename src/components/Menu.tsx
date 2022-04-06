import React from "react";
import { useLocation } from 'react-router-dom';

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonButtons,
} from '@ionic/react';

import {
  homeOutline, homeSharp,
  personOutline, personSharp,
  folderOutline, folderSharp
} from 'ionicons/icons';

import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Accueil',
    url: '/',
    iosIcon: homeOutline,
    mdIcon: homeSharp
  },
  {
    title: 'Clients',
    url: '/clients',
    iosIcon: personOutline,
    mdIcon: personSharp
  },
  {
    title: 'Dossiers',
    url: '/dossiers',
    iosIcon: folderOutline,
    mdIcon: folderSharp
  }
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <img src="../../public/assets/img/balance.png" alt="Balance image"/>
        <IonList id="home-list">
          {appPages.map((appPage, index) => {
            return (<IonButtons slot="start">
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
              </IonButtons>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
