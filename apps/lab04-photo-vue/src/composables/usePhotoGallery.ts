import { ref, watch, onMounted } from 'vue'
import { Camera, CameraResultType, CameraSource, type Photo } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'

export interface UserPhoto {
  filepath: string
  webviewPath: string
}

const PHOTO_STORAGE = 'photos'

export function usePhotoGallery() {
  const photos = ref<UserPhoto[]>([])

  const addNewToGallery = async () => {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      })

      const fileName = `${Date.now()}.jpeg`
      const savedImageFile = await savePicture(capturedPhoto, fileName)

      photos.value = [savedImageFile, ...photos.value]
    } catch (e) {
      console.error('addNewToGallery error:', e)
      // กันจอดำ/ค้าง ถ้ามี error
    }
  }

  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    if (!photo.webPath) throw new Error('Missing photo.webPath')

    // อ่านรูปเป็น base64 (data URL)
    const response = await fetch(photo.webPath)
    const blob = await response.blob()
    const base64 = await convertBlobToBase64(blob) // ได้ "data:image/jpeg;base64,AAAA..."

    // ✅ ต้องตัด prefix ออก เหลือ base64 ล้วน
    const base64Data = base64.split(',')[1]
    if (!base64Data) throw new Error('Failed to parse base64 data')

    // ✅ เขียนไฟล์ลง storage
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    })

    // ✅ ทำ path สำหรับแสดงผล
    // - Native: ใช้ convertFileSrc จาก uri ที่เขียนจริง
    // - Web: ใช้ webPath จากกล้องได้เลย
    const webviewPath = Capacitor.isNativePlatform()
      ? Capacitor.convertFileSrc(savedFile.uri)
      : photo.webPath

    return {
      filepath: fileName,
      webviewPath,
    }
  }

  const convertBlobToBase64 = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject(reader.error)
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })

  const cachePhotos = async () => {
    await Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    })
  }

  const loadSaved = async () => {
    const photoList = await Preferences.get({ key: PHOTO_STORAGE })
    const photosInPreferences: UserPhoto[] = photoList.value ? JSON.parse(photoList.value) : []

    if (Capacitor.isNativePlatform()) {
      // ✅ Native: อ่านไฟล์จาก Directory.Data แล้วแปลงเป็น data URL เพื่อแสดง
      for (const photo of photosInPreferences) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        })
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`
      }
    }
    // ✅ Web: ค่า webviewPath ที่เก็บไว้ใช้ได้เลย (หรือจะ regenerate ก็ได้)

    photos.value = photosInPreferences
  }

  watch(photos, cachePhotos, { deep: true })

  onMounted(() => {
    loadSaved().catch((e) => console.error('loadSaved error:', e))
  })

  return {
    photos,
    addNewToGallery,
  }
}
