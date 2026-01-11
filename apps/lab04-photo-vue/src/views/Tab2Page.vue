<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- ✅ เพิ่มข้อมูลนักศึกษา -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>ข้อมูลนักศึกษา</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>ชื่อ-สกุล:</strong> นายยศนนท์ ดวงไข</p>
          <p><strong>รหัสนักศึกษา:</strong> 663380021-5</p>
        </ion-card-content>
      </ion-card>

      <ion-grid>
        <ion-row>
          <ion-col v-for="photo in photos" :key="photo.filepath" size="6">
            <ion-img :src="photo.webviewPath" />
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="addNewToGallery">
          <ion-icon :icon="camera" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { camera } from 'ionicons/icons'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/vue'

import { usePhotoGallery } from '@/composables/usePhotoGallery'

const { photos, addNewToGallery } = usePhotoGallery()
</script>
