import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonButtons,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  archiveOutline,
  archiveSharp,
  bookmarkOutline, folderOutline, folderSharp,
  heartOutline,
  heartSharp,
  homeOutline, homeSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp, personOutline, personSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp
} from 'ionicons/icons';
import './Menu.css';
import React from "react";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Accueil',
    url: '/page/Accueil',
    iosIcon: homeOutline,
    mdIcon: homeSharp
  },
  {
    title: 'Clients',
    url: '/page/Clients',
    iosIcon: personOutline,
    mdIcon: personSharp
  },
  {
    title: 'Dossiers',
    url: '/page/Dossiers',
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