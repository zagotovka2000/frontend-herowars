// Временные модели пока не загружены настоящие
export const createPlaceholderModel = (type = 'warrior') => {
   const group = new THREE.Group()
   
   switch (type) {
     case 'warrior':
       // Простая модель воина
       const body = new THREE.Mesh(
         new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8),
         new THREE.MeshStandardMaterial({ color: 0x4FC3F7 })
       )
       body.position.y = 0.6
       group.add(body)
       
       const head = new THREE.Mesh(
         new THREE.SphereGeometry(0.3, 8, 8),
         new THREE.MeshStandardMaterial({ color: 0xFFCCBC })
       )
       head.position.y = 1.5
       group.add(head)
       break
       
     case 'archer':
       // Модель лучника
       const archerBody = new THREE.Mesh(
         new THREE.CylinderGeometry(0.3, 0.3, 1.4, 8),
         new THREE.MeshStandardMaterial({ color: 0x4CAF50 })
       )
       archerBody.position.y = 0.7
       group.add(archerBody)
       break
       
     // Добавьте другие типы...
   }
   
   return group
 }
